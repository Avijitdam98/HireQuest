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
} from '@mui/material';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { api } from '../../utils/api';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon size={24} style={{ marginRight: '8px' }} />
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" component="div" gutterBottom>
        {value}
      </Typography>
      {trend && (
        <Typography
          variant="body2"
          color={trend.startsWith('+') ? 'success.main' : 'error.main'}
        >
          {trend} from last month
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={Users}
            trend={stats?.usersTrend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Jobs"
            value={stats?.activeJobs || 0}
            icon={Briefcase}
            trend={stats?.jobsTrend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Applications"
            value={stats?.totalApplications || 0}
            icon={FileText}
            trend={stats?.applicationsTrend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${stats?.successRate || 0}%`}
            icon={TrendingUp}
            trend={stats?.successTrend}
          />
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Recent Activity
      </Typography>
      <Paper sx={{ p: 2 }}>
        {stats?.recentActivity?.map((activity, index) => (
          <Box
            key={index}
            sx={{
              py: 1,
              borderBottom: index < stats.recentActivity.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2">
              {activity.message}
              <Typography
                component="span"
                variant="caption"
                sx={{ color: 'text.secondary', ml: 1 }}
              >
                {activity.timestamp}
              </Typography>
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default Dashboard;
