import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),

  fetchChats: async (userId) => {
    try {
      set({ loading: true, error: null });
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const isEmployer = userProfile?.role === 'employer';
      
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          application:applications (
            id,
            status,
            job:jobs (
              id,
              title,
              company
            )
          ),
          employer:profiles!chats_employer_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          jobseeker:profiles!chats_jobseeker_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          last_message:messages (
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .eq(isEmployer ? 'employer_id' : 'jobseeker_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Sort chats with most recent messages first
      const sortedChats = data.sort((a, b) => {
        const aTime = a.last_message?.[0]?.created_at || a.updated_at;
        const bTime = b.last_message?.[0]?.created_at || b.updated_at;
        return new Date(bTime) - new Date(aTime);
      });

      set({ chats: sortedChats || [], loading: false });
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchMessages: async (chatId) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles (
            id,
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      set({ messages: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ error: error.message, loading: false });
    }
  },

  sendMessage: async (chatId, userId, content) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            sender_id: userId,
            content
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update messages state
      set((state) => ({
        messages: [...state.messages, data]
      }));

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      set({ error: error.message });
    }
  },

  clearChat: () => {
    set({ currentChat: null, messages: [] });
  }
}));

export default useChatStore;
