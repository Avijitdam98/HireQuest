import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getToken } from '../utils/auth';

const useJobStore = create(
  devtools((set, get) => ({
    jobs: [],
    activeJob: null,
    loading: false,
    error: null,

    handleNewJob: (job) => {
      set((state) => ({
        jobs: [job, ...state.jobs]
      }));
    },

    handleJobUpdated: (updatedJob) => {
      set((state) => ({
        jobs: state.jobs.map(job => 
          job.id === updatedJob.id ? updatedJob : job
        ),
        activeJob: state.activeJob?.id === updatedJob.id ? updatedJob : state.activeJob
      }));
    },

    handleJobDeleted: (jobId) => {
      set((state) => ({
        jobs: state.jobs.filter(job => job.id !== jobId),
        activeJob: state.activeJob?.id === jobId ? null : state.activeJob
      }));
    },

    setActiveJob: (job) => {
      set({ activeJob: job });
    },

    fetchJobs: async (filters = {}) => {
      try {
        set({ loading: true, error: null });
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`http://localhost:5000/api/jobs?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch jobs');
        
        const jobs = await response.json();
        set({ jobs, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    fetchJobById: async (jobId) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch job');
        
        const job = await response.json();
        set({ activeJob: job, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    createJob: async (jobData) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify(jobData)
        });

        if (!response.ok) throw new Error('Failed to create job');
        
        const job = await response.json();
        set((state) => ({
          jobs: [job, ...state.jobs],
          loading: false
        }));
        return job;
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    updateJob: async (jobId, updates) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify(updates)
        });

        if (!response.ok) throw new Error('Failed to update job');
        
        const job = await response.json();
        set((state) => ({
          jobs: state.jobs.map(j => j.id === job.id ? job : j),
          activeJob: state.activeJob?.id === job.id ? job : state.activeJob,
          loading: false
        }));
        return job;
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    deleteJob: async (jobId) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete job');
        
        set((state) => ({
          jobs: state.jobs.filter(job => job.id !== jobId),
          activeJob: state.activeJob?.id === jobId ? null : state.activeJob,
          loading: false
        }));
      } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
      }
    },

    searchJobs: async (query) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch(`http://localhost:5000/api/jobs/search?q=${query}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to search jobs');
        
        const jobs = await response.json();
        set({ jobs, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    getRecommendedJobs: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/jobs/recommended', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to get recommended jobs');
        
        const jobs = await response.json();
        set({ jobs, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  }))
);

export default useJobStore;
