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
  Chip,
  ListItem,
  Select,
  MenuItem,
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

async function makeRequest(url: string, options: RequestInit = {}) {
  await fetch(`${API_BASE}/api/csrf/`, {
    credentials: 'include',
  });

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    headers.set('X-CSRFToken', csrfToken);
  }
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export default function AccessControlPage() {
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
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
          <Typography variant="h4" mb={2}>
            Access Control
          </Typography>

          {/* Users Section */}
          <Typography variant="h5" mb={2}>
            Users
          </Typography>
          {usersLoading ? (
            <CircularProgress />
          ) : usersError ? (
            <Typography color="error">{usersError}</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Group</TableCell>
                    <TableCell>Simulated Threat</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.department || '-'}</TableCell>
                      <TableCell>{user.group || '-'}</TableCell>
                      <TableCell>{user.is_simulated_threat ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => openUserEditModal(user)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteUser(user)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Button variant="contained" onClick={openUserAddModal} sx={{ mb: 4 }}>
            Add User
          </Button>

          {/* Files Section */}
          <Typography variant="h5" mb={2}>
            Files
          </Typography>
          {filesLoading ? (
            <CircularProgress />
          ) : filesError ? (
            <Typography color="error">{filesError}</Typography>
          ) : (
            Object.entries(resourcesByDepartment).map(([department, files]) => (
              <Box key={department} mb={4}>
                <Typography variant="h6" mb={1}>
                  Department: {department}
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Access Level</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {files.map(file => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{file.is_folder ? 'Folder' : 'File'}</TableCell>
                          <TableCell>{file.access_level}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => openEditFileModal(file)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteFile(file)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button variant="contained" onClick={() => openAddFileModal(department)} sx={{ mt: 2 }}>
                  Add Resource
                </Button>
              </Box>
            ))
          )}

          {/* User Modal */}
          <Dialog open={userModalOpen} onClose={closeUserModal} maxWidth="sm" fullWidth>
            <DialogTitle>{userModalMode === 'add' ? 'Add New User' : `Edit User: ${editingUser?.email}`}</DialogTitle>
            <DialogContent>
              {/* ... (same as provided) */}
            </DialogContent>
            <DialogActions>
              {/* ... (same as provided) */}
            </DialogActions>
          </Dialog>

          {/* File Modal */}
          <Dialog open={fileModalOpen} onClose={closeFileModal} maxWidth="sm" fullWidth>
            <DialogTitle>{fileModalMode === 'add' ? 'Add New Resource' : `Edit Resource: ${editingResource?.name}`}</DialogTitle>
            <DialogContent>
              {/* ... (same as provided) */}
            </DialogContent>
            <DialogActions>
              {/* ... (same as provided) */}
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <FooterSection />
    </Box>
  );
}