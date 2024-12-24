import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getToken } from '../utils/auth';

const useSearchStore = create(
  devtools((set, get) => ({
    searchResults: [],
    recommendations: [],
    loading: false,
    error: null,

    searchJobs: async (params) => {
      try {
        set({ loading: true, error: null });
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`http://localhost:5000/api/search/jobs?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to search jobs');
        
        const results = await response.json();
        set({ searchResults: results, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    searchProfiles: async (params) => {
      try {
        set({ loading: true, error: null });
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`http://localhost:5000/api/search/profiles?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to search profiles');
        
        const results = await response.json();
        set({ searchResults: results, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    searchTeams: async (params) => {
      try {
        set({ loading: true, error: null });
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`http://localhost:5000/api/search/teams?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to search teams');
        
        const results = await response.json();
        set({ searchResults: results, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    getJobRecommendations: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/search/jobs/recommendations', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to get job recommendations');
        
        const recommendations = await response.json();
        set({ recommendations, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    getTeamRecommendations: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/search/teams/recommendations', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to get team recommendations');
        
        const recommendations = await response.json();
        set({ recommendations, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    getSkillSuggestions: async (description) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/search/skills/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ description })
        });

        if (!response.ok) throw new Error('Failed to get skill suggestions');
        
        const suggestions = await response.json();
        return suggestions;
      } catch (error) {
        set({ error: error.message, loading: false });
        return null;
      }
    },

    getCareerAdvice: async () => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/search/career/advice', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });

        if (!response.ok) throw new Error('Failed to get career advice');
        
        const advice = await response.json();
        return advice;
      } catch (error) {
        set({ error: error.message, loading: false });
        return null;
      }
    },

    generateJobDescription: async (title, requirements) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/search/jobs/generate-description', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ title, requirements })
        });

        if (!response.ok) throw new Error('Failed to generate job description');
        
        const description = await response.json();
        return description;
      } catch (error) {
        set({ error: error.message, loading: false });
        return null;
      }
    },

    analyzeResume: async (resumeText) => {
      try {
        set({ loading: true, error: null });
        const response = await fetch('http://localhost:5000/api/search/resume/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ resumeText })
        });

        if (!response.ok) throw new Error('Failed to analyze resume');
        
        const analysis = await response.json();
        return analysis;
      } catch (error) {
        set({ error: error.message, loading: false });
        return null;
      }
    }
  }))
);

export default useSearchStore;
