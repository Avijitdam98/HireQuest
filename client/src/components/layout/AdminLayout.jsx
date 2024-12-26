import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.svg';

const drawerWidth = 240;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { text: 'Home', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { text: 'Jobs', icon: <FileText size={20} />, path: '/admin/jobs' },
    { text: 'Post Job', icon: <FileText size={20} />, path: '/admin/post-job' },
    { text: 'Applications', icon: <FileText size={20} />, path: '/admin/applications' },
    { text: 'Messages', icon: <FileText size={20} />, path: '/admin/messages' },
    { text: 'Profile', icon: <Users size={20} />, path: '/admin/profile' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { sm: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src={logo} 
              alt="HireQuest Logo" 
              style={{ 
                height: '32px', 
                width: '32px',
                filter: 'brightness(0) invert(1)'
              }} 
            />
            <Typography variant="h6" noWrap component="div">
              HireQuest
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => isMobile && setOpen(false)}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box sx={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
            <img 
              src={logo} 
              alt="HireQuest Logo" 
              style={{ height: '24px', width: '24px' }} 
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              HireQuest
            </Typography>
          </Box>
          <IconButton onClick={() => setOpen(!open)}>
            <ChevronLeftIcon size={20} />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  isMobile && setOpen(false);
                }}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: location.pathname === item.path ? 'white' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          marginLeft: { sm: open ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* This creates space below the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
