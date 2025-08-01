'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WarningIcon from '@mui/icons-material/Warning';
import FooterSection from '@/app/components/FooterSection';

const FinanceDirectorDashboard = () => {
  const files = [
    { name: 'Q2_Budget_Report.xlsx', updated: 'Updated 3 days ago', type: 'xlsx' },
    { name: 'Payroll_Records_2025.pdf', updated: 'Confidential', type: 'pdf' },
    { name: 'Department_Policies.docx', updated: 'Last reviewed: June 12', type: 'docx' },
  ];

  const activities = [
    { action: 'Officer John downloaded Payroll_Records_2025.pdf', time: 'Today, 09:23 AM' },
    { action: 'Intern Linda viewed Department_Policies.docx', time: 'Yesterday, 4:40 PM' },
  ];

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/files/${fileName}`; // Mock file path; replace with actual API endpoint
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #2c3e50 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.05) 0%, transparent 60%)',
          animation: 'rotate 30s linear infinite',
          '@keyframes rotate': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
          zIndex: 0,
        },
      }}
    >
      {/* Taskbar (Header) */}
      <AppBar position="static" sx={{ background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(5px)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#00bcd4' }}>
            Finance Director Dashboard
          </Typography>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop Content */}
      <Box
        sx={{
          p: 4,
          pt: 2,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* File Explorer Section */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#00bcd4' }}>
            Network Files
          </Typography>
          <List>
            {files.map((file, index) => (
              <ListItem
                key={file.name}
                sx={{
                  p: 1.5,
                  transition: 'background 0.3s',
                  '&:hover': { background: 'rgba(0, 188, 212, 0.1)' },
                  mb: index < files.length - 1 ? 1 : 0, // Spacing instead of dividers
                }}
              >
                <ListItemIcon>
                  <DescriptionIcon
                    sx={{
                      color: file.type === 'xlsx' ? '#217346' : file.type === 'pdf' ? '#ff0000' : '#2a5298',
                      fontSize: 30,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={file.updated}
                  primaryTypographyProps={{ color: '#fff', fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: '#bbb' }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(file.name)}
                  sx={{
                    color: '#00bcd4',
                    borderColor: '#00bcd4',
                    '&:hover': { background: 'rgba(0, 188, 212, 0.2)' },
                  }}
                >
                  Download
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Financial Summary */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#00bcd4' }}>
            Budget Overview
          </Typography>
          <Typography sx={{ color: '#fff', mb: 1 }}>
            • Q2 Budget: <strong>$850,000</strong>
          </Typography>
          <Typography sx={{ color: '#fff', mb: 1 }}>
            • Expenses to Date: <strong>$645,300</strong>
          </Typography>
          <Typography sx={{ color: '#fff' }}>
            • Remaining Budget: <strong>$204,700</strong>
          </Typography>
        </Paper>

        {/* Activity Log */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#00bcd4' }}>
            Recent Activity Log
          </Typography>
          <List>
            {activities.map((activity, index) => (
              <ListItem
                key={activity.action}
                sx={{
                  p: 1.5,
                  mb: index < activities.length - 1 ? 1 : 0, // Spacing instead of dividers
                }}
              >
                <ListItemText
                  primary={activity.action}
                  secondary={activity.time}
                  primaryTypographyProps={{ color: '#fff', fontWeight: 'medium' }}
                  secondaryTypographyProps={{ color: '#bbb' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Alerts */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#ff4444' }}>
            Insider Threat Actions
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#bbb' }}>
            Detect suspicious activity? Trigger an alert now.
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<WarningIcon />}
            sx={{
              textTransform: 'none',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            Trigger Alert
          </Button>
        </Paper>
        <FooterSection/>
      </Box>
    </Box>
  );
};

export default FinanceDirectorDashboard;