import React from 'react';
import { useTheme } from '@mui/material';
import { Card, CardContent, Avatar, Typography, Button, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';

const ProfileCard = ({ profile }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        backgroundColor: isDarkMode ? '#282E33' : '#ffffff',
        borderRadius: 2,
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : '#e0e0e0'}`,
        position: 'relative',
      }}
    >
      {/* Cover Image */}
      <div
        style={{
          height: '120px',
          background: isDarkMode
            ? 'linear-gradient(to right, #1D2226, #333B43)'
            : 'linear-gradient(to right, #0A66C2, #70B5F9)',
        }}
      />

      {/* Profile Picture */}
      <Avatar
        src={profile.avatar}
        sx={{
          width: 120,
          height: 120,
          border: `4px solid ${isDarkMode ? '#282E33' : '#ffffff'}`,
          position: 'absolute',
          top: '60px',
          left: '24px',
        }}
      />

      {/* Edit Button */}
      <IconButton
        sx={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          },
        }}
      >
        <EditIcon sx={{ color: isDarkMode ? '#FFFFFF' : '#000000E6' }} />
      </IconButton>

      <CardContent sx={{ pt: 10, pb: 3 }}>
        {/* Name and Title */}
        <Typography variant="h5" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000E6', fontWeight: 600 }}>
          {profile.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: isDarkMode ? '#B0B7BF' : '#666666', mt: 0.5 }}>
          {profile.title}
        </Typography>

        {/* Location */}
        <Typography variant="body2" sx={{ color: isDarkMode ? '#B0B7BF' : '#666666', mt: 1 }}>
          {profile.location}
        </Typography>

        {/* Social Links */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {profile.linkedin && (
            <IconButton
              size="small"
              sx={{
                color: isDarkMode ? '#70B5F9' : '#0A66C2',
                '&:hover': { backgroundColor: isDarkMode ? 'rgba(112,181,249,0.1)' : 'rgba(10,102,194,0.1)' },
              }}
            >
              <LinkedInIcon />
            </IconButton>
          )}
          {profile.github && (
            <IconButton
              size="small"
              sx={{
                color: isDarkMode ? '#FFFFFF' : '#000000E6',
                '&:hover': { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
              }}
            >
              <GitHubIcon />
            </IconButton>
          )}
          {profile.website && (
            <IconButton
              size="small"
              sx={{
                color: isDarkMode ? '#B0B7BF' : '#666666',
                '&:hover': { backgroundColor: isDarkMode ? 'rgba(176,183,191,0.1)' : 'rgba(102,102,102,0.1)' },
              }}
            >
              <LanguageIcon />
            </IconButton>
          )}
        </div>

        {/* Skills */}
        <div style={{ marginTop: '24px' }}>
          <Typography variant="h6" sx={{ color: isDarkMode ? '#FFFFFF' : '#000000E6', mb: 2, fontSize: '1rem' }}>
            Skills
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {profile.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                sx={{
                  backgroundColor: isDarkMode ? '#333B43' : '#f3f2ef',
                  color: isDarkMode ? '#B0B7BF' : '#666666',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#404040' : '#e0e0e0',
                  },
                }}
              />
            ))}
          </div>
        </div>

        {/* Connect Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
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
          Connect
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
