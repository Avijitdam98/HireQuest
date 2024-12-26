import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ user, loading }) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: theme => theme.palette.mode === 'dark' ? '#1D2226' : '#f3f2ef'
        }}
      >
        <CircularProgress sx={{ 
          color: theme => theme.palette.mode === 'dark' ? '#70B5F9' : '#0A66C2' 
        }} />
      </Box>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Return Outlet
  return <Outlet />;
};

export default ProtectedRoute;
