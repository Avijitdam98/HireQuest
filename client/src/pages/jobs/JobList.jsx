import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Stack,
  Collapse
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { supabase } from '../../lib/supabase';
import { MessageSquare } from 'lucide-react';
import useApplicationStore from '../../store/useApplicationStore';
import { FileText, Check, X } from 'lucide-react';

export default function JobList() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { 
    applications, 
    loadApplications,
    initializeSubscription,
    cleanup, 
    submitApplication,
    loading: applicationsLoading,
    error: applicationsError 
  } = useApplicationStore();

  useEffect(() => {
    loadJobs();
    if (userRole === 'admin' || userRole === 'employer') {
      console.log('Loading applications for role:', userRole);
      loadApplications();
      initializeSubscription();
    }
    return () => {
      if (userRole === 'admin' || userRole === 'employer') {
        cleanup();
      }
    };
  }, [userRole]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let jobsData;
      if (userRole === 'employer') {
        console.log('Loading employer jobs');
        jobsData = await api.getEmployerJobs();
      } else {
        console.log('Loading all jobs');
        jobsData = await api.getJobs();
      }
      
      console.log('Loaded jobs:', jobsData);
      setJobs(jobsData || []);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err.message || 'Failed to load jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    setSelectedJob(job);
    setApplyDialogOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setApplicationError(null);
    } else {
      setApplicationError('Please upload a PDF file');
      setCvFile(null);
    }
  };

  const handleSubmitApplication = async () => {
    if (!cvFile) {
      setApplicationError('Please upload your CV');
      return;
    }

    try {
      setApplying(true);
      setApplicationError(null);
      
      // Validate file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (cvFile.size > MAX_FILE_SIZE) {
        setApplicationError('CV file size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(cvFile.type)) {
        setApplicationError('Please upload a PDF or Word document');
        return;
      }

      // Submit application using the store
      await submitApplication(selectedJob.id, cvFile);
      
      // Clear form and show success
      setApplyDialogOpen(false);
      setSelectedJob(null);
      setCvFile(null);
      
      // Show success message
      alert('Application submitted successfully!');
      
    } catch (error) {
      console.error('Application error:', error);
      setApplicationError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      // Refresh the jobs list to show updated status
      loadJobs();
      setSuccessMessage(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('Failed to update application status');
    }
  };

  const handleChat = async (application) => {
    try {
      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('application_id', application.id)
        .single();

      if (existingChat) {
        navigate('/chat', { state: { chatId: existingChat.id } });
        return;
      }

      // Create new chat
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert([
          {
            application_id: application.id,
            employer_id: user.id,
            jobseeker_id: application.user_id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      navigate('/chat', { state: { chatId: newChat.id } });
    } catch (error) {
      console.error('Error handling chat:', error);
      setError('Failed to start chat. Please try again.');
    }
  };

  const toggleJobExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const renderApplications = (jobId) => {
    if (userRole !== 'admin' && userRole !== 'employer') {
      return null;
    }

    console.log('Rendering applications for job:', jobId);
    
    let jobApplications = [];
    if (userRole === 'employer') {
      const job = jobs.find(j => j.id === jobId);
      jobApplications = job?.applications || [];
      console.log('Employer job applications:', jobApplications);
    } else {
      jobApplications = applications[jobId] || [];
      console.log('Admin job applications:', jobApplications);
    }

    return (
      <Box mt={2}>
        {jobApplications.length === 0 ? (
          <Typography color="textSecondary">No applications yet</Typography>
        ) : (
          <>
            <Typography variant="h6">Applications ({jobApplications.length})</Typography>
            {jobApplications.map((app) => {
              console.log('Rendering application:', app);
              const applicant = app.user || app.user_profile;
              return (
                <Card key={app.id} sx={{ mt: 2, p: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Applicant: {applicant?.full_name || 'Unknown'}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                      >
                        Status: {app.status || 'pending'}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} alignItems="center">
                      {app.cv_url && (
                        <Button 
                          variant="outlined" 
                          size="small"
                          href={app.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          startIcon={<FileText />}
                        >
                          View CV
                        </Button>
                      )}
                      
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleUpdateStatus(app.id, 'accepted')}
                        disabled={app.status === 'accepted'}
                        startIcon={<Check />}
                      >
                        Accept
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        disabled={app.status === 'rejected'}
                        startIcon={<X />}
                      >
                        Reject
                      </Button>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      Applied: {new Date(app.created_at).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Card>
              );
            })}
          </>
        )}
      </Box>
    );
  };

  if (loading || applicationsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || applicationsError) {
    return (
      <Box m={2}>
        <Alert severity="error">{error || applicationsError}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {userRole === 'employer' ? 'Your Job Postings' : 'Available Jobs'}
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card 
              sx={{ 
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {job.title}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  color="text.secondary" 
                  gutterBottom
                >
                  {job.company} • {job.location}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  {job.description}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Chip 
                  label={job.type} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }} 
                />
                <Chip 
                  label={job.salary_range} 
                  size="small"
                  sx={{ 
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText'
                  }} 
                />
                {userRole === 'employer' && job.applications?.length > 0 && (
                  <Chip 
                    label={`${job.applications.length} application${job.applications.length === 1 ? '' : 's'}`}
                    size="small"
                    sx={{ 
                      bgcolor: 'background.alt',
                      color: 'text.primary'
                    }}
                  />
                )}
              </Stack>

              {userRole === 'employer' ? (
                // For employers: Show applications section
                job.applications?.length > 0 ? (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => toggleJobExpand(job.id)}
                      sx={{ mb: 2 }}
                    >
                      {expandedJobId === job.id ? 'Hide Applications' : 'View Applications'}
                    </Button>
                    
                    <Collapse in={expandedJobId === job.id}>
                      {renderApplications(job.id)}
                    </Collapse>
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No applications yet
                  </Typography>
                )
              ) : userRole === 'jobseeker' ? (
                // For job seekers: Show apply button
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApply(job)}
                  sx={{ mt: 2 }}
                >
                  Apply Now
                </Button>
              ) : userRole === 'admin' ? (
                renderApplications(job.id)
              ) : null}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Application Dialog - Only shown for job seekers */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
        <DialogContent>
          {applicationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {applicationError}
            </Alert>
          )}
          
          <Box mt={2}>
            <input
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              id="cv-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="cv-file">
              <Button variant="outlined" component="span">
                Upload CV (PDF or Word)
              </Button>
            </label>
            {cvFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {cvFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitApplication}
            variant="contained"
            color="primary"
            disabled={applying || !cvFile}
          >
            {applying ? <CircularProgress size={24} /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}