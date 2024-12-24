import { supabase } from '../lib/supabase';

const api = {
  // Jobs
  async getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getEmployerJobs() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    if (!user) throw new Error('User not authenticated');

    console.log('Getting employer jobs for user:', user.id);

    // Get jobs and their applications in a single query
    const { data, error } = await supabase
      .from('jobs')
      .select('*, applications(*)')
      .eq('employer_id', user.id);
    
    if (error) throw error;

    // If we have applications, get the user profiles
    const applications = data.flatMap(job => job.applications || []);
    if (applications.length > 0) {
      const userIds = [...new Set(applications.map(app => app.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      // Merge profiles into applications
      const jobsWithProfiles = data.map(job => ({
        ...job,
        applications: (job.applications || []).map(app => ({
          ...app,
          user: profiles.find(p => p.id === app.user_id)
        }))
      }));

      console.log('Jobs with applications and profiles:', jobsWithProfiles);
      return jobsWithProfiles;
    }

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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    if (!user) throw new Error('User not authenticated');

    console.log('Current user:', user.id);

    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('User role:', profile?.role);

    // Build the base query
    let query = supabase.from('applications').select('*');

    if (profile?.role === 'admin') {
      // Admin sees all applications
      console.log('Fetching all applications (admin)');
    } else if (profile?.role === 'employer') {
      // For employers, first get their jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user.id);

      if (!jobs || jobs.length === 0) {
        return {};
      }

      const jobIds = jobs.map(job => job.id);
      query = query.in('job_id', jobIds);
    } else {
      // Regular users see their own applications
      console.log('Fetching user applications for:', user.id);
      query = query.eq('user_id', user.id);
    }

    // Execute the applications query
    const { data: applications, error: appsError } = await query;
    if (appsError) throw appsError;

    // Get the jobs for these applications
    const jobIds = [...new Set(applications.map(app => app.job_id))];
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .in('id', jobIds);

    // Get the user profiles
    const userIds = [...new Set(applications.map(app => app.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    // Merge all the data
    const applicationsWithData = applications.map(app => ({
      ...app,
      job: jobs.find(j => j.id === app.job_id),
      user_profile: profiles.find(p => p.id === app.user_id)
    }));

    // Group by job ID
    const applicationsByJob = applicationsWithData.reduce((acc, app) => {
      if (!acc[app.job_id]) {
        acc[app.job_id] = [];
      }
      acc[app.job_id].push(app);
      return acc;
    }, {});

    console.log('Applications by job:', applicationsByJob);
    return applicationsByJob;
  },

  async getEmployerApplications() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    if (!user) throw new Error('User not authenticated');

    // First get the employer's jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id')
      .eq('employer_id', user.id);

    if (jobsError) throw jobsError;
    if (!jobs || jobs.length === 0) return [];

    // Then get applications for those jobs
    const jobIds = jobs.map(job => job.id);
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*)
      `)
      .in('job_id', jobIds);

    if (error) throw error;
    
    // Get user profiles for the applications
    const userIds = data.map(app => app.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Merge profiles into applications
    const applicationsWithProfiles = data.map(app => ({
      ...app,
      profiles: profiles.find(p => p.id === app.user_id)
    }));

    return applicationsWithProfiles;
  },

  async getJobApplications(jobId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*),
        profiles (*)
      `)
      .eq('job_id', jobId);

    if (error) throw error;
    return data;
  },

  async getUserApplications() {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (*),
        profiles (*)
      `)
      .eq('user_id', user.id);

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

  async updateApplicationStatus(applicationId, status) {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) throw error;
    return { success: true };
  },

  async uploadCV(cvFile) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw new Error(`Authentication error: ${authError.message}`);
      if (!user) throw new Error('User not authenticated');

      // Generate a unique filename
      const timestamp = Date.now();
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${timestamp}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Attempting to upload file:', {
        bucket: 'resume',
        filePath,
        fileSize: cvFile.size,
        fileType: cvFile.type
      });

      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from('resume')
        .upload(filePath, cvFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resume')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully:', publicUrl);
      return { filePath, publicUrl };
    } catch (error) {
      console.error('Error in uploadCV:', error);
      throw error;
    }
  },

  async applyForJob(jobId, cvPath) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Authentication error: ${authError.message}`);
    if (!user) throw new Error('User not authenticated');

    console.log('Applying for job:', jobId);
    console.log('User:', user.id);
    console.log('CV Path:', cvPath);

    const applicationData = {
      job_id: jobId,
      user_id: user.id,
      cv_url: cvPath,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    console.log('Application data:', applicationData);

    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        jobs (
          *,
          employer_id
        )
      `)
      .single();

    if (error) {
      console.error('Error creating application:', error);
      throw error;
    }

    console.log('Created application:', data);
    return data;
  },

  // Profiles
  profiles: {
    async getById(userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .maybeSingle();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error in getById:', error);
        throw error;
      }
    },

    async update(userId, updates) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .maybeSingle();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error in update:', error);
        throw error;
      }
    },

    async create(userId, profileData) {
      try {
        // First check if profile exists
        const { data: existing } = await supabase
          .from('profiles')
          .select()
          .eq('id', userId)
          .maybeSingle();

        if (existing) {
          return existing;
        }

        const { data, error } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .maybeSingle();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error in create:', error);
        throw error;
      }
    }
  },

  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
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

export { api };
export default api;
