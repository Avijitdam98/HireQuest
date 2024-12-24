import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/profile/Profile';
import Users from './pages/admin/Users';
import Dashboard from './pages/admin/Dashboard';
import Applications from './pages/admin/Applications';
import JobList from './pages/jobs/JobList';
import CreateJob from './pages/employer/CreateJob';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import useChatStore from './store/useChatStore';
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './components/layout/AdminLayout';
import Chat from './pages/chat/Chat';
import AdminDashboard from './pages/admin/AdminDashboard';
import { ThemeProvider } from './providers/ThemeProvider';
import Settings from './pages/settings/Settings';

function App() {
  const { user, loading } = useAuth();
  const initializeWebSocket = useChatStore(state => state.initializeWebSocket);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading) {
      console.log('App initialized, user:', user);
      setIsInitialized(true);
    }
  }, [loading]);

  useEffect(() => {
    if (user && user.user_metadata?.role === 'jobseeker') {
      initializeWebSocket();
    }
  }, [user, initializeWebSocket]);

  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isAdmin = user?.user_metadata?.role === 'admin';
  const isEmployer = user?.user_metadata?.role === 'employer';
  const isJobSeeker = !isAdmin && !isEmployer;

  console.log('User role:', { isAdmin, isEmployer, isJobSeeker });

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                user ? (
                  <Navigate 
                    to={
                      isAdmin 
                        ? "/admin/dashboard"
                        : isEmployer 
                          ? "/employer/jobs"
                          : "/jobs"
                    } 
                    replace 
                  />
                ) : (
                  <Login />
                )
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                user ? (
                  <Navigate 
                    to={
                      isAdmin 
                        ? "/admin/dashboard"
                        : isEmployer 
                          ? "/employer/jobs"
                          : "/jobs"
                    } 
                    replace 
                  />
                ) : (
                  <SignUp />
                )
              } 
            />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={
                <Navigate 
                  to={
                    isAdmin 
                      ? "/admin/dashboard"
                      : isEmployer 
                        ? "/employer/jobs"
                        : "/jobs"
                  } 
                  replace 
                />
              } />

              {/* Common Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<Chat />} />

              {/* Job Seeker Routes */}
              {isJobSeeker && (
                <>
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/applications" element={<Applications userView />} />
                </>
              )}

              {/* Employer Routes */}
              {isEmployer && (
                <>
                  <Route path="/employer/create-job" element={<CreateJob />} />
                  <Route path="/employer/jobs" element={<JobList employerView />} />
                  <Route path="/employer/applications" element={<Applications employerView />} />
                </>
              )}

              {/* Admin Routes */}
              {isAdmin && (
                <>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/applications" element={<Applications adminView />} />
                  <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
                </>
              )}
            </Route>

            {/* Catch-all Route */}
            <Route 
              path="*" 
              element={
                <Navigate 
                  to={
                    user 
                      ? isAdmin 
                        ? "/admin/dashboard"
                        : isEmployer 
                          ? "/employer/jobs"
                          : "/jobs"
                      : "/login"
                  } 
                  replace 
                />
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
