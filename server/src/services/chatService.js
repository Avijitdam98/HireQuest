const supabase = require('./supabaseService');
const NotFoundError = require('../utils/errors/NotFoundError');
const websocketService = require('./websocketService');

class ChatService {
  async createChat(chatData) {
    const { data, error } = await supabase
      .from('chats')
      .insert([chatData])
      .select(`
        *,
        participants:profiles(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Notify all participants about the new chat
    data.participants.forEach(participant => {
      if (participant.id !== chatData.creator_id) {
        websocketService.sendToUser(participant.id, {
          type: 'new_chat',
          data
        });
      }
    });

    return data;
  }

  async getChat(chatId) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        participants:profiles(id, full_name, avatar_url)
      `)
      .eq('id', chatId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Chat not found');
    return data;
  }

  async getChatsByUser(userId) {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        participants:profiles(id, full_name, avatar_url),
        messages(
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async sendMessage(messageData) {
    const { data: chat } = await this.getChat(messageData.chat_id);

    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        sender:profiles(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Update chat's updated_at timestamp
    await supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', messageData.chat_id);

    // Send real-time message to all participants
    const messageWithChat = { ...data, chat };
    websocketService.sendChatMessage(messageData.chat_id, messageWithChat);

    return data;
  }

  async getMessages(chatId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(id, full_name, avatar_url)
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async deleteChat(chatId) {
    const { data: chat } = await this.getChat(chatId);
    
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;

    // Notify all participants about chat deletion
    chat.participants.forEach(participant => {
      websocketService.sendToUser(participant.id, {
        type: 'chat_deleted',
        data: { chatId }
      });
    });
  }

  async markMessagesAsRead(chatId, userId) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) throw error;

    // Notify message senders that their messages were read
    websocketService.broadcastToRoom(chatId, {
      type: 'messages_read',
      data: { chatId, userId }
    }, userId);
  }

  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
      .neq('sender_id', userId);

    if (error) throw error;
    return count;
  }
}

module.exports = new ChatService();
