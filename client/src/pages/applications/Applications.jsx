import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Eye, FileText, Download } from 'lucide-react';
import { api } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

export default function Applications() {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getUserApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.palette.mode === 'dark' ? '#B0B7BF' : '#666666';
      case 'accepted':
        return theme.palette.mode === 'dark' ? '#57AB5A' : '#1A7F37';
      case 'rejected':
        return theme.palette.mode === 'dark' ? '#E5534B' : '#CF222E';
      default:
        return theme.palette.mode === 'dark' ? '#B0B7BF' : '#666666';
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
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Typography
          sx={{
            textAlign: 'center',
            color: theme.palette.mode === 'dark' ? '#B0B7BF' : '#666666',
          }}
        >
          You haven't applied to any jobs yet.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>CV</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.job?.title || 'N/A'}</TableCell>
                  <TableCell>{application.job?.company || 'N/A'}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={application.status}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(application.status),
                        color: '#FFFFFF',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {application.cv_url && (
                      <IconButton
                        size="small"
                        onClick={() => window.open(application.cv_url, '_blank')}
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? '#70B5F9'
                              : '#0A66C2',
                        }}
                      >
                        <Download size={20} />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        // TODO: Implement view application details
                      }}
                      sx={{
                        color:
                          theme.palette.mode === 'dark' ? '#70B5F9' : '#0A66C2',
                      }}
                    >
                      <Eye size={20} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
