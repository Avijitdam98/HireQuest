import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material';

const FilterPanel = ({ filters, onFilterChange, options }) => {
  const handleSkillsChange = (_, newValue) => {
    onFilterChange({ skills: newValue });
  };

  const handleLocationChange = (event) => {
    onFilterChange({ location: event.target.value });
  };

  const handleProjectTypeChange = (event) => {
    onFilterChange({ projectType: event.target.value });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Filters
      </Typography>

      <Autocomplete
        multiple
        id="skills-filter"
        options={options.skills}
        value={filters.skills}
        onChange={handleSkillsChange}
        renderInput={(params) => (
          <TextField {...params} label="Skills" size="small" />
        )}
        size="small"
      />

      <FormControl size="small">
        <InputLabel id="location-filter-label">Location</InputLabel>
        <Select
          labelId="location-filter-label"
          id="location-filter"
          value={filters.location}
          label="Location"
          onChange={handleLocationChange}
        >
          <MenuItem value="">All Locations</MenuItem>
          {options.locations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel id="project-type-filter-label">Project Type</InputLabel>
        <Select
          labelId="project-type-filter-label"
          id="project-type-filter"
          value={filters.projectType}
          label="Project Type"
          onChange={handleProjectTypeChange}
        >
          <MenuItem value="">All Types</MenuItem>
          {options.projectTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterPanel;
