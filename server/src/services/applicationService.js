const supabase = require('./supabaseService');
const NotFoundError = require('../utils/errors/NotFoundError');
const notificationService = require('./notificationService');
const websocketService = require('./websocketService');

class ApplicationService {
  async submitApplication(applicationData) {
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', applicationData.job_id)
      .single();

    if (!job) throw new NotFoundError('Job not found');

    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        applicant:profiles(id, full_name, title, skills),
        job:jobs(id, title, company, employer_id)
      `)
      .single();

    if (error) throw error;

    // Create notification for employer
    await notificationService.createJobNotification(
      job.employer_id,
      job.id,
      'new_application',
      'New Job Application',
      `New application received for ${job.title}`
    );

    // Send real-time notification to employer
    websocketService.notifyJobApplication(job.employer_id, data);

    return data;
  }

  async getApplicationsByJob(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:profiles(id, full_name, title, skills),
        job:jobs(id, title, company)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getApplicationsByApplicant(applicantId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(id, title, company, description)
      `)
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateApplicationStatus(applicationId, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select(`
        *,
        job:jobs(id, title, employer_id),
        applicant:profiles(id)
      `)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Application not found');

    // Create notification for applicant
    await notificationService.createJobNotification(
      data.applicant.id,
      data.job.id,
      'status_update',
      'Application Status Updated',
      `Your application for ${data.job.title} has been ${status}`
    );

    // Send real-time notification to applicant
    websocketService.notifyApplicationUpdate(data.applicant.id, data);

    // If application is accepted, notify other applicants
    if (status === 'accepted') {
      const { data: otherApplications } = await supabase
        .from('applications')
        .select('applicant_id')
        .eq('job_id', data.job_id)
        .neq('id', applicationId);

      for (const app of otherApplications) {
        await notificationService.createJobNotification(
          app.applicant_id,
          data.job.id,
          'position_filled',
          'Position Filled',
          `The position for ${data.job.title} has been filled`
        );
      }
    }

    return data;
  }

  async getApplication(applicationId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:profiles(id, full_name, title, skills, experience),
        job:jobs(id, title, company, description, required_skills)
      `)
      .eq('id', applicationId)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundError('Application not found');
    return data;
  }

  async deleteApplication(applicationId) {
    const { data: application } = await this.getApplication(applicationId);

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (error) throw error;

    // Notify employer about withdrawn application
    await notificationService.createJobNotification(
      application.job.employer_id,
      application.job.id,
      'application_withdrawn',
      'Application Withdrawn',
      `An application for ${application.job.title} has been withdrawn`
    );

    // Send real-time notification
    websocketService.notifyJobApplication(
      application.job.employer_id,
      {
        type: 'application_withdrawn',
        jobId: application.job.id,
        applicationId
      }
    );
  }

  async getApplicationStats(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('job_id', jobId);

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter(app => app.status === 'pending').length,
      reviewing: data.filter(app => app.status === 'reviewing').length,
      accepted: data.filter(app => app.status === 'accepted').length,
      rejected: data.filter(app => app.status === 'rejected').length
    };

    return stats;
  }
}

module.exports = new ApplicationService();
