
'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactElement;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  // Update dark mode in localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Define custom theme to match EmployeeSettingsPage
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00bcd4',
      },
      background: {
        default: darkMode ? '#0f2027' : '#f4f6f8',
        paper: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#333333',
        secondary: darkMode ? '#cccccc' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h6: {
        fontWeight: 700,
        color: darkMode ? '#00bcd4' : '#1976d2',
      },
      body1: {
        fontSize: '0.9rem',
        color: darkMode ? '#ffffff' : '#333333',
      },
    },
    components: {
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 12px',
            margin: '4px 0',
            '&:hover': {
              background: darkMode
                ? 'rgba(0, 188, 212, 0.2)'
                : 'rgba(25, 118, 210, 0.1)',
            },
            '&.Mui-selected': {
              background: darkMode
                ? 'rgba(0, 188, 212, 0.3)'
                : 'rgba(25, 118, 210, 0.2)',
              color: darkMode ? '#ffffff' : '#1976d2',
              '& .MuiListItemText-primary': {
                fontWeight: 600,
              },
              '& .MuiListItemIcon-root': {
                color: darkMode ? '#ffffff' : '#1976d2',
              },
            },
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontSize: '0.9rem',
            color: darkMode ? '#ffffff' : '#333333',
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: '36px',
            color: darkMode ? '#cccccc' : '#666666',
          },
        },
      },
    },
  });

  const menuItems: MenuItem[] = [
    { text: 'Overview', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Users', path: '/dashboard/users', icon: <PeopleIcon /> },
    { text: 'Threat Logs', path: '/dashboard/logs', icon: <WarningIcon /> },
    { text: 'Settings', path: '/dashboard/settings', icon: <SettingsIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: { xs: 200, sm: 240 },
          height: '100vh',
          position: 'fixed',
          top: 56, // Align below fixed TopNavBar
          left: 0,
          background: darkMode
            ? 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
          backdropFilter: 'blur(12px)',
          borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          px: { xs: 1.5, sm: 2 },
          py: 2,
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => router.push(item.path)}
              selected={pathname === item.path}
              sx={{
                mx: 1,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;
