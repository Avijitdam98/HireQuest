import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  Link,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get all jobs with their applications
      const jobsData = await api.getEmployerJobs();
      setJobs(jobsData);

      // Flatten applications from all jobs
      const allApplications = jobsData.reduce((acc, job) => {
        const jobApplications = (job.applications || []).map(app => ({
          ...app,
          jobTitle: job.title,
          company: job.company
        }));
        return [...acc, ...jobApplications];
      }, []);
      setApplications(allApplications);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      loadData(); // Refresh data
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.deleteJob(jobId);
        loadData(); // Refresh data
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Jobs" />
          <Tab label="Applications" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Salary Range</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{job.salary_range}</TableCell>
                  <TableCell>
                    {job.applications?.length || 0} applications
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>CV</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.jobTitle}</TableCell>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>{application.user_id}</TableCell>
                  <TableCell>
                    <Link href={application.cv_url} target="_blank">
                      View CV
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={application.status} 
                      color={
                        application.status === 'accepted' ? 'success' : 
                        application.status === 'rejected' ? 'error' : 
                        'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(application.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant={application.status === 'accepted' ? 'contained' : 'outlined'}
                        color="success"
                        size="small"
                        onClick={() => handleUpdateStatus(application.id, 'accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant={application.status === 'rejected' ? 'contained' : 'outlined'}
                        color="error"
                        size="small"
                        onClick={() => handleUpdateStatus(application.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
}
