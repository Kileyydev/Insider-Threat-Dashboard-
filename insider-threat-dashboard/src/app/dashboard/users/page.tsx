'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Avatar,
  ListItem,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit, Delete, Person, KeyboardArrowLeft, Close, Add } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material/Select';
import TopNavBar from '@/app/components/TopNavBar';
import Sidebar from '../components/SideBar';
import FooterSection from '@/app/components/FooterSection';

interface User {
  id: number;
  email: string;
  full_name: string;
  department?: string | null;
  group?: string | null;
  is_simulated_threat: boolean;
}

interface Resource {
  id: number;
  name: string;
  path: string | null;
  is_folder: boolean;
  department: string;
  access_level: string;
}

interface Group {
  id: number;
  name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

// Helper function to get cookie value
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


// Helper function to make authenticated requests with CSRF protection
async function makeRequest(url: string, options: RequestInit = {}) {
  // First ensure we have CSRF token
  await fetch(`${API_BASE}/api/csrf/`, {
    credentials: 'include',
  });

  // Merge headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('X-CSRFToken')) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
  }

  // Add authorization if we have a token
  const token = localStorage.getItem('accessToken');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Make the request with credentials
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export default function AdminTabsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<'add' | 'edit'>('add');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    email: '',
    full_name: '',
    department: '',
    group: '',
    password: '',
    is_simulated_threat: false,
  });
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState('');
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileModalMode, setFileModalMode] = useState<'add' | 'edit'>('add');
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [fileFormData, setFileFormData] = useState({
    name: '',
    department: '',
    access_level: '',
    is_folder: false,
  });
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [updateSetting, setUpdateSetting] = useState<string>('');
  const [updateValue, setUpdateValue] = useState<string | boolean>('');
  const token = useMemo(() => localStorage.getItem('accessToken'), []);

  useEffect(() => {
    if (!token) return;
    
    async function fetchGroups() {
      try {
        const res = await makeRequest(`${API_BASE}/api/groups/`);
        if (!res.ok) throw new Error(`Failed to fetch groups: ${res.status}`);
        const data = await res.json();
        setGroups(data);
      } catch (e) {}
    }
    fetchGroups();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) {
      setUsersError('You are not logged in.');
      return;
    }
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await makeRequest(`${API_BASE}/api/users/`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      setUsersError(e.message || 'Failed to fetch users.');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchFiles = async () => {
    if (!token) {
      setFilesError('You are not logged in.');
      return;
    }
    setFilesLoading(true);
    setFilesError('');
    try {
      const res = await makeRequest(`${API_BASE}/api/department_resources/`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setResources(data);
    } catch (e: any) {
      setFilesError(e.message || 'Failed to fetch resources.');
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const filteredUsers = users.filter(
    u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToSelected = (user: User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeSelected = (user: User) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
  };

  const openUserAddModal = () => {
    setUserModalMode('add');
    setEditingUser(null);
    setUserFormData({ email: '', full_name: '', department: '', group: '', password: '', is_simulated_threat: false });
    setUserModalOpen(true);
  };

  const openUserEditModal = (user: User) => {
    setUserModalMode('edit');
    setEditingUser(user);
    setUserFormData({
      email: user.email,
      full_name: user.full_name || '',
      department: user.department || '',
      group: user.group || '',
      password: '',
      is_simulated_threat: user.is_simulated_threat,
    });
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    setUserModalOpen(false);
    setUsersError('');
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as any;
    setUserFormData({ ...userFormData, [name]: value });
    setUsersError('');
  };

  const handleUserCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserFormData({ ...userFormData, [name]: checked });
  };

  const handleSaveUser = async () => {
    if (!userFormData.email || !userFormData.full_name || !userFormData.department || !userFormData.group) {
      setUsersError('Email, full name, department, and group are required.');
      return;
    }
    if (userModalMode === 'add' && !userFormData.password) {
      setUsersError('Password is required for new users.');
      return;
    }

    setSaving(true);
    setUsersError('');
    try {
      let res;
      const payload: any = {
        email: userFormData.email,
        full_name: userFormData.full_name,
        department: userFormData.department || null,
        group: userFormData.group || null,
        is_simulated_threat: userFormData.is_simulated_threat,
      };
      if (userModalMode === 'add') {
        payload.password = userFormData.password;
        res = await makeRequest(`${API_BASE}/api/users/`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else if (userModalMode === 'edit' && editingUser) {
        if (userFormData.password) {
          payload.password = userFormData.password;
        }
        res = await makeRequest(`${API_BASE}/api/users/${editingUser.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      if (!res || !res.ok) {
        const errData = await res?.json();
        throw new Error(errData?.detail || 'Failed to save user');
      }
      await fetchUsers();
      closeUserModal();
    } catch (e: any) {
      setUsersError(e.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) return;
    if (!token) return setUsersError('You are not logged in.');

    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await makeRequest(`${API_BASE}/api/users/${user.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.detail || 'Failed to delete user');
      }
      await fetchUsers();
    } catch (e: any) {
      setUsersError(e.message || 'Failed to delete user');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleApplySettings = async () => {
    if (!updateSetting || selectedUsers.length === 0) return;
    setSaving(true);
    setUsersError('');
    try {
      for (const user of selectedUsers) {
        const payload: any = {
          [updateSetting]: updateSetting === 'is_simulated_threat' ? !!updateValue : updateValue,
        };
        const res = await makeRequest(`${API_BASE}/api/users/${user.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.detail || 'Failed to update user');
        }
      }
      await fetchUsers();
      setSelectedUsers([]);
      setUpdateSetting('');
      setUpdateValue('');
    } catch (e: any) {
      setUsersError(e.message || 'Failed to apply settings');
    } finally {
      setSaving(false);
    }
  };

  const openAddFileModal = (department: string) => {
    setFileModalMode('add');
    setEditingResource(null);
    setFileFormData({ name: '', department: department, access_level: '', is_folder: false });
    setFileModalOpen(true);
  };

  const openEditFileModal = (resource: Resource) => {
    setFileModalMode('edit');
    setEditingResource(resource);
    setFileFormData({
      name: resource.name,
      department: resource.department,
      access_level: resource.access_level,
      is_folder: resource.is_folder,
    });
    setFileModalOpen(true);
  };

  const closeFileModal = () => {
    setFileModalOpen(false);
    setFilesError('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as any;
    setFileFormData({ ...fileFormData, [name]: value });
    setFilesError('');
  };

  const handleFileCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFileFormData({ ...fileFormData, [name]: checked });
  };

  const handleAddFile = async () => {
    if (!fileFormData.name || !fileFormData.department || !fileFormData.access_level) {
      setFilesError('Name, department, and access level are required.');
      return;
    }
    setSaving(true);
    setFilesError('');
    try {
      const payload = {
        name: fileFormData.name,
        path: null,
        is_folder: fileFormData.is_folder,
        department: fileFormData.department,
        access_level: fileFormData.access_level,
      };
      const res = await makeRequest(`${API_BASE}/api/department_resources/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.detail || 'Failed to add resource');
      }
      await fetchFiles();
      closeFileModal();
    } catch (e: any) {
      setFilesError(e.message || 'Failed to add resource');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFile = async () => {
    if (!fileFormData.name || !fileFormData.access_level) {
      setFilesError('Name and access level are required.');
      return;
    }
    if (!editingResource) return;
    setSaving(true);
    setFilesError('');
    try {
      const payload = {
        name: fileFormData.name,
        path: null,
        is_folder: fileFormData.is_folder,
        department: fileFormData.department,
        access_level: fileFormData.access_level,
      };
      const res = await makeRequest(`${API_BASE}/api/department_resources/${editingResource.id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.detail || 'Failed to update resource');
      }
      await fetchFiles();
      closeFileModal();
    } catch (e: any) {
      setFilesError(e.message || 'Failed to update resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFile = async (resource: Resource) => {
    if (!confirm(`Are you sure you want to delete ${resource.name}? This action cannot be undone.`)) return;
    setFilesLoading(true);
    setFilesError('');
    try {
      const res = await makeRequest(`${API_BASE}/api/department_resources/${resource.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.detail || 'Failed to delete resource');
      }
      await fetchFiles();
    } catch (e: any) {
      setFilesError(e.message || 'Failed to delete resource');
    } finally {
      setFilesLoading(false);
    }
  };

  const resourcesByDepartment = resources.reduce<Record<string, Resource[]>>((acc, resource) => {
    if (!acc[resource.department]) acc[resource.department] = [];
    acc[resource.department].push(resource);
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 3, ml: '240px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" color="text.primary">Page 1</Typography>
              <IconButton sx={{ color: 'primary.main' }}><KeyboardArrowLeft /></IconButton>
              <Typography variant="body1" color="text.primary">C</Typography>
              <Typography variant="h6" color="primary.main">Insentinel.com</Typography>
            </Stack>
            <Button variant="contained" color="secondary">
              Log Out
            </Button>
          </Box>
          <Typography variant="h6" color="text.primary" mb={2}>User Management</Typography>
          {usersLoading ? (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : usersError ? (
            <Typography color="error">{usersError}</Typography>
          ) : (
            <Stack spacing={4}>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" gutterBottom color="text.primary">
                    Select Users
                  </Typography>
                  <Button variant="contained" color="primary" startIcon={<Add />} onClick={openUserAddModal}>
                    Add User
                  </Button>
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: 1,
                    borderColor: '#bdbdbd',
                    borderRadius: 1,
                    p: 0.5,
                    mb: 2,
                    bgcolor: '#fff',
                  }}
                >
                  <IconButton size="small" sx={{ color: '#424242' }}>
                    <KeyboardArrowLeft />
                  </IconButton>
                  <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    sx={{ flex: 1, mx: 1, color: '#424242' }}
                    placeholder="Search by email or name"
                  />
                  <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#424242' }}>
                    <Close />
                  </IconButton>
                </Box>
                <Stack spacing={0} sx={{ mb: 2 }}>
                  {filteredUsers.map(user => (
                    <ListItem key={user.id} button onClick={() => addToSelected(user)} sx={{ py: 1, '&:hover': { bgcolor: '#e0e0e0' } }}>
                      <Avatar sx={{ bgcolor: '#757575', mr: 2 }}>
                        <Person />
                      </Avatar>
                      <Typography color="text.primary">{user.full_name}</Typography>
                    </ListItem>
                  ))}
                </Stack>
                <Typography variant="body2" color="text.primary" mb={1}>
                  Selected Users:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                  {selectedUsers.map(user => (
                    <Chip
                      key={user.id}
                      label={user.full_name}
                      onDelete={() => removeSelected(user)}
                      variant="outlined"
                      sx={{ borderColor: '#757575', color: '#424242' }}
                    />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom color="text.primary">
                  Update User Settings
                  
                </Typography>
                <Select
                  value={updateSetting}
                  onChange={(e) => setUpdateSetting(e.target.value as string)}
                  displayEmpty
                  fullWidth
                  sx={{ mb: 2, color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                >
                  <MenuItem value="" disabled>
                    Choose Setting
                  </MenuItem>
                  <MenuItem value="department">Department</MenuItem>
                  <MenuItem value="group">Group</MenuItem>
                  <MenuItem value="is_simulated_threat">Simulated Threat</MenuItem>
                </Select>
                {updateSetting && (
                  <Box sx={{ mb: 2 }}>
                    {updateSetting === 'department' && (
                      <Select
                        value={updateValue as string}
                        onChange={(e) => setUpdateValue(e.target.value as string)}
                        fullWidth
                        sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                      >
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                      </Select>
                    )}
                    {updateSetting === 'group' && (
                      <Select
                        value={updateValue as string}
                        onChange={(e) => setUpdateValue(e.target.value as string)}
                        fullWidth
                        sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                      >
                        <MenuItem value="intern">Intern</MenuItem>
                        <MenuItem value="Regular Staff">Regular Staff</MenuItem>
                        <MenuItem value="Department Leads">Department Leads</MenuItem>
                        <MenuItem value="Managers">Managers</MenuItem>
                      </Select>
                    )}
                    {updateSetting === 'is_simulated_threat' && (
                      <FormControlLabel
                        control={<Checkbox checked={!!updateValue} onChange={(e) => setUpdateValue(e.target.checked)} />}
                        label="Simulate Insider Threat"
                        sx={{ color: '#424242' }}
                      />
                    )}
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplySettings}
                  disabled={saving || selectedUsers.length === 0 || !updateSetting || !updateValue}
                >
                  Apply Settings
                </Button>
              </Box>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom color="text.primary">
                  Users Data
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300, mb: 2 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Email</TableCell>
                        <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Full Name</TableCell>
                        <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Department</TableCell>
                        <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Group</TableCell>
                        <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Simulated Threat</TableCell>
                        <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242', textAlign: 'right' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ color: '#424242' }}>
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredUsers.map(user => (
                        <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: '#e0e0e0' } }}>
                          <TableCell sx={{ color: '#424242' }}>{user.email}</TableCell>
                          <TableCell sx={{ color: '#424242' }}>{user.full_name}</TableCell>
                          <TableCell sx={{ color: '#424242' }}>{user.department || '-'}</TableCell>
                          <TableCell sx={{ color: '#424242' }}>{user.group || '-'}</TableCell>
                          <TableCell sx={{ color: '#424242' }}>{user.is_simulated_threat ? 'Yes' : 'No'}</TableCell>
                          <TableCell sx={{ color: '#424242', textAlign: 'right' }}>
                            <IconButton color="primary" onClick={() => openUserEditModal(user)} size="small" aria-label="edit user">
                              <Edit />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteUser(user)} size="small" aria-label="delete user">
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom color="text.primary">
                  Files and Folders
                </Typography>
                {filesLoading ? (
                  <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : filesError ? (
                  <Typography color="error">{filesError}</Typography>
                ) : Object.keys(resourcesByDepartment).length === 0 ? (
                  <Typography color="text.primary">No files available.</Typography>
                ) : (
                  Object.entries(resourcesByDepartment).map(([department, files]) => (
                    <Box key={department} mb={3}>
                      <Typography variant="subtitle1" gutterBottom color="text.primary">
                        Department: {department}
                      </Typography>
                      <TableContainer component={Paper}>
                        <Table size="small" stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Name</TableCell>
                              <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Type</TableCell>
                              <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242' }}>Access Level</TableCell>
                              <TableCell sx={{ bgcolor: '#e0e0e0', color: '#424242', textAlign: 'right' }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {files.map(file => (
                              <TableRow key={file.id} hover sx={{ '&:hover': { bgcolor: '#e0e0e0' } }}>
                                <TableCell sx={{ color: '#424242' }}>{file.name}</TableCell>
                                <TableCell sx={{ color: '#424242' }}>{file.is_folder ? 'Folder' : 'File'}</TableCell>
                                <TableCell sx={{ color: '#424242' }}>{file.access_level}</TableCell>
                                <TableCell sx={{ color: '#424242', textAlign: 'right' }}>
                                  <IconButton color="primary" onClick={() => openEditFileModal(file)} size="small" aria-label="edit file">
                                    <Edit />
                                  </IconButton>
                                  <IconButton color="error" onClick={() => handleDeleteFile(file)} size="small" aria-label="delete file">
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Button variant="contained" color="primary" onClick={() => openAddFileModal(department)} sx={{ mt: 2 }}>
                        Add Resource
                      </Button>
                    </Box>
                  ))
                )}
              </Box>
            </Stack>
          )}

          {/* User Modal */}
          <Dialog open={userModalOpen} onClose={closeUserModal} maxWidth="sm" fullWidth>
            <DialogTitle>{userModalMode === 'add' ? 'Add New User' : `Edit User: ${editingUser?.email}`}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} mt={1}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={userFormData.email}
                  onChange={handleUserInputChange}
                  required
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                />
                <TextField
                  label="Full Name"
                  name="full_name"
                  fullWidth
                  value={userFormData.full_name}
                  onChange={handleUserInputChange}
                  required
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                />
                <Select
                  label="Department"
                  name="department"
                  value={userFormData.department}
                  onChange={handleUserInputChange as (e: SelectChangeEvent<string>) => void}
                  fullWidth
                  required
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                >
                  <MenuItem value="">Select Department</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
                <Select
                  label="Group"
                  name="group"
                  value={userFormData.group}
                  onChange={handleUserInputChange as (e: SelectChangeEvent<string>) => void}
                  fullWidth
                  required
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                >
                  <MenuItem value="">Select Group</MenuItem>
                  <MenuItem value="intern">Intern</MenuItem>
                  <MenuItem value="Regular Staff">Regular Staff</MenuItem>
                  <MenuItem value="Department Leads">Department Leads</MenuItem>
                  <MenuItem value="Managers">Managers</MenuItem>
                </Select>
                {userModalMode === 'edit' && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
                    Leave password blank if you don't want to change it
                  </Typography>
                )}
                <TextField
                  label={userModalMode === 'add' ? 'Password' : 'New Password'}
                  name="password"
                  type="password"
                  fullWidth
                  value={userFormData.password}
                  onChange={handleUserInputChange}
                  required={userModalMode === 'add'}
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                />
                <FormControlLabel
                  control={<Checkbox checked={userFormData.is_simulated_threat} onChange={handleUserCheckboxChange} name="is_simulated_threat" />}
                  label="Simulate Insider Threat"
                  sx={{ color: '#424242' }}
                />
              </Stack>
              {usersError && <Typography color="error" mt={2} variant="body2">{usersError}</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeUserModal} disabled={saving} sx={{ color: '#424242' }}>
                Cancel
              </Button>
              <Button onClick={handleSaveUser} variant="contained" color="primary" disabled={saving}>
                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* File Modal */}
          <Dialog open={fileModalOpen} onClose={closeFileModal} maxWidth="sm" fullWidth>
            <DialogTitle>{fileModalMode === 'add' ? 'Add New Resource' : `Edit Resource: ${editingResource?.name}`}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} mt={1}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={fileFormData.name}
                  onChange={handleFileInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                  required
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                />
                <TextField
                  label="Department"
                  name="department"
                  fullWidth
                  value={fileFormData.department}
                  disabled
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                />
                <Select
                  label="Access Level"
                  name="access_level"
                  value={fileFormData.access_level}
                  onChange={handleFileInputChange as (e: SelectChangeEvent<string>) => void}
                  fullWidth
                  required
                  sx={{ color: '#424242', '.MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' } }}
                >
                  <MenuItem value="">Select Access Level</MenuItem>
                  <MenuItem value="read">Read</MenuItem>
                  <MenuItem value="write">Write</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
                <FormControlLabel
                  control={<Checkbox checked={fileFormData.is_folder} onChange={handleFileCheckboxChange} name="is_folder" />}
                  label="Is Folder"
                  sx={{ color: '#424242' }}
                />
              </Stack>
              {filesError && <Typography color="error" mt={2} variant="body2">{filesError}</Typography>}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeFileModal} disabled={saving} sx={{ color: '#424242' }}>
                Cancel
              </Button>
              <Button onClick={fileModalMode === 'add' ? handleAddFile : handleUpdateFile} variant="contained" color="primary" disabled={saving}>
                {saving ? <CircularProgress size={20} color="inherit" /> : fileModalMode === 'add' ? 'Add' : 'Save'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <FooterSection />
    </Box>
  );
}