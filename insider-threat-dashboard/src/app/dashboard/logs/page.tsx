'use client';

import React, { useState, useMemo } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Container,
  TableSortLabel,
} from '@mui/material';
import { Visibility, Save, Sort } from '@mui/icons-material';
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
  details: string;
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
    details: 'User accessed payroll file without proper authorization. Potential data breach risk.',
  },
  {
    id: 'TL-102',
    user: 'linda@company.com',
    department: 'HR',
    action: 'Downloaded employee contracts',
    threatLevel: 'Medium',
    timestamp: '2025-08-01 08:47:21',
    status: 'Resolved',
    details: 'Download was part of routine HR process. No threat identified after review.',
  },
  {
    id: 'TL-103',
    user: 'admin@company.com',
    department: 'IT',
    action: 'Attempted to access restricted Finance folder',
    threatLevel: 'Critical',
    timestamp: '2025-07-31 22:11:03',
    status: 'Pending',
    details: 'Multiple failed attempts detected. Account temporarily locked for review.',
  },
];

const getThreatColor = (level: string) => {
  switch (level) {
    case 'Low':
      return 'info';
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
  const [logs, setLogs] = useState<ThreatLog[]>(initialLogs);
  const [threatLevelFilter, setThreatLevelFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof ThreatLog>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLog, setSelectedLog] = useState<ThreatLog | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const departments = [...new Set(initialLogs.map((log) => log.department))];

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = logs;

    if (threatLevelFilter) {
      filtered = filtered.filter((log) => log.threatLevel === threatLevelFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }
    if (departmentFilter) {
      filtered = filtered.filter((log) => log.department === departmentFilter);
    }
    if (dateFilter) {
      filtered = filtered.filter((log) => log.timestamp.startsWith(dateFilter));
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortField === 'timestamp') {
        return sortOrder === 'asc'
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [logs, threatLevelFilter, statusFilter, departmentFilter, dateFilter, sortField, sortOrder]);

  const threatLevelCounts = useMemo(() => {
    return logs.reduce(
      (acc, log) => ({
        ...acc,
        [log.threatLevel]: (acc[log.threatLevel] || 0) + 1,
      }),
      {} as Record<string, number>
    );
  }, [logs]);

  const statusCounts = useMemo(() => {
    return logs.reduce(
      (acc, log) => ({
        ...acc,
        [log.status]: (acc[log.status] || 0) + 1,
      }),
      {} as Record<string, number>
    );
  }, [logs]);

  const handleSort = (field: keyof ThreatLog) => {
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleViewDetails = (log: ThreatLog) => {
    setSelectedLog(log);
    setNewStatus(log.status);
    setNotes('');
    setOpenDetailsDialog(true);
  };

  const handleUpdateStatus = () => {
    if (selectedLog) {
      setLogs((prev) =>
        prev.map((log) =>
          log.id === selectedLog.id ? { ...log, status: newStatus, details: `${log.details}\nNote: ${notes}` } : log
        )
      );
      setSuccess('Log status updated successfully!');
      setOpenDetailsDialog(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleExportLogs = () => {
    const csv = [
      'ID,User,Department,Action,Threat Level,Timestamp,Status,Details',
      ...filteredAndSortedLogs.map(
        (log) =>
          `${log.id},${log.user},${log.department},"${log.action}",${log.threatLevel},${log.timestamp},${log.status},"${log.details.replace(/\n/g, ' ')}"`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'threat_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0a101f, #1a2a3c)', minHeight: '100vh' }}>
      <TopNavBar />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 12, md: 14 },
            pb: 6,
            ml: { xs: 0, md: '240px' },
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Insider Threat Logs
          </Typography>

          <Stack spacing={4}>
            {/* Threat Analytics Summary */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                Threat Analytics Summary
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {Object.entries(threatLevelCounts).map(([level, count]) => (
                  <Chip
                    key={level}
                    label={`${level}: ${count}`}
                    color={getThreatColor(level)}
                    sx={{ bgcolor: getThreatColor(level) === 'error' ? '#f44336' : undefined, color: '#fff' }}
                  />
                ))}
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Chip
                    key={status}
                    label={`${status}: ${count}`}
                    color={getStatusColor(status)}
                    sx={{ bgcolor: getStatusColor(status) === 'error' ? '#f44336' : undefined, color: '#fff' }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Filters */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                Filter Logs
              </Typography>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Threat Level
                  </InputLabel>
                  <Select
                    value={threatLevelFilter}
                    onChange={(e) => setThreatLevelFilter(e.target.value)}
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Status
                  </InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Investigating">Investigating</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Department
                  </InputLabel>
                  <Select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Date (YYYY-MM-DD)"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="2025-08-01"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00bcd4' },
                      '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                    },
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setThreatLevelFilter('');
                  setStatusFilter('');
                  setDepartmentFilter('');
                  setDateFilter('');
                }}
                sx={{
                  mt: 2,
                  color: '#00bcd4',
                  borderColor: '#00bcd4',
                  '&:hover': { borderColor: '#0288d1', background: 'rgba(0,188,212,0.1)' },
                }}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                onClick={handleExportLogs}
                sx={{
                  mt: 2,
                  ml: 2,
                  background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                }}
              >
                Export Logs as CSV
              </Button>
            </Paper>

            {/* Threat Logs Table */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                overflowX: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                Threat Logs
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'id'}
                        direction={sortField === 'id' ? sortOrder : 'asc'}
                        onClick={() => handleSort('id')}
                        sx={{ color: '#00e5ff', '&.Mui-active': { color: '#00bcd4' } }}
                      >
                        ID
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'user'}
                        direction={sortField === 'user' ? sortOrder : 'asc'}
                        onClick={() => handleSort('user')}
                        sx={{ color: '#00e5ff', '&.Mui-active': { color: '#00bcd4' } }}
                      >
                        User
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'department'}
                        direction={sortField === 'department' ? sortOrder : 'asc'}
                        onClick={() => handleSort('department')}
                        sx={{ color: '#00e5ff', '&.Mui-active': { color: '#00bcd4' } }}
                      >
                        Department
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'threatLevel'}
                        direction={sortField === 'threatLevel' ? sortOrder : 'asc'}
                        onClick={() => handleSort('threatLevel')}
                        sx={{ color: '#00e5ff', '&.Mui-active': { color: '#00bcd4' } }}
                      >
                        Threat Level
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'timestamp'}
                        direction={sortField === 'timestamp' ? sortOrder : 'asc'}
                        onClick={() => handleSort('timestamp')}
                        sx={{ color: '#00e5ff', '&.Mui-active': { color: '#00bcd4' } }}
                      >
                        Timestamp
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'status'}
                        direction={sortField === 'status' ? sortOrder : 'asc'}
                        onClick={() => handleSort('status')}
                        sx={{ color: '#00e5ff', '&.Mui-active': { color: '#00bcd4' } }}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell sx={{ color: '#fff' }}>{log.id}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{log.user}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{log.department}</TableCell>
                      <TableCell sx={{ color: '#fff' }}>{log.action}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.threatLevel}
                          color={getThreatColor(log.threatLevel)}
                          sx={{
                            bgcolor:
                              log.threatLevel === 'High'
                                ? '#f44336'
                                : log.threatLevel === 'Critical'
                                ? '#d81b60'
                                : undefined,
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#fff' }}>{log.timestamp}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status}
                          color={getStatusColor(log.status)}
                          sx={{
                            bgcolor: log.status === 'Pending' ? '#f44336' : undefined,
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton onClick={() => handleViewDetails(log)}>
                            <Visibility sx={{ color: '#00bcd4' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Stack>

          {/* Details Dialog */}
          <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
              Threat Log Details
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', pt: 2 }}>
              {selectedLog && (
                <Stack spacing={2}>
                  <Typography><strong>ID:</strong> {selectedLog.id}</Typography>
                  <Typography><strong>User:</strong> {selectedLog.user}</Typography>
                  <Typography><strong>Department:</strong> {selectedLog.department}</Typography>
                  <Typography><strong>Action:</strong> {selectedLog.action}</Typography>
                  <Typography><strong>Threat Level:</strong> {selectedLog.threatLevel}</Typography>
                  <Typography><strong>Timestamp:</strong> {selectedLog.timestamp}</Typography>
                  <Typography><strong>Details:</strong> {selectedLog.details}</Typography>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                      Update Status
                    </InputLabel>
                    <Select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      sx={{
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00bcd4' },
                        '& .MuiSvgIcon-root': { color: '#fff' },
                      }}
                    >
                      <MenuItem value="Resolved">Resolved</MenuItem>
                      <MenuItem value="Investigating">Investigating</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Add Note"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover fieldset': { borderColor: '#00bcd4' },
                        '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                      },
                      '& .MuiInputLabel-root': { color: '#fff' },
                      '& .MuiInputBase-input': { color: '#fff' },
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 1,
                    }}
                  />
                </Stack>
              )}
            </DialogContent>
            <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
              <Button
                onClick={() => setOpenDetailsDialog(false)}
                sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStatus}
                variant="contained"
                sx={{
                  background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      <FooterSection />
    </Box>
  );
};

export default ThreatLogsPage;