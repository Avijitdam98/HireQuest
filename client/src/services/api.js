import { supabase } from '../lib/supabase';

export const api = {
  // Jobs
  async getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
    if (error) throw error;
    return data;
  },

  async createJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateJob(id, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteJob(id) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Applications
  async getApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*),
        profiles (*)
      `);
    if (error) throw error;
    return data;
  },

  async createApplication(applicationData) {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateApplication(id, updates) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Profiles
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data;
  },

  async updateProfile(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Analytics
  async getAnalytics() {
    const { data, error } = await supabase
      .rpc('get_dashboard_analytics');
    if (error) throw error;
    return data;
  },
};

export default api;
