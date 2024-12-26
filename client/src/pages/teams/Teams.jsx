import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
  AvatarGroup,
} from '@mui/material';
import { MessageSquare, Users, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Teams() {
  const theme = useTheme();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            id,
            user_id,
            role,
            profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `);

      if (teamError) throw teamError;
      setTeams(teamData || []);
    } catch (err) {
      console.error('Error loading teams:', err);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
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
        My Teams
      </Typography>

      {teams.length === 0 ? (
        <Typography
          sx={{
            textAlign: 'center',
            color: theme.palette.mode === 'dark' ? '#B0B7BF' : '#666666',
          }}
        >
          You are not a member of any teams yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} key={team.id}>
              <Card
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {team.name}
                    </Typography>
                    <Chip
                      label={team.type}
                      size="small"
                      sx={{
                        backgroundColor:
                          theme.palette.mode === 'dark' ? '#70B5F9' : '#0A66C2',
                        color: '#FFFFFF',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {team.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <AvatarGroup max={4}>
                      {team.team_members?.map((member) => (
                        <Avatar
                          key={member.id}
                          alt={member.profiles?.full_name}
                          src={member.profiles?.avatar_url}
                        />
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? '#70B5F9'
                              : '#0A66C2',
                        }}
                      >
                        <MessageSquare size={20} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color:
                            theme.palette.mode === 'dark'
                              ? '#70B5F9'
                              : '#0A66C2',
                        }}
                      >
                        <Mail size={20} />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color:
                          theme.palette.mode === 'dark'
                            ? '#B0B7BF'
                            : '#666666',
                      }}
                    >
                      <Users size={16} style={{ marginRight: '4px' }} />
                      {team.team_members?.length || 0} members
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
