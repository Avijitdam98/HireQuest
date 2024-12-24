import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JobCard from '../../components/jobs/JobCard';
import { Button } from '../../components/ui/button';
import api from '../../services/api';
import useJobMatching from '../../hooks/useJobMatching';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: '',
    jobType: 'all',
  });

  // Mock user skills - in real app, get from user profile
  const userSkills = ['React', 'JavaScript', 'Node.js'];
  const { matches: matchedJobs } = useJobMatching(userSkills);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.jobs.getAll();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesLocation = !filters.location || job.location.includes(filters.location);
    const matchesType = filters.jobType === 'all' || job.type === filters.jobType;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground mt-2">
            Find your next opportunity from {jobs.length} open positions
          </p>
        </div>
        <Button>Post a Job</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          name="searchTerm"
          placeholder="Search jobs or companies"
          value={filters.searchTerm}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        />
        <select
          name="jobType"
          value={filters.jobType}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="all">All Types</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
        </select>
      </div>

      {/* Best Matches Section */}
      {matchedJobs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Best Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedJobs.slice(0, 4).map(job => (
              <JobCard key={job.id} job={job} matchScore={job.matchScore} />
            ))}
          </div>
        </div>
      )}

      {/* All Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <p>No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
