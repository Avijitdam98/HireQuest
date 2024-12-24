import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../providers/ThemeProvider';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import { Notifications, Security, Palette } from '@mui/icons-material';

const Settings = () => {
  const { user } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save notification preferences
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box className="container mx-auto py-8 px-4">
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Palette />
              <Typography variant="h6">Appearance</Typography>
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleTheme}
                  name="theme"
                />
              }
              label="Dark Mode"
            />
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Notifications />
              <Typography variant="h6">Notifications</Typography>
            </div>
            <div className="space-y-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    name="emailNotifications"
                  />
                }
                label="Email Notifications"
              />
              <div className="ml-8 text-sm text-gray-500">
                Receive notifications about new job matches, applications, and messages
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    name="pushNotifications"
                  />
                }
                label="Push Notifications"
              />
              <div className="ml-8 text-sm text-gray-500">
                Receive push notifications for important updates
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Security />
              <Typography variant="h6">Security</Typography>
            </div>
            <div className="space-y-4">
              <div>
                <Typography variant="subtitle1">Email</Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
              </div>
              <Divider />
              <div className="pt-2">
                <Button variant="outlined" color="primary">
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default Settings;
