import { supabase } from '../lib/supabase';

export const api = {
  // Jobs
  async getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createJob(jobData) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...jobData, employer_id: user.id }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getEmployerJobs() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications (
          id,
          status,
          created_at,
          cv_url,
          user_id
        )
      `)
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Process each job's applications to ensure CV URLs are accessible
    for (const job of data) {
      if (job.applications) {
        for (const app of job.applications) {
          if (app.cv_url) {
            // Check if the URL is already a signed URL
            if (!app.cv_url.includes('token=')) {
              // Extract the path from the public URL
              const path = app.cv_url.split('/cvs/')[1];
              if (path) {
                app.cv_url = await this.getSignedUrl(path);
              }
            }
          }
        }
      }
    }

    return data;
  },

  async updateJob(id, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteJob(id) {
    // First delete all applications for this job
    const { error: appDeleteError } = await supabase
      .from('applications')
      .delete()
      .eq('job_id', id);
    if (appDeleteError) throw appDeleteError;

    // Then delete the job itself
    const { error: jobDeleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    if (jobDeleteError) throw jobDeleteError;
  },

  // Storage
  async ensureBucketExists(bucketName) {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 1024 * 1024 * 10, // 10MB
        allowedMimeTypes: ['application/pdf']
      });
      if (error) throw error;
    }
  },

  async getSignedUrl(path) {
    const { data, error } = await supabase.storage
      .from('cvs')
      .createSignedUrl(path, 3600); // 1 hour expiry
    
    if (error) throw error;
    return data.signedUrl;
  },

  // Applications
  async applyForJob(jobId, cvFile, coverLetter = '') {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Ensure the CVs bucket exists
    await this.ensureBucketExists('cvs');
    
    // Upload CV file
    const timestamp = new Date().getTime();
    const fileName = `${user.id}_${timestamp}_${cvFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(fileName, cvFile);
    
    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('cvs')
      .getPublicUrl(fileName);

    // Create the application record
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        user_id: user.id,
        cv_url: publicUrl,
        cover_letter: coverLetter,
      }])
      .select()
      .single();

    if (applicationError) {
      // If application creation fails, delete the uploaded file
      await supabase.storage
        .from('cvs')
        .remove([fileName]);
      throw applicationError;
    }

    return application;
  },

  async getUserApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAllApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs!inner(*),
        applicant:profiles!applications_user_id_fkey(*)
      `)
      .eq('jobs.employer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process CV URLs to get signed URLs
    for (const app of data) {
      if (app.cv_url) {
        // Check if the URL is already a signed URL
        if (!app.cv_url.includes('token=')) {
          // Extract the path from the public URL
          const path = app.cv_url.split('/cvs/')[1];
          if (path) {
            app.cv_url = await this.getSignedUrl(path);
          }
        }
      }
    }

    return data;
  },

  async updateApplicationStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select();
    if (error) throw error;
    return data[0];
  },

  // Profiles
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  },

  profiles: {
    async getById(id) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error in getById:', error);
        throw error;
      }

      return data;
    },

    async create(id, profileData) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id,
            user_id: id,
            full_name: profileData.full_name,
            email: profileData.email,
            phone: profileData.phone,
            headline: profileData.headline,
            bio: profileData.bio,
            company_name: profileData.company_name,
            company_website: profileData.company_website,
            company_size: profileData.company_size,
            industry: profileData.industry,
            location: profileData.location,
            skills: profileData.skills,
            experience: profileData.experience,
            education: profileData.education,
            avatar_url: profileData.avatar_url,
            role: profileData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error in create:', error);
        throw error;
      }

      return data;
    },

    async update(id, profileData) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          phone: profileData.phone,
          headline: profileData.headline,
          bio: profileData.bio,
          company_name: profileData.company_name,
          company_website: profileData.company_website,
          company_size: profileData.company_size,
          industry: profileData.industry,
          location: profileData.location,
          skills: profileData.skills,
          experience: profileData.experience,
          education: profileData.education,
          avatar_url: profileData.avatar_url,
          role: profileData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error in update:', error);
        throw error;
      }

      return data;
    }
  },

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async uploadProfilePicture(file) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Ensure avatars bucket exists
    await this.ensureBucketExists('avatars');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return publicUrl;
  },
};
