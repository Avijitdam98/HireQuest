import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmationReminder, setShowConfirmationReminder] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      
      // Get user role from metadata
      const role = data.user?.user_metadata?.role;
      
      // Determine redirect path based on role
      let redirectPath = '/jobs'; // default for job seekers
      if (role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (role === 'employer') {
        redirectPath = '/employer/jobs';
      }
      
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (err.message?.includes('Email not confirmed')) {
        setShowConfirmationReminder(true);
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationReminderClose = () => {
    setShowConfirmationReminder(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: 'grey.50',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          maxWidth: 'sm',
          width: '100%',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
              disabled={loading}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </form>
      </Paper>

      <Dialog open={showConfirmationReminder} onClose={handleConfirmationReminderClose}>
        <DialogTitle>Email Confirmation Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please check your email and confirm your account before signing in.
            If you haven't received the confirmation email, you can request a new one.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationReminderClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
