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
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';
import { initializeChat } from '../../utils/chat';
import { supabase } from '../../lib/supabase';
import { MessageSquare } from 'lucide-react';

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    loadJobs();
  }, [userRole]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = userRole === 'employer' 
        ? await api.getEmployerJobs()
        : await api.getJobs();
      console.log('Loaded jobs:', jobsData);
      setJobs(jobsData);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again later.');
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
      await api.applyForJob(selectedJob.id, cvFile);
      setApplyDialogOpen(false);
      setSelectedJob(null);
      setCvFile(null);
      loadJobs();
    } catch (err) {
      console.error('Error applying for job:', err);
      setApplicationError('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      loadJobs();
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status');
    }
  };

  const handleChat = async (application) => {
    try {
      const chat = await initializeChat(application, user.id);
      navigate('/chat', { state: { chatId: chat.id } });
    } catch (error) {
      console.error('Error handling chat:', error);
      setError('Failed to start chat. Please try again.');
    }
  };

  const toggleJobExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleEdit = (job) => {
    setEditingJob({ ...job });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      // Clean the job data before sending to API
      const { applications, created_at, employer_id, id, ...jobData } = editingJob;
      await api.updateJob(editingJob.id, jobData);
      setEditDialogOpen(false);
      setEditingJob(null);
      loadJobs();
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await api.deleteJob(jobToDelete.id);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      loadJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Typography variant="h4" gutterBottom>
        {userRole === 'employer' ? 'Your Job Postings' : 'Available Jobs'}
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    {job.title}
                  </Typography>
                  {userRole === 'employer' && job.employer_id === user.id && (
                    <Box>
                      <Tooltip title="Edit Job">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEdit(job)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Job">
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(job)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {job.company} • {job.location}
                      </Typography>
                    </Box>

                    <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                      {job.description}
                    </Typography>

                    <Box display="flex" gap={1} mb={2}>
                      <Chip label={job.type} color="primary" variant="outlined" />
                      <Chip label={job.salary_range} color="secondary" variant="outlined" />
                      {userRole === 'employer' && job.applications?.length > 0 && (
                        <Chip 
                          label={`${job.applications.length} application${job.applications.length === 1 ? '' : 's'}`}
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {userRole === 'employer' ? (
                      // For employers: Show applications section
                      job.applications?.length > 0 ? (
                        <>
                          <Button
                            variant="outlined"
                            onClick={() => toggleJobExpand(job.id)}
                            sx={{ mb: 2 }}
                          >
                            {expandedJobId === job.id ? 'Hide' : 'View'} Applications ({job.applications.length})
                          </Button>
                          
                          {expandedJobId === job.id && (
                            <Grid container spacing={2}>
                              {job.applications.map((application) => (
                                <Grid item xs={12} key={application.id}>
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                          <Typography variant="subtitle1">
                                            Applicant ID: {application.user_id}
                                          </Typography>
                                          <Typography variant="body2" color="textSecondary">
                                            Applied: {new Date(application.created_at).toLocaleDateString()}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                          <Box display="flex" gap={2} justifyContent="flex-end">
                                            {application.cv_url && (
                                              <Button
                                                variant="outlined"
                                                color="primary"
                                                href={application.cv_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                  if (!application.cv_url.startsWith('http')) {
                                                    e.preventDefault();
                                                    setError('CV file not found or access expired. The applicant may need to reapply.');
                                                  }
                                                }}
                                                disabled={!application.cv_url.startsWith('http')}
                                              >
                                                View CV
                                              </Button>
                                            )}
                                            <Button
                                              variant="outlined"
                                              color="primary"
                                              onClick={() => handleChat(application)}
                                              startIcon={<MessageSquare />}
                                            >
                                              Chat
                                            </Button>
                                            <Button
                                              variant="contained"
                                              color="success"
                                              onClick={() => handleUpdateStatus(application.id, 'accepted')}
                                              disabled={application.status === 'accepted'}
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              variant="outlined"
                                              color="error"
                                              onClick={() => handleUpdateStatus(application.id, 'rejected')}
                                              disabled={application.status === 'rejected'}
                                            >
                                              Reject
                                            </Button>
                                          </Box>
                                          <Box mt={1}>
                                            <Chip 
                                              label={application.status || 'pending'}
                                              color={
                                                application.status === 'accepted' ? 'success' :
                                                application.status === 'rejected' ? 'error' :
                                                'default'
                                              }
                                              variant="outlined"
                                            />
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          )}
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
                    ) : null}
                  </Grid>
                </Grid>
              </CardContent>
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
              accept="application/pdf"
              style={{ display: 'none' }}
              id="cv-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="cv-file">
              <Button variant="outlined" component="span">
                Upload CV (PDF)
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editingJob?.title || ''}
            onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={editingJob?.description || ''}
            onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Requirements"
            value={editingJob?.requirements || ''}
            onChange={(e) => setEditingJob({ ...editingJob, requirements: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Salary Range"
            value={editingJob?.salary_range || ''}
            onChange={(e) => setEditingJob({ ...editingJob, salary_range: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this job posting? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}