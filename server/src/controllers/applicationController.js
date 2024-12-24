const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.submitApplication = async (req, res) => {
  try {
    const { jobId, applicantId, coverLetter, resumeUrl } = req.body;

    // Validate job exists
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        applicant_id: applicantId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    // Create notification for employer
    await supabase
      .from('notifications')
      .insert([{
        user_id: job.employer_id,
        type: 'new_application',
        title: 'New Job Application',
        message: `New application received for ${job.title}`,
        data: { application_id: application.id, job_id: jobId }
      }]);

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
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
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationsByApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(id, title, company, description)
      `)
      .eq('applicant_id', applicantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const { data: application, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    // Create notification for applicant
    await supabase
      .from('notifications')
      .insert([{
        user_id: application.applicant_id,
        type: 'application_update',
        title: 'Application Status Updated',
        message: `Your application status has been updated to ${status}`,
        data: { application_id: applicationId }
      }]);

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationMatchScore = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { data: application } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:profiles(skills, experience),
        job:jobs(required_skills, preferred_skills, description)
      `)
      .eq('id', applicationId)
      .single();

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a job application analyzer that evaluates the match between job requirements and applicant profiles. Provide a match score between 0-100 and a brief explanation."
        },
        {
          role: "user",
          content: `
Job Requirements:
- Required Skills: ${application.job.required_skills.join(', ')}
- Preferred Skills: ${application.job.preferred_skills.join(', ')}
- Description: ${application.job.description}

Applicant Profile:
- Skills: ${application.applicant.skills.join(', ')}
- Experience: ${JSON.stringify(application.applicant.experience)}

Analyze the match and provide a score and explanation.`
        }
      ],
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content.trim();

    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
