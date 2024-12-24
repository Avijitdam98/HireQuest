import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import TeamCard from '../../components/teams/TeamCard';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import api from '../../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    projectType: '',
  });

  useEffect(() => {
    fetchTeams();
  }, [filters]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teams', { params: filters });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Teams
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find and join teams working on exciting projects
        </Typography>
      </Box>

      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search teams by name, skills, or project type" 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FilterPanel 
              filters={filters}
              onFilterChange={handleFilterChange}
              options={{
                skills: ['React', 'Node.js', 'Python', 'UI/UX', 'DevOps'],
                projectTypes: ['Web App', 'Mobile App', 'Data Science', 'AI/ML'],
                locations: ['Remote', 'On-site', 'Hybrid'],
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array(6).fill(null).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <TeamCard loading />
            </Grid>
          ))
        ) : teams.length > 0 ? (
          teams.map(team => (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <TeamCard team={team} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              No teams found matching your criteria
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Teams;
