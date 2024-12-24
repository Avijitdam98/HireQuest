import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Eye, Download } from 'lucide-react';
import { api } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
  interviewing: 'info',
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      setApplications(apps =>
        apps.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      setSelectedApplication(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = (
      app.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobs.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedApplications = filteredApplications.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Applications Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by applicant or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="interviewing">Interviewing</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.profiles.full_name}</TableCell>
                  <TableCell>{application.jobs.title}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={application.status}
                      color={statusColors[application.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Eye size={16} />}
                        onClick={() => setSelectedApplication(application)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Download size={16} />}
                        href={application.cv_url}
                        target="_blank"
                      >
                        CV
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredApplications.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Application Details Dialog */}
      <Dialog
        open={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Application Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedApplication && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Applicant Information
              </Typography>
              <Typography variant="body2" paragraph>
                Name: {selectedApplication.profiles.full_name}
                <br />
                Email: {selectedApplication.profiles.email}
                <br />
                Applied: {new Date(selectedApplication.created_at).toLocaleDateString()}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Job Information
              </Typography>
              <Typography variant="body2" paragraph>
                Position: {selectedApplication.jobs.title}
                <br />
                Company: {selectedApplication.jobs.company}
                <br />
                Location: {selectedApplication.jobs.location}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Status
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['pending', 'interviewing', 'accepted', 'rejected'].map((status) => (
                  <Chip
                    key={status}
                    label={status}
                    color={statusColors[status]}
                    size="small"
                    onClick={() => handleUpdateStatus(selectedApplication.id, status)}
                    variant={selectedApplication.status === status ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedApplication(null)}>Close</Button>
          <Button
            href={selectedApplication?.cv_url}
            target="_blank"
            startIcon={<Download size={16} />}
          >
            Download CV
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Applications;
