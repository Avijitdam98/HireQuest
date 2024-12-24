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

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      await loadApplications(); // Reload the list
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update application status.');
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
  };

  const handleCloseDialog = () => {
    setSelectedApplication(null);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch = 
        (app.profile?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.job?.company || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Applications Management
      </Typography>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 200 }}
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
            label="Status Filter"
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
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
                <TableCell>Job Position</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.profile?.full_name || 'Unknown'}</TableCell>
                    <TableCell>{application.job?.title || 'N/A'}</TableCell>
                    <TableCell>{application.job?.company || 'N/A'}</TableCell>
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
                      <Box display="flex" gap={1}>
                        <Button
                          startIcon={<Eye size={16} />}
                          size="small"
                          onClick={() => handleViewApplication(application)}
                        >
                          View
                        </Button>
                        {application.cv_url && (
                          <Button
                            startIcon={<Download size={16} />}
                            size="small"
                            href={application.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            CV
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredApplications.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {selectedApplication && (
        <Dialog open={Boolean(selectedApplication)} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Application Details</DialogTitle>
          <DialogContent>
            <Box p={2}>
              <Typography variant="h6" gutterBottom>
                {selectedApplication.job?.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {selectedApplication.job?.company}
              </Typography>
              
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Applicant Information
                </Typography>
                <Typography>
                  Name: {selectedApplication.profile?.full_name}
                </Typography>
                <Typography>
                  Email: {selectedApplication.profile?.email}
                </Typography>
                <Typography>
                  Applied: {new Date(selectedApplication.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Status
                </Typography>
                <Box display="flex" gap={1}>
                  {['pending', 'interviewing', 'accepted', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedApplication.status === status ? 'contained' : 'outlined'}
                      color={statusColors[status]}
                      size="small"
                      onClick={() => handleStatusChange(selectedApplication.id, status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Applications;
