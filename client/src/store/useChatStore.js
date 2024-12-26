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

      if (!userProfile) throw new Error('User profile not found');

      const isEmployer = userProfile.role === 'employer';
      
      // First get all chats
      const { data: chats, error: chatsError } = await supabase
        .from('chats')
        .select(`
          id,
          created_at,
          updated_at,
          employer_id,
          jobseeker_id,
          application_id
        `)
        .eq(isEmployer ? 'employer_id' : 'jobseeker_id', userId)
        .order('updated_at', { ascending: false });

      if (chatsError) throw chatsError;

      // Then get profiles and applications data separately
      const chatIds = chats.map(chat => chat.id);
      const profileIds = chats.flatMap(chat => [chat.employer_id, chat.jobseeker_id]);
      const applicationIds = chats.map(chat => chat.application_id);

      const [profilesRes, applicationsRes, lastMessagesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role')
          .in('id', profileIds),
        supabase
          .from('applications')
          .select('id, status, job_id, jobs(id, title, company)')
          .in('id', applicationIds),
        supabase
          .from('messages')
          .select('id, chat_id, content, created_at, sender_id')
          .in('chat_id', chatIds)
          .order('created_at', { ascending: false })
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (applicationsRes.error) throw applicationsRes.error;
      if (lastMessagesRes.error) throw lastMessagesRes.error;

      // Create a map for quick lookups
      const profilesMap = profilesRes.data.reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});

      const applicationsMap = applicationsRes.data.reduce((acc, app) => {
        acc[app.id] = app;
        return acc;
      }, {});

      const lastMessagesMap = lastMessagesRes.data.reduce((acc, msg) => {
        if (!acc[msg.chat_id]) acc[msg.chat_id] = msg;
        return acc;
      }, {});

      // Combine the data
      const enrichedChats = chats.map(chat => ({
        ...chat,
        employer: profilesMap[chat.employer_id],
        jobseeker: profilesMap[chat.jobseeker_id],
        application: applicationsMap[chat.application_id],
        last_message: lastMessagesMap[chat.id]
      }));

      // Sort by last message or updated_at
      const sortedChats = enrichedChats.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.updated_at;
        const bTime = b.last_message?.created_at || b.updated_at;
        return new Date(bTime) - new Date(aTime);
      });

      set({ chats: sortedChats, loading: false });
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
          id,
          content,
          created_at,
          sender_id,
          sender:profiles(id, full_name, avatar_url, role)
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
            content: content
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update chat's updated_at
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      const messages = get().messages;
      set({ messages: [...messages, data] });

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  clearChat: () => set({ currentChat: null, messages: [] })
}));

export default useChatStore;
