import React from 'react';
import { motion } from 'framer-motion';
import { Button, useTheme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';

const JobCard = ({ job, matchScore }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg shadow-sm border ${
        isDarkMode 
          ? 'bg-[#282E33] border-[rgba(255,255,255,0.12)]' 
          : 'bg-white border-[#e0e0e0]'
      } hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`w-12 h-12 rounded flex items-center justify-center ${
            isDarkMode ? 'bg-[#333B43]' : 'bg-[#f3f2ef]'
          }`}>
            <BusinessIcon sx={{ 
              color: isDarkMode ? '#B0B7BF' : '#666666',
              fontSize: '1.5rem' 
            }} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-[#000000E6]'
            } hover:text-[#0A66C2] cursor-pointer`}>
              {job.title}
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-[#B0B7BF]' : 'text-[#666666]'
            }`}>
              {job.company}
            </p>
          </div>
        </div>
        {matchScore && (
          <div className={`px-3 py-1 rounded-full ${
            isDarkMode 
              ? 'bg-[#0A66C2]/20 text-[#70B5F9]' 
              : 'bg-[#0A66C2]/10 text-[#0A66C2]'
          }`}>
            <span className="text-sm font-medium">
              {Math.round(matchScore)}% Match
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className={`text-sm line-clamp-2 ${
          isDarkMode ? 'text-[#B0B7BF]' : 'text-[#666666]'
        }`}>
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {job.required_skills?.map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs rounded-full ${
                isDarkMode 
                  ? 'bg-[#333B43] text-[#B0B7BF]' 
                  : 'bg-[#f3f2ef] text-[#666666]'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>

        <div className={`flex items-center justify-between mt-4 pt-4 border-t ${
          isDarkMode ? 'border-[rgba(255,255,255,0.12)]' : 'border-[#e0e0e0]'
        }`}>
          <div className={`flex flex-wrap gap-4 text-sm ${
            isDarkMode ? 'text-[#B0B7BF]' : 'text-[#666666]'
          }`}>
            <div className="flex items-center gap-1">
              <LocationOnIcon sx={{ fontSize: '1rem' }} />
              <span>{job.location}</span>
            </div>
            {job.salary_range && (
              <div className="flex items-center gap-1">
                <WorkIcon sx={{ fontSize: '1rem' }} />
                <span>{job.salary_range}</span>
              </div>
            )}
          </div>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: isDarkMode ? '#70B5F9' : '#0A66C2',
              color: isDarkMode ? '#1D2226' : '#ffffff',
              '&:hover': {
                backgroundColor: isDarkMode ? '#9CCCFA' : '#004182',
              },
              borderRadius: '16px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
