'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  createTheme,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import Sidebar from '../components/SideBar';
import { createAlertsSocket } from '@/lib/alertsSockets';
import useSWR from 'swr';
import { apiGet } from '@/lib/api'; 

const API_BASE =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
    : '';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f44336' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
    text: { primary: '#333333', secondary: '#666666' },
  },
  typography: { fontFamily: '"Arial","Roboto",sans-serif' },
});

interface AuditLog {
  user: string;
  action: string;
  timestamp: string;
}

interface AlertItem {
  id: number;
  user: string;
  action: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  cleared: boolean;
  timestamp: string;
}

export default function InsiderThreatDashboard() {

  const { data: alertsData, mutate } = useSWR('/monitoring/alerts/', apiGet, { refreshInterval: 0 });

  useEffect(() => {
    const ws = createAlertsSocket((alert) => {
      // show notification + prepend to SWR cache
      mutate((existing: any[] = []) => [alert, ...existing], false);
    });
    return () => ws && ws.close();
  }, [mutate]);

  const [tabIndex, setTabIndex] = useState(0);

  // Logs state
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState('');

  // Alerts & summary
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState('');

  // Filters
  const [logSearch, setLogSearch] = useState('');
  const [alertFilterSeverity, setAlertFilterSeverity] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Current date/time string, client-only to avoid hydration errors
  const [currentDateTimeStr, setCurrentDateTimeStr] = useState('');

  useEffect(() => {
    if (token) {
      fetchLogs();
      fetchAlerts();
    }
    // Update current date and time every minute
    const updateDateTime = () => {
      setCurrentDateTimeStr(
        new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', hour12: true })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, [token]);

  async function fetchLogs() {
    setLogsLoading(true);
    setLogsError('');
    try {
      const res = await fetch(`${API_BASE}/api/users/audit/logs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      const auditLogs = data.audit_logs || data;
      setLogs(auditLogs);
    } catch (e: any) {
      setLogsError(e.message || 'Error loading logs');
    } finally {
      setLogsLoading(false);
    }
  }

  async function fetchAlerts() {
    setAlertsLoading(true);
    setAlertsError('');
    try {
      const res = await fetch(`${API_BASE}/api/monitoring/alerts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch alerts');
      const data = await res.json();
      setAlerts(data.alerts || data);
    } catch (e: any) {
      setAlertsError(e.message || 'Error loading alerts');
    } finally {
      setAlertsLoading(false);
    }
  }

  async function clearAlert(alertId: number) {
    try {
      const res = await fetch(`${API_BASE}/api/monitoring/alerts/${alertId}/clear/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to clear alert');
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, cleared: true } : a))
      );
    } catch {
      alert('Error clearing alert');
    }
  }

  // Filtered logs by search term
  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase())
  );

  // Filtered alerts by severity
  const filteredAlerts =
    alertFilterSeverity === 'all'
      ? alerts
      : alerts.filter((a) => a.severity === alertFilterSeverity);

  // Alerts summary data for charts
  const severityCounts = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityData = [
    { name: 'Low', value: severityCounts.low || 0 },
    { name: 'Medium', value: severityCounts.medium || 0 },
    { name: 'High', value: severityCounts.high || 0 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF4C4C'];

  const userAlertCounts: Record<string, number> = {};
  alerts.forEach((a) => {
    if (!a.cleared) userAlertCounts[a.user] = (userAlertCounts[a.user] || 0) + 1;
  });
  const topUsersData = Object.entries(userAlertCounts)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Audit logs summaries
  const actionCounts = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const actionData = Object.entries(actionCounts).map(([action, count]) => ({
    name: action,
    value: count,
  }));

  const userLogCounts = logs.reduce((acc, log) => {
    acc[log.user] = (acc[log.user] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLogUsersData = Object.entries(userLogCounts)
    .map(([user, count]) => ({ user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopNavBar />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <Box sx={{ flex: 1, p: 3, ml: '240px' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Last Updated: {currentDateTimeStr || 'Loading...'}
            </Typography>
            <Typography variant="h4" gutterBottom color="primary">
              Insider Threat Detection and Prevention Dashboard
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Tabs */}
            <Tabs
              value={tabIndex}
              onChange={(e, val) => setTabIndex(val)}
              aria-label="dashboard tabs"
              sx={{ mb: 3 }}
            >
              <Tab label="Audit Logs" />
              <Tab label="Alerts & Summary" />
            </Tabs>

            {/* Tab 0: Audit Logs */}
            {tabIndex === 0 && (
              <Box>
                <TextField
                  placeholder="Search by user or action"
                  fullWidth
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {logsLoading ? (
                  <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
                ) : logsError ? (
                  <Alert severity="error">{logsError}</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={3}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
                          <TableCell sx={{ color: 'white' }}>User</TableCell>
                          <TableCell sx={{ color: 'white' }}>Action</TableCell>
                          <TableCell sx={{ color: 'white' }}>Timestamp</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredLogs.map((log, i) => (
                          <TableRow key={i}>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* Tab 1: Alerts & Summary */}
            {tabIndex === 1 && (
              <Grid container spacing={3}>
                {/* Alerts Table */}
                <Grid item xs={12}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Active Alerts
                      </Typography>
                      <Stack direction="row" spacing={1} mb={2}>
                        <Button
                          variant={alertFilterSeverity === 'all' ? 'contained' : 'outlined'}
                          onClick={() => setAlertFilterSeverity('all')}
                        >
                          All
                        </Button>
                        <Button
                          variant={alertFilterSeverity === 'low' ? 'contained' : 'outlined'}
                          onClick={() => setAlertFilterSeverity('low')}
                          sx={{
                            bgcolor: alertFilterSeverity === 'low' ? '#00C49F' : undefined,
                            color: alertFilterSeverity === 'low' ? 'white' : undefined,
                          }}
                        >
                          Low
                        </Button>
                        <Button
                          variant={alertFilterSeverity === 'medium' ? 'contained' : 'outlined'}
                          onClick={() => setAlertFilterSeverity('medium')}
                          sx={{
                            bgcolor: alertFilterSeverity === 'medium' ? '#FFBB28' : undefined,
                            color: alertFilterSeverity === 'medium' ? 'black' : undefined,
                          }}
                        >
                          Medium
                        </Button>
                        <Button
                          variant={alertFilterSeverity === 'high' ? 'contained' : 'outlined'}
                          onClick={() => setAlertFilterSeverity('high')}
                          sx={{
                            bgcolor: alertFilterSeverity === 'high' ? '#FF4C4C' : undefined,
                            color: alertFilterSeverity === 'high' ? 'white' : undefined,
                          }}
                        >
                          High
                        </Button>
                      </Stack>

                      {alertsLoading ? (
                        <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
                      ) : alertsError ? (
                        <Alert severity="error">{alertsError}</Alert>
                      ) : (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                <TableCell sx={{ color: 'white' }}>User</TableCell>
                                <TableCell sx={{ color: 'white' }}>Action</TableCell>
                                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                                <TableCell sx={{ color: 'white' }}>Severity</TableCell>
                                <TableCell sx={{ color: 'white' }}>Timestamp</TableCell>
                                <TableCell sx={{ color: 'white' }}>Clear</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filteredAlerts.map((alert) => (
                                <TableRow
                                  key={alert.id}
                                  sx={{ bgcolor: alert.cleared ? '#e0f7fa' : undefined }}
                                >
                                  <TableCell>{alert.user}</TableCell>
                                  <TableCell>{alert.action}</TableCell>
                                  <TableCell>{alert.description}</TableCell>
                                  <TableCell
                                    sx={{
                                      color:
                                        alert.severity === 'high'
                                          ? 'secondary.main'
                                          : alert.severity === 'medium'
                                          ? '#FFBB28'
                                          : '#00C49F',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {alert.severity.toUpperCase()}
                                  </TableCell>
                                  <TableCell>
                                    {new Date(alert.timestamp).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    {!alert.cleared && (
                                      <IconButton
                                        color="primary"
                                        onClick={() => clearAlert(alert.id)}
                                      >
                                        <CheckCircleOutline />
                                      </IconButton>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Severity Pie Chart */}
                <Grid item xs={12} md={6}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Alerts by Severity
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={severityData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {severityData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Users Bar Chart */}
                <Grid item xs={12} md={6}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Top Users by Active Alerts
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topUsersData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="user" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#1976d2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Action Pie Chart */}
                <Grid item xs={12} md={6}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Audit Logs by Action
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={actionData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {actionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Log Users Bar Chart */}
                <Grid item xs={12} md={6}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Top Users by Log Activity
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={topLogUsersData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="user" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#1976d2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
        <FooterSection />
      </Box>
    </ThemeProvider>
  );
}
