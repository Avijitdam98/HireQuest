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
                // Get a signed URL for the CV
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

  // Storage
  async ensureBucketExists(bucketName) {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      if (listError) throw listError;

      const bucket = buckets?.find(b => b.name === bucketName);
      if (!bucket) {
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        if (createError) throw createError;
      }
      
      // Update bucket to be public
      const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880,
      });
      if (updateError) throw updateError;

      return true;
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      throw error;
    }
  },

  async getSignedUrl(path) {
    try {
      // First try to create a signed URL
      const { data, error } = await supabase.storage
        .from('cvs')
        .createSignedUrl(path, 365 * 24 * 60 * 60); // 1 year validity

      if (error) {
        console.error('Error creating signed URL:', error);
        // Fallback to public URL if signed URL fails
        const { data: { publicUrl } } = supabase.storage
          .from('cvs')
          .getPublicUrl(path);
        return publicUrl;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  },

  // Applications
  async applyForJob(jobId, cvFile, coverLetter = '') {
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      // Ensure CV storage bucket exists
      await this.ensureBucketExists('cvs');

      // Generate file path
      const timestamp = new Date().getTime();
      const fileExt = cvFile.name.split('.').pop();
      const cvFileName = `${user.id}/${timestamp}.${fileExt}`;
      
      // Upload the CV file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('cvs')
        .upload(cvFileName, cvFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading CV:', uploadError);
        throw uploadError;
      }

      // Get the public URL using the signed URL for better security
      const { data: urlData, error: urlError } = await supabase.storage
        .from('cvs')
        .createSignedUrl(cvFileName, 365 * 24 * 60 * 60); // Valid for 1 year

      if (urlError) {
        console.error('Error getting signed URL:', urlError);
        throw urlError;
      }

      // Create the application
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          job_id: jobId,
          user_id: user.id,
          cv_url: urlData.signedUrl,
          status: 'pending'
        }])
        .select();

      if (error) {
        console.error('Error creating application:', error);
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error in applyForJob:', error);
      throw new Error(error.message || 'Failed to apply for job');
    }
  },

  async getUserApplications() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(
          id,
          title,
          company,
          location
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateApplicationStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Profiles
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
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async uploadProfilePicture(file) {
    const { data: { user } } = await supabase.auth.getUser();
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Update profile with new avatar URL
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
