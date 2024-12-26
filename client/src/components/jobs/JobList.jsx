import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { uploadCV } from '../../utils/uploadCV';
import { api } from '../../utils/api';

const JobList = ({ jobs }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleApply = (job) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedJob(job);
    setOpenDialog(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
          .includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!cvFile) {
        setError('Please upload your CV');
        return;
      }

      // Upload CV first
      const { url: cvUrl } = await uploadCV(cvFile, user.id);

      // Submit application
      await api.applyForJob(selectedJob.id, cvUrl, coverLetter);

      setOpenDialog(false);
      setCoverLetter('');
      setCvFile(null);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      setError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {jobs.map((job) => (
        <div key={job.id} className="mb-4 p-4 border rounded shadow-sm">
          <h3 className="text-xl font-semibold">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <p className="mt-2">{job.description}</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleApply(job)}
            className="mt-3"
          >
            Apply Now
          </Button>
        </div>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          <div className="mt-4">
            <input
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              id="cv-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="cv-file">
              <Button variant="outlined" component="span" fullWidth>
                {cvFile ? cvFile.name : 'Upload CV'}
              </Button>
            </label>
          </div>
          <TextField
            autoFocus
            margin="dense"
            label="Cover Letter (Optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading || !cvFile}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobList;
