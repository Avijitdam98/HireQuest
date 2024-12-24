import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Skeleton,
} from '@mui/material';
import { Users, MapPin, Briefcase } from 'lucide-react';

const TeamCard = ({ team, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
          <Box sx={{ mt: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={60}
                height={24}
                sx={{ mr: 1, display: 'inline-block', borderRadius: 1 }}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
        </CardActions>
      </Card>
    );
  }

  const { name, description, members, location, projectType, skills } = team;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Users size={16} />
            <Typography variant="body2">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <MapPin size={16} />
            <Typography variant="body2">{location}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Briefcase size={16} />
            <Typography variant="body2">{projectType}</Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {skills.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{
                backgroundColor: 'primary.50',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'primary.100' },
              }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions>
        <Button variant="contained" color="primary">
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TeamCard;
