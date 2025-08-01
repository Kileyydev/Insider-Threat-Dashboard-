
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  IconButton,
  InputAdornment,
  AppBar,
  Toolbar,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff, Home, Settings, Person } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

const TopNavBar: React.FC = () => {
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0f2027, #203a43)'
          : 'linear-gradient(135deg, #1976d2, #00bcd4)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 56 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#ffffff', fontSize: { xs: '1rem', md: '1.25rem' } }}>
          Employee Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: '#ffffff' }}><Home /></IconButton>
          <IconButton sx={{ color: '#ffffff' }}><Settings /></IconButton>
          <IconButton sx={{ color: '#ffffff' }}><Person /></IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const FooterSection: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: 1.5,
        background: theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(0,0,0,0.05)',
        textAlign: 'center',
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </Typography>
    </Box>
  );
};

const EmployeeSettingsPage: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false,
  });

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  // Save dark mode preference and update body class
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Define custom theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00bcd4',
      },
      background: {
        default: darkMode ? '#0f2027' : '#f4f6f8',
        paper: darkMode
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.95)',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
        secondary: darkMode ? '#cccccc' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h5: {
        fontWeight: 700,
        color: darkMode ? '#00bcd4' : '#1976d2',
      },
      h6: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#333333',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            padding: '8px 16px',
            background: darkMode
              ? 'linear-gradient(135deg, #00bcd4, #0288d1)'
              : 'linear-gradient(135deg, #1976d2, #00bcd4)',
            '&:hover': {
              background: darkMode
                ? 'linear-gradient(135deg, #0288d1, #00bcd4)'
                : 'linear-gradient(135deg, #1565c0, #0288d1)',
            },
            fontSize: '0.9rem',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              color: darkMode ? '#ffffff' : '#333333',
              '& fieldset': {
                borderColor: darkMode ? '#444444' : '#cccccc',
              },
              '&:hover fieldset': {
                borderColor: darkMode ? '#666666' : '#999999',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
              },
            },
            '& .MuiInputLabel-root': {
              color: darkMode ? '#cccccc' : '#666666',
              fontSize: '0.9rem',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#00bcd4',
            },
            '& .MuiInputBase-input': {
              fontSize: '0.9rem',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backdropFilter: 'blur(6px)',
            background: darkMode
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.95)',
            boxShadow: darkMode
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            minHeight: '40px',
          },
          indicator: {
            backgroundColor: '#00bcd4',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: darkMode ? '#cccccc' : '#666666',
            fontSize: '0.85rem',
            minHeight: '40px',
            padding: '8px 16px',
            '&.Mui-selected': {
              color: darkMode ? '#ffffff' : '#1976d2',
              fontWeight: 600,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: darkMode ? '#666666' : '#cccccc',
            '&.Mui-checked': {
              color: '#00bcd4',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#0288d1',
            },
          },
        },
      },
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode
            ? 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
            : 'linear-gradient(135deg, #e3f2fd, #bbdefb, #90caf9)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background 0.3s',
        }}
      >
        <TopNavBar />
        <Container
          maxWidth="sm"
          sx={{
            flex: 1,
            py: { xs: 2, md: 3 },
            mt: 7, // Adjusted for fixed TopNavBar height
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            Account Settings
          </Typography>

          <Paper sx={{ p: 0 }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              scrollButtons="auto"
              sx={{ px: 1 }}
            >
              <Tab label="Profile" />
              <Tab label="Security" />
              <Tab label="Notifications" />
              <Tab label="Preferences" />
            </Tabs>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {/* Profile Tab */}
              {tab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      defaultValue="Jane Doe"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      defaultValue="janedoe@example.com"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ my: 1.5, borderColor: darkMode ? '#444444' : '#e0e0e0' }} />
                  <Button variant="contained" fullWidth>Save Changes</Button>
                </Box>
              )}

              {/* Security Tab */}
              {tab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    Password & Security
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1.5 }}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showPassword.current ? 'text' : 'password'}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('current')}
                              edge="end"
                            >
                              {showPassword.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPassword.new ? 'text' : 'password'}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('new')}
                              edge="end"
                            >
                              {showPassword.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showPassword.confirm ? 'text' : 'password'}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('confirm')}
                              edge="end"
                            >
                              {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <Divider sx={{ my: 1.5, borderColor: darkMode ? '#444444' : '#e0e0e0' }} />
                  <Button variant="contained" fullWidth>Update Password</Button>
                </Box>
              )}

              {/* Notifications Tab */}
              {tab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    Notification Preferences
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Receive system alerts"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Receive activity reports"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Receive email notifications"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                  </Box>
                  <Divider sx={{ my: 1.5, borderColor: darkMode ? '#444444' : '#e0e0e0' }} />
                  <Button variant="contained" fullWidth>Save Preferences</Button>
                </Box>
              )}

              {/* Preferences Tab */}
              {tab === 3 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem' }}>
                    General Preferences
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={darkMode}
                          onChange={() => setDarkMode(!darkMode)}
                        />
                      }
                      label="Enable Dark Mode"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Show help tooltips"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                  </Box>
                  <Divider sx={{ my: 1.5, borderColor: darkMode ? '#444444' : '#e0e0e0' }} />
                  <Button variant="contained" fullWidth>Save Preferences</Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
        <FooterSection />
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeSettingsPage;
