'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Stack,
  Container,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import Sidebar from '../components/SideBar';

type Rule = {
  id: string;
  name: string;
  resource: string;
  ruleSpec: string;
  policyType: string;
  groupType: string;
  status: 'Active' | 'Inactive';
  priority: 'Low' | 'Medium' | 'High';
};

type AlertType = {
  id: string;
  user: string;
  action: string;
  timestamp: string;
};

const initialRules: Rule[] = [
  {
    id: '1',
    name: 'Access Control',
    resource: 'Server 1',
    ruleSpec: 'Deny unauthorized access',
    policyType: 'RBAC',
    groupType: 'Users',
    status: 'Active',
    priority: 'High',
  },
  {
    id: '2',
    name: 'Data Export',
    resource: 'Database',
    ruleSpec: 'Restrict bulk exports',
    policyType: 'MAC',
    groupType: 'Groups',
    status: 'Inactive',
    priority: 'Medium',
  },
];

const initialAlerts: AlertType[] = [
  { id: '1', user: 'Aaron Bennett', action: 'Unauthorized access attempt on Server 1', timestamp: '2025-08-04 18:30' },
  { id: '2', user: 'Abbey Christy', action: 'Bulk data export detected', timestamp: '2025-08-04 17:15' },
];

const RulesEngine = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('Own Policy');
  const [selectedGroupType, setSelectedGroupType] = useState('Groups');
  const [ruleName, setRuleName] = useState('');
  const [resource, setResource] = useState('');
  const [ruleSpec, setRuleSpec] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [alerts, setAlerts] = useState<AlertType[]>(initialAlerts);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editRule, setEditRule] = useState<Partial<Rule>>({});
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!ruleName) return 'Rule Name is required.';
    if (!resource) return 'Resource is required.';
    if (!ruleSpec) return 'Rule Specifications are required.';
    return '';
  };

  const handleMakePolicy = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setOpenConfirmDialog(true);
  };

  const confirmPolicyCreation = () => {
    const newRule: Rule = {
      id: `${Date.now()}`,
      name: ruleName,
      resource,
      ruleSpec,
      policyType: selectedPolicy,
      groupType: selectedGroupType,
      status: 'Active',
      priority,
    };
    setRules((prev) => [...prev, newRule]);
    setSuccess('Policy created successfully!');
    setOpenConfirmDialog(false);
    setError('');
    setRuleName('');
    setResource('');
    setRuleSpec('');
    setPriority('Medium');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEditRule = (rule: Rule) => {
    setEditRule(rule);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setRules((prev) =>
      prev.map((r) =>
        r.id === editRule.id
          ? {
              ...r,
              name: ruleName,
              resource,
              ruleSpec,
              policyType: selectedPolicy,
              groupType: selectedGroupType,
              priority,
            }
          : r
      )
    );
    setSuccess('Policy updated successfully!');
    setOpenEditDialog(false);
    setEditRule({});
    setRuleName('');
    setResource('');
    setRuleSpec('');
    setPriority('Medium');
    setError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteRule = () => {
    if (deleteRuleId) {
      setRules((prev) => prev.filter((r) => r.id !== deleteRuleId));
      setSuccess('Policy deleted successfully!');
      setOpenDeleteDialog(false);
      setDeleteRuleId(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleViewAuditLogs = () => {
    alert('Redirect to audit logs page...');
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
            Rules Engine
          </Typography>

          <Stack spacing={4}>
            {/* New Policy Form */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  mb: 3,
                  background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                New Policy
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Choose Policy
                  </Typography>
                  <RadioGroup
                    value={selectedPolicy}
                    onChange={(e) => setSelectedPolicy(e.target.value)}
                    sx={{ color: '#fff' }}
                  >
                    {['RBAC', 'MAC', 'Own Policy', 'DAC'].map((policy) => (
                      <FormControlLabel
                        key={policy}
                        value={policy}
                        control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#00bcd4' } }} />}
                        label={<Typography sx={{ color: '#fff' }}>{policy}</Typography>}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                    Choose Group
                  </Typography>
                  <RadioGroup
                    value={selectedGroupType}
                    onChange={(e) => setSelectedGroupType(e.target.value)}
                    sx={{ color: '#fff' }}
                  >
                    {['Users', 'Groups'].map((groupType) => (
                      <FormControlLabel
                        key={groupType}
                        value={groupType}
                        control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#00bcd4' } }} />}
                        label={<Typography sx={{ color: '#fff' }}>{groupType}</Typography>}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </Box>
              <Stack spacing={3}>
                <TextField
                  label="Rule Name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="MyOwnPolicy"
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
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Resource
                  </InputLabel>
                  <Select
                    value={resource}
                    onChange={(e) => setResource(e.target.value)}
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
                    <MenuItem value="">Choose resource</MenuItem>
                    <MenuItem value="Server 1">Server 1</MenuItem>
                    <MenuItem value="Database">Database</MenuItem>
                    <MenuItem value="API">API</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Rule Specifications"
                  value={ruleSpec}
                  onChange={(e) => setRuleSpec(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Add Rule"
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
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Priority
                  </InputLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
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
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleMakePolicy}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 1,
                    py: 1.5,
                    '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                  }}
                  fullWidth
                >
                  Create Policy
                </Button>
              </Stack>
            </Paper>

            {/* Rule List */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
                Existing Rules
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650, color: '#fff' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Resource</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Policy Type</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Group</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Priority</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell sx={{ color: '#fff' }}>{rule.name}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{rule.resource}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{rule.policyType}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{rule.groupType}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>
                          <Chip
                            label={rule.status}
                            color={rule.status === 'Active' ? 'success' : 'default'}
                            size="small"
                            sx={{
                              bgcolor: rule.status === 'Active' ? '#4caf50' : '#757575',
                              color: '#fff',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#fff' }}>
                          <Chip
                            label={rule.priority}
                            color={
                              rule.priority === 'High' ? 'error' : rule.priority === 'Medium' ? 'warning' : 'info'
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                rule.priority === 'High'
                                  ? '#f44336'
                                  : rule.priority === 'Medium'
                                  ? '#ff9800'
                                  : '#2196f3',
                              color: '#fff',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => {
                                setEditRule(rule);
                                setRuleName(rule.name);
                                setResource(rule.resource);
                                setRuleSpec(rule.ruleSpec);
                                setSelectedPolicy(rule.policyType);
                                setSelectedGroupType(rule.groupType);
                                setPriority(rule.priority);
                                setOpenEditDialog(true);
                              }}
                            >
                              <Edit sx={{ color: '#00bcd4' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                setDeleteRuleId(rule.id);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <Delete sx={{ color: '#f44336' }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Threat Alerts */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
                Recent Threat Alerts
              </Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650, color: '#fff' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Action</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Timestamp</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell sx={{ color: '#fff' }}>{alert.user}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{alert.action}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>{alert.timestamp}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton onClick={handleViewAuditLogs}>
                              <Visibility sx={{ color: '#00bcd4' }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                onClick={handleViewAuditLogs}
                sx={{
                  mt: 3,
                  color: '#00bcd4',
                  borderColor: '#00bcd4',
                  '&:hover': { borderColor: '#0288d1', background: 'rgba(0,188,212,0.1)' },
                }}
              >
                View Full Audit Logs
              </Button>
            </Paper>
          </Stack>

          {/* Create Policy Confirmation Dialog */}
          <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
              Confirm Policy Creation
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              <Typography>Are you sure you want to create this policy?</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Name:</strong> {ruleName}</Typography>
                <Typography><strong>Resource:</strong> {resource}</Typography>
                <Typography><strong>Rule:</strong> {ruleSpec}</Typography>
                <Typography><strong>Policy Type:</strong> {selectedPolicy}</Typography>
                <Typography><strong>Group:</strong> {selectedGroupType}</Typography>
                <Typography><strong>Priority:</strong> {priority}</Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
              <Button
                onClick={() => setOpenConfirmDialog(false)}
                sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPolicyCreation}
                variant="contained"
                sx={{
                  background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                  color: '#fff',
                  '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Policy Dialog */}
          <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
              Edit Policy
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', pt: 2 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Stack spacing={3}>
                <TextField
                  label="Rule Name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="MyOwnPolicy"
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
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Resource
                  </InputLabel>
                  <Select
                    value={resource}
                    onChange={(e) => setResource(e.target.value)}
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
                    <MenuItem value="">Choose resource</MenuItem>
                    <MenuItem value="Server 1">Server 1</MenuItem>
                    <MenuItem value="Database">Database</MenuItem>
                    <MenuItem value="API">API</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Rule Specifications"
                  value={ruleSpec}
                  onChange={(e) => setRuleSpec(e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Add Rule"
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
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Policy Type
                  </InputLabel>
                  <Select
                    value={selectedPolicy}
                    onChange={(e) => setSelectedPolicy(e.target.value)}
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
                    <MenuItem value="RBAC">RBAC</MenuItem>
                    <MenuItem value="MAC">MAC</MenuItem>
                    <MenuItem value="Own Policy">Own Policy</MenuItem>
                    <MenuItem value="DAC">DAC</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Group Type
                  </InputLabel>
                  <Select
                    value={selectedGroupType}
                    onChange={(e) => setSelectedGroupType(e.target.value)}
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
                    <MenuItem value="Users">Users</MenuItem>
                    <MenuItem value="Groups">Groups</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Priority
                  </InputLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
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
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
              <Button
                onClick={() => {
                  setOpenEditDialog(false);
                  setError('');
                }}
                sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
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

          {/* Delete Policy Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
              Confirm Policy Deletion
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }}>
              <Typography>Are you sure you want to delete this policy?</Typography>
            </DialogContent>
            <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteRule}
                variant="contained"
                sx={{
                  background: '#f44336',
                  color: '#fff',
                  '&:hover': { background: '#d32f2f' },
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      <FooterSection />
    </Box>
  );
};

export default RulesEngine;