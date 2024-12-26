import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  useTheme,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    recentJobs: [],
    recentApplications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get all jobs
      const jobs = await api.getJobs();
      
      // Get all applications
      const applications = await api.getAllApplications();
      
      // Get all profiles
      const { data: profiles } = await api.getProfiles();

      // Calculate stats
      const recentJobs = jobs.slice(0, 5);
      const recentApplications = applications.slice(0, 5);

      setStats({
        totalJobs: jobs.length,
        totalApplications: applications.length,
        totalUsers: profiles.length,
        recentJobs,
        recentApplications,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Jobs
              </Typography>
              <Typography variant="h3">{stats.totalJobs}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h3">{stats.totalApplications}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%',
              backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
            }}
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Recent Jobs" />
          <Tab label="Recent Applications" />
        </Tabs>
      </Box>

      {/* Recent Jobs Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer 
          component={Paper}
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Posted</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={job.status} 
                      color={job.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Recent Applications Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer 
          component={Paper}
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Job</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.recentApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.user_id}</TableCell>
                  <TableCell>{application.job_id}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={application.status} 
                      color={
                        application.status === 'accepted' ? 'success' :
                        application.status === 'rejected' ? 'error' :
                        'default'
                      }
                      size="small"
                    />
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
