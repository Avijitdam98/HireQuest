import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  User,
  Briefcase,
  Users,
  MessageSquare,
  LogOut,
  Settings,
  PlusCircle,
  FileText,
  Home,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useColorMode } from '../../hooks/useColorMode';
import Logo from '../common/Logo';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toggleColorMode } = useColorMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isAdmin = user?.user_metadata?.role === 'admin';
  const isEmployer = user?.user_metadata?.role === 'employer';
  const isDarkMode = theme.palette.mode === 'dark';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Home',
      icon: <Home size={20} />,
      path: '/',
      show: true,
    },
    {
      text: 'Jobs',
      icon: <Briefcase size={20} />,
      path: '/jobs',
      show: true,
    },
    {
      text: 'Applications',
      icon: <FileText size={20} />,
      path: '/applications',
      show: true,
    },
    {
      text: 'Messages',
      icon: <MessageSquare size={20} />,
      path: '/chat',
      show: true,
    },
    {
      text: 'Profile',
      icon: <User size={20} />,
      path: '/profile',
      show: true,
    },
  ];

  if (isEmployer) {
    menuItems.splice(2, 0, {
      text: 'Post Job',
      icon: <PlusCircle size={20} />,
      path: '/jobs/create',
      show: true,
    });
  }

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Logo />
      </Box>
      <Divider />
      <List>
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isDarkMode ? '#B0B7BF' : '#666666' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: isDarkMode ? '#FFFFFF' : '#000000E6',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e0e0e0'
          }`,
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000E6',
            }}
          >
            <MenuIcon size={24} />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            onClick={toggleColorMode}
            sx={{
              mr: 2,
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000E6',
            }}
          >
            {theme.palette.mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          <IconButton
            onClick={handleMenu}
            sx={{
              padding: 0.5,
              border: `2px solid ${
                theme.palette.mode === 'dark' ? '#70B5F9' : '#0A66C2'
              }`,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Avatar
              alt={user?.email}
              src={user?.user_metadata?.avatar_url}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate('/profile');
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate('/settings');
              }}
            >
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
              borderRight: `1px solid ${
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e0e0e0'
              }`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.mode === 'dark' ? '#282E33' : '#ffffff',
              borderRight: `1px solid ${
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e0e0e0'
              }`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.mode === 'dark' ? '#1D2226' : '#f3f2ef',
          minHeight: '100vh',
          marginTop: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
