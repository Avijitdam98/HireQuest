import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { api } from '../services/api';
import { supabase } from '../lib/supabase';

const useApplicationStore = create(
  devtools((set, get) => ({
    applications: {},  // Grouped by job ID
    loading: false,
    error: null,
    subscription: null,

    // Initialize real-time subscription
    initializeSubscription: () => {
      const subscription = supabase
        .channel('applications_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'applications'
          },
          async (payload) => {
            // Reload applications when there's a change
            const store = get();
            await store.loadApplications();
          }
        )
        .subscribe();

      set({ subscription });
    },

    // Cleanup subscription
    cleanup: () => {
      const { subscription } = get();
      if (subscription) {
        subscription.unsubscribe();
        set({ subscription: null });
      }
    },

    // Load applications based on user role
    loadApplications: async () => {
      try {
        set({ loading: true, error: null });
        
        // Get applications based on role
        const applicationsByJob = await api.getApplications();
        
        set({ 
          applications: applicationsByJob,
          loading: false 
        });
      } catch (error) {
        console.error('Error loading applications:', error);
        set({ 
          error: error.message, 
          loading: false 
        });
      }
    },

    // Submit a new application
    submitApplication: async (jobId, cvFile) => {
      try {
        set({ loading: true, error: null });
        
        // First upload the CV
        const { filePath, publicUrl } = await api.uploadCV(cvFile);
        
        // Then create the application
        const application = await api.applyForJob(jobId, publicUrl);
        
        // Update will happen automatically through subscription
        set({ loading: false });

        // Reload applications to ensure we have the latest data
        const store = get();
        await store.loadApplications();
        
        return application;
      } catch (error) {
        console.error('Error submitting application:', error);
        set({ 
          error: error.message, 
          loading: false 
        });
        throw error;
      }
    },

    // Update application status
    updateApplicationStatus: async (applicationId, status) => {
      try {
        set({ loading: true, error: null });
        
        const updatedApp = await api.updateApplication(applicationId, { status });
        
        // Update will happen automatically through subscription
        set({ loading: false });
        return updatedApp;
      } catch (error) {
        console.error('Error updating application:', error);
        set({ 
          error: error.message, 
          loading: false 
        });
        throw error;
      }
    },

    // Get applications for a specific job
    getJobApplications: (jobId) => {
      const state = get();
      return state.applications[jobId] || [];
    },

    // Clear all application data
    clearApplications: () => {
      const store = get();
      store.cleanup();
      set({ 
        applications: {},
        loading: false,
        error: null 
      });
    }
  }))
);

export default useApplicationStore;
