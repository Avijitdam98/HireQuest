import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/profile/Profile';
import Users from './pages/admin/Users';
import Dashboard from './pages/admin/Dashboard';
import Applications from './pages/applications/Applications';
import JobList from './pages/jobs/JobList';
import CreateJob from './pages/employer/CreateJob';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './components/layout/AdminLayout';
import Chat from './pages/chat/Chat';
import AdminDashboard from './pages/admin/AdminDashboard';
import Settings from './pages/settings/Settings';
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  const { user, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  if (!isInitialized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: theme => theme.palette.mode === 'dark' ? '#1D2226' : '#f3f2ef'
      }}>
        <CircularProgress sx={{ 
          color: theme => theme.palette.mode === 'dark' ? '#70B5F9' : '#0A66C2' 
        }} />
      </Box>
    );
  }

  // Check user roles from metadata
  const isAdmin = user?.user_metadata?.role === 'admin';
  const isEmployer = user?.user_metadata?.role === 'employer';
  const isJobSeeker = user?.user_metadata?.role === 'jobseeker';

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              !user ? <Login /> : <Navigate to={isAdmin ? '/admin' : '/'} replace />
            } />
            <Route path="/signup" element={
              !user ? <SignUp /> : <Navigate to="/" replace />
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute user={user} loading={loading} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="applications" element={<Applications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute user={user} loading={loading} />}>
              <Route element={<Layout />}>
                <Route path="/" element={
                  isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Dashboard />
                  )
                } />
                <Route path="/jobs" element={<JobList />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chat" element={<Chat />} />

                {/* Employer Routes */}
                {isEmployer && (
                  <>
                    <Route path="/jobs/create" element={<CreateJob />} />
                  </>
                )}
              </Route>
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={
              !user ? (
                <Navigate to="/login" replace />
              ) : isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            } />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
