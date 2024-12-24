import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'jobseeker',
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
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        role: formData.role,
        avatar_url: null,
        skills: [],
        experience: [],
        location: null,
        bio: '',
      });

      if (signUpError) throw signUpError;

      // Show confirmation dialog
      setShowConfirmation(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/login');
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
            Create an Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your details to get started
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
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
            />

            <FormControl component="fieldset">
              <FormLabel component="legend">I am a</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="jobseeker"
                  control={<Radio />}
                  label="Job Seeker"
                />
                <FormControlLabel
                  value="employer"
                  control={<Radio />}
                  label="Employer"
                />
              </RadioGroup>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'primary.main' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      <Dialog
        open={showConfirmation}
        onClose={handleConfirmationClose}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">
          Check Your Email
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            We've sent a confirmation link to {formData.email}. Please check your email and click the link to verify your account.
            After confirming your email, you can sign in to your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationClose} variant="contained">
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignUp;
