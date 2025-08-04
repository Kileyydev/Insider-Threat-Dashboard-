
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import Sidebar from '../components/SideBar';

interface ThreatLog {
  id: string;
  user: string;
  department: string;
  action: string;
  threatLevel: string;
  timestamp: string;
  status: string;
}

const initialLogs: ThreatLog[] = [
  {
    id: 'TL-101',
    user: 'jane@company.com',
    department: 'Finance',
    action: 'Accessed confidential payroll file',
    threatLevel: 'High',
    timestamp: '2025-08-01 09:23:44',
    status: 'Investigating',
  },
  {
    id: 'TL-102',
    user: 'linda@company.com',
    department: 'HR',
    action: 'Downloaded employee contracts',
    threatLevel: 'Medium',
    timestamp: '2025-08-01 08:47:21',
    status: 'Resolved',
  },
  {
    id: 'TL-103',
    user: 'admin@company.com',
    department: 'IT',
    action: 'Attempted to access restricted Finance folder',
    threatLevel: 'Critical',
    timestamp: '2025-07-31 22:11:03',
    status: 'Pending',
  },
];

const getThreatColor = (level: string) => {
  switch (level) {
    case 'Low':
      return 'default';
    case 'Medium':
      return 'warning';
    case 'High':
      return 'error';
    case 'Critical':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'success';
    case 'Investigating':
      return 'warning';
    case 'Pending':
      return 'error';
    default:
      return 'default';
  }
};

const ThreatLogsPage: React.FC = () => {
  const [logs] = useState<ThreatLog[]>(initialLogs);

  // Define custom theme to match UsersPage
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00bcd4',
      },
      background: {
        default: '#0a101f',
        paper: 'rgba(255,255,255,0.05)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h4: {
        fontWeight: 700,
        color: '#00bcd4',
      },
      h6: {
        fontWeight: 600,
        color: '#ffffff',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backdropFilter: 'blur(6px)',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            fontSize: '0.9rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
          head: {
            color: '#00e5ff',
            fontWeight: 600,
            background: 'rgba(0, 188, 212, 0.1)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#00e5ff',
            '&:hover': {
              color: '#00bcd4',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontSize: '0.85rem',
            height: '28px',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a101f, #1a2a3c)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopNavBar />
        <Box sx={{ display: 'flex', flex: 1, mt: 7 }}>
          <Sidebar />
          <Box
            sx={{
              flexGrow: 1,
              ml: { xs: 0, sm: '240px' },
              width: { xs: '100%', sm: 'calc(100% - 240px)' },
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' },
                mb: 2,
              }}
            >
              Insider Threat Logs
            </Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Threat Level</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.department}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Chip label={log.threatLevel} color={getThreatColor(log.threatLevel)} />
                      </TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Chip label={log.status} color={getStatusColor(log.status)} />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
        <FooterSection />
      </Box>
    </ThemeProvider>
  );
};

export default ThreatLogsPage;
