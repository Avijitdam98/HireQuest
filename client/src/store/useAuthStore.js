import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, loading: false });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        console.log('Auth state changed:', _event, session?.user);
        set({ user: session?.user ?? null, loading: false });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ error: error.message, loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user, loading: false, error: null });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}))

// Initialize auth state when the store is created
useAuthStore.getState().initialize();

export default useAuthStore
