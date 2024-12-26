import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { api } from '../../utils/api';
import { supabase } from '../../lib/supabase';

const StatCard = ({ title, value, icon: Icon }) => {
  const theme = useTheme();
  return (
    <Card 
      sx={{ 
        height: '100%',
        backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon 
            size={24} 
            style={{ 
              marginRight: '8px',
              color: theme.palette.mode === 'dark' ? '#70B5F9' : '#0A66C2',
            }} 
          />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all jobs count
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id');
      
      if (jobsError) throw jobsError;

      // Get applications count
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('id');
      
      if (applicationsError) throw applicationsError;

      // Get users count
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');
      
      if (profilesError) throw profilesError;

      setStats({
        totalJobs: jobs?.length || 0,
        activeJobs: jobs?.length || 0, // For now, assume all jobs are active
        totalApplications: applications?.length || 0,
        totalUsers: profiles?.length || 0,
      });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4,
          color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000E6',
        }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={Briefcase}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Positions"
            value={stats.activeJobs}
            icon={TrendingUp}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={FileText}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Registered Users"
            value={stats.totalUsers}
            icon={Users}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
