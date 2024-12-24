const supabase = require('./supabaseService');
const NotFoundError = require('../utils/errors/NotFoundError');
const { getJobRecommendations } = require('../utils/helpers');
const websocketService = require('./websocketService');
const notificationService = require('./notificationService');

class JobService {
  async createJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select(`
        *,
        employer:profiles(id, full_name, company)
      `)
      .single();

    if (error) throw error;

    // Broadcast new job to all connected clients
    websocketService.broadcastNewJob(data);

    // Send notifications to users with matching skills
    const { data: matchingProfiles } = await supabase
      .from('profiles')
      .select('id, skills')
      .containedBy('skills', jobData.required_skills);

    for (const profile of matchingProfiles) {
      await notificationService.createJobNotification(
        profile.id,
        data.id,
        'new_matching_job',
        'New Job Match',
        `A new job matching your skills: ${data.title}`
      );
    }

    return data;
  }

  async getJobs(filters = {}) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles(id, full_name, company)
      `);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.skills) {
      query = query.contains('required_skills', filters.skills);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getJobById(jobId) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles(id, full_name, company)
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Job not found');
    return data;
  }

  async updateJob(jobId, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select(`
        *,
        employer:profiles(id, full_name, company)
      `)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Job not found');

    // Broadcast job update to all connected clients
    websocketService.broadcastToRoom(`job_${jobId}`, {
      type: 'job_updated',
      data
    });

    // If status changed to filled, notify all applicants
    if (updates.status === 'filled') {
      const { data: applications } = await supabase
        .from('applications')
        .select('applicant_id')
        .eq('job_id', jobId);

      for (const app of applications) {
        await notificationService.createJobNotification(
          app.applicant_id,
          jobId,
          'job_filled',
          'Job Position Filled',
          `The position for ${data.title} has been filled`
        );
      }
    }

    return data;
  }

  async deleteJob(jobId) {
    // Get job details before deletion
    const { data: job } = await this.getJobById(jobId);

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;

    // Broadcast job deletion to all connected clients
    websocketService.broadcastToRoom(`job_${jobId}`, {
      type: 'job_deleted',
      data: { jobId }
    });

    // Notify all applicants
    const { data: applications } = await supabase
      .from('applications')
      .select('applicant_id')
      .eq('job_id', jobId);

    for (const app of applications) {
      await notificationService.createJobNotification(
        app.applicant_id,
        jobId,
        'job_deleted',
        'Job Posting Removed',
        `The job posting for ${job.title} has been removed`
      );
    }
  }

  async getRecommendedJobs(userProfile) {
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active');

    if (!jobs || jobs.length === 0) return [];

    const recommendations = await getJobRecommendations(userProfile, jobs);
    return recommendations;
  }

  async searchJobs(searchTerm) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles(id, full_name, company)
      `)
      .or(`
        title.ilike.%${searchTerm}%,
        description.ilike.%${searchTerm}%,
        company.ilike.%${searchTerm}%
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = new JobService();
