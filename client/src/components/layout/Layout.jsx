import { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isAdmin = user?.user_metadata?.role === 'admin';
  const isEmployer = user?.user_metadata?.role === 'employer';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    ...(isAdmin
      ? [
          { text: 'Dashboard', icon: <Home />, path: '/admin/dashboard' },
          { text: 'Users', icon: <Users />, path: '/admin/users' },
          { text: 'Applications', icon: <FileText />, path: '/admin/applications' },
        ]
      : isEmployer
      ? [
          { text: 'Jobs', icon: <Briefcase />, path: '/employer/jobs' },
          { text: 'Post Job', icon: <PlusCircle />, path: '/employer/create-job' },
          { text: 'Applications', icon: <FileText />, path: '/employer/applications' },
        ]
      : [
          { text: 'Jobs', icon: <Briefcase />, path: '/jobs' },
          { text: 'My Applications', icon: <FileText />, path: '/applications' },
        ]),
    { text: 'Chat', icon: <MessageSquare />, path: '/chat' },
    { text: 'Teams', icon: <Users />, path: '/teams' },
  ];

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Job Match
          </Typography>
          <IconButton onClick={handleMenuOpen} size="small">
            <Avatar
              alt={user?.email}
              src={user?.user_metadata?.avatar_url}
              sx={{ width: 32, height: 32 }}
            >
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <User size={20} />
              </ListItemIcon>
              Profile
            </MenuItem>
            {user?.user_metadata?.role === 'admin' && (
              <MenuItem component={Link} to="/admin/admin-dashboard">
                Admin Dashboard
              </MenuItem>
            )}
            <MenuItem onClick={() => navigate('/settings')}>
              <ListItemIcon>
                <Settings size={20} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogOut size={20} />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
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
          mt: '64px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default Layout;
