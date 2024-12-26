import React from 'react';
import { Outlet } from 'react-router-dom';
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
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function AdminLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { text: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    {
      text: 'Applications',
      icon: <FileText size={20} />,
      path: '/admin/applications',
    },
    { text: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#1D2226' : '#FFFFFF',
          boxShadow: 'none',
          borderBottom: `1px solid ${
            theme.palette.mode === 'dark' ? '#38434F' : '#E0E0E0'
          }`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: 'none' }),
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
            }}
          >
            Admin Portal
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.mode === 'dark' ? '#1D2226' : '#FFFFFF',
            borderRight: `1px solid ${
              theme.palette.mode === 'dark' ? '#38434F' : '#E0E0E0'
            }`,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon
              sx={{
                color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
              }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider
          sx={{
            borderColor: theme.palette.mode === 'dark' ? '#38434F' : '#E0E0E0',
          }}
        />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path
                      ? theme.palette.mode === 'dark'
                        ? '#70B5F9'
                        : '#0A66C2'
                      : theme.palette.mode === 'dark'
                      ? '#B0B7BF'
                      : '#666666',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: location.pathname === item.path
                        ? theme.palette.mode === 'dark'
                          ? '#70B5F9'
                          : '#0A66C2'
                        : theme.palette.mode === 'dark'
                        ? '#FFFFFF'
                        : '#000000',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider
          sx={{
            borderColor: theme.palette.mode === 'dark' ? '#38434F' : '#E0E0E0',
          }}
        />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon
                sx={{
                  color: theme.palette.mode === 'dark' ? '#B0B7BF' : '#666666',
                }}
              >
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  '& .MuiListItemText-primary': {
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1D2226' : '#F3F2EF',
            minHeight: 'calc(100vh - 64px)',
            borderRadius: '8px',
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
}
