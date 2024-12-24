import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../../providers/ThemeProvider';

const Navbar = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'text.primary',
            flexGrow: 1,
            fontWeight: 600,
            '&:hover': {
              color: 'primary.main'
            }
          }}
        >
          HireQuest
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/jobs"
            sx={{
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Jobs
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/teams"
            sx={{
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Teams
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/chat"
            sx={{
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Chat
          </Button>
          
          <IconButton 
            sx={{ 
              ml: 1,
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main'
              }
            }} 
            onClick={toggleTheme} 
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
            sx={{
              color: 'text.primary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            Login
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/signup"
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
