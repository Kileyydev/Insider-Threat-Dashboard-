'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  Button,
  Stack,
  Container,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { Search, Close, Delete, Edit } from '@mui/icons-material';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import Sidebar from '../components/SideBar';

type User = {
  name: string;
  role: string;
  policy: string;
  groups: string[];
};

type Group = {
  name: string;
  role: string;
  policy: string;
  permissions: string[];
};

const initialUsers: User[] = [
  { name: 'Aaron Bennett', role: 'Viewer', policy: 'Relaxed', groups: ['Finance Admins'] },
  { name: 'Abbey Christy', role: 'Admin', policy: 'Strict', groups: ['Security Leads'] },
  { name: 'Alex Nelson', role: 'Editor', policy: 'RBAC', groups: ['HR Reviewers'] },
];

const initialGroups: Group[] = [
  { name: 'Finance Admins', role: 'Editor', policy: 'Strict', permissions: ['view_finances', 'edit_finances'] },
  { name: 'Security Leads', role: 'Admin', policy: 'Strict', permissions: ['manage_users', 'view_logs'] },
  { name: 'HR Reviewers', role: 'Viewer', policy: 'Relaxed', permissions: ['view_hr_records'] },
];

const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState<'Users' | 'Groups'>('Users');
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'group'; name: string } | null>(null);
  const [newUserData, setNewUserData] = useState<Partial<User>>({ groups: [] });
  const [newGroupData, setNewGroupData] = useState<Partial<Group>>({ permissions: [] });
  const [error, setError] = useState<string>('');

  const handleUserSave = () => {
    if (!newUserData.name || !newUserData.role || !newUserData.policy || !newUserData.groups?.length) {
      setError('All fields are required.');
      return;
    }
    setUsers((prev) => {
      const existing = prev.find((u) => u.name === newUserData.name);
      if (existing) {
        return prev.map((u) => (u.name === newUserData.name ? (newUserData as User) : u));
      } else {
        return [...prev, newUserData as User];
      }
    });
    setNewUserData({ groups: [] });
    setOpenUserDialog(false);
    setError('');
  };

  const handleGroupSave = () => {
    if (!newGroupData.name || !newGroupData.role || !newGroupData.policy || !newGroupData.permissions?.length) {
      setError('All fields are required.');
      return;
    }
    setGroups((prev) => {
      const existing = prev.find((g) => g.name === newGroupData.name);
      if (existing) {
        return prev.map((g) => (g.name === newGroupData.name ? (newGroupData as Group) : g));
      } else {
        return [...prev, newGroupData as Group];
      }
    });
    setNewGroupData({ permissions: [] });
    setOpenGroupDialog(false);
    setError('');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'user') {
      setUsers((prev) => prev.filter((u) => u.name !== deleteTarget.name));
      if (selectedUser?.name === deleteTarget.name) setSelectedUser(null);
    } else {
      setGroups((prev) => prev.filter((g) => g.name !== deleteTarget.name));
      setUsers((prev) => prev.map((u) => ({ ...u, groups: u.groups.filter((g) => g !== deleteTarget.name) })));
      if (selectedGroup?.name === deleteTarget.name) setSelectedGroup(null);
    }
    setOpenDeleteDialog(false);
    setDeleteTarget(null);
  };

  const filteredList =
    selectedTab === 'Users'
      ? users.filter((u) => u.name.toLowerCase().includes(searchText.toLowerCase()))
      : groups.filter((g) => g.name.toLowerCase().includes(searchText.toLowerCase()));

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
            User & Group Management
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, flexGrow: 1 }}>
            {/* Left Panel: Tabs + Filter */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: { xs: '100%', md: '30%' },
                minWidth: { md: 300 },
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                height: 'fit-content',
              }}
            >
              <ToggleButtonGroup
                value={selectedTab}
                exclusive
                fullWidth
                onChange={(_, val) => val && setSelectedTab(val)}
                sx={{
                  mb: 2,
                  '& .MuiToggleButton-root': {
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.2)',
                    '&.Mui-selected': {
                      background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                      color: '#000',
                    },
                    '&:hover': { background: 'rgba(0,188,212,0.2)' },
                  },
                }}
              >
                <ToggleButton value="Users">Users</ToggleButton>
                <ToggleButton value="Groups">Groups</ToggleButton>
              </ToggleButtonGroup>

              <TextField
                fullWidth
                size="small"
                placeholder={`Search ${selectedTab}`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: '#fff' }} />,
                  endAdornment: searchText && (
                    <IconButton onClick={() => setSearchText('')}>
                      <Close sx={{ color: '#fff' }} />
                    </IconButton>
                  ),
                }}
                sx={{
                  mb: 2,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#00bcd4' },
                    '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                  },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
              />

              <Divider sx={{ mb: 2, background: 'rgba(255,255,255,0.2)' }} />

              <Stack spacing={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
                {filteredList.map((item) => (
                  <Paper
                    key={selectedTab === 'Users' ? (item as User).name : (item as Group).name}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 1,
                      '&:hover': { background: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    <Box
                      onClick={() => {
                        selectedTab === 'Users'
                          ? setSelectedUser(item as User)
                          : setSelectedGroup(item as Group);
                      }}
                      sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexGrow: 1 }}
                    >
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: '#00bcd4',
                          width: 32,
                          height: 32,
                          fontSize: '0.9rem',
                        }}
                      >
                        {selectedTab === 'Users'
                          ? (item as User).name[0]
                          : (item as Group).name[0]}
                      </Avatar>
                      <Typography sx={{ color: '#fff' }}>
                        {selectedTab === 'Users' ? (item as User).name : (item as Group).name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            if (selectedTab === 'Users') {
                              setNewUserData(item as User);
                              setOpenUserDialog(true);
                            } else {
                              setNewGroupData(item as Group);
                              setOpenGroupDialog(true);
                            }
                          }}
                        >
                          <Edit fontSize="small" sx={{ color: '#00bcd4' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            setDeleteTarget({
                              type: selectedTab === 'Users' ? 'user' : 'group',
                              name: selectedTab === 'Users' ? (item as User).name : (item as Group).name,
                            });
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Delete fontSize="small" sx={{ color: '#f44336' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Stack>

              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 1,
                  '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                }}
                onClick={() => {
                  setNewUserData({ groups: [] });
                  setNewGroupData({ permissions: [] });
                  setError('');
                  selectedTab === 'Users' ? setOpenUserDialog(true) : setOpenGroupDialog(true);
                }}
              >
                Add {selectedTab.slice(0, -1)}
              </Button>
            </Paper>

            {/* Right Panel: Details */}
            <Paper
              elevation={3}
              sx={{
                flexGrow: 1,
                p: 4,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                minWidth: 0,
              }}
            >
              {selectedTab === 'Users' && selectedUser ? (
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    User Details
                  </Typography>
                  <TableContainer>
                    <Table sx={{ minWidth: 300, color: '#fff' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Field</TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{selectedUser.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Role</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{selectedUser.role}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Policy</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{selectedUser.policy}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Groups</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {selectedUser.groups.join(', ') || 'None'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              ) : selectedTab === 'Groups' && selectedGroup ? (
                <Stack spacing={2}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Group Details
                  </Typography>
                  <TableContainer>
                    <Table sx={{ minWidth: 300, color: '#fff' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Field</TableCell>
                          <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{selectedGroup.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Role</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{selectedGroup.role}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Policy</TableCell>
                          <TableCell sx={{ color: '#fff' }}>{selectedGroup.policy}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Permissions</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {selectedGroup.permissions.join(', ') || 'None'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ color: '#fff' }}>Users</TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {users
                              .filter((u) => u.groups.includes(selectedGroup.name))
                              .map((u) => u.name)
                              .join(', ') || 'None'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              ) : (
                <Typography>Select a {selectedTab.slice(0, -1).toLowerCase()} to view details.</Typography>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Add/Edit User Dialog */}
      <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
          {newUserData.name ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={newUserData.name || ''}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#00bcd4' },
                '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
              },
              '& .MuiInputLabel-root': { color: '#fff' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
              Role
            </InputLabel>
            <Select
              value={newUserData.role || ''}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
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
              <MenuItem value="Viewer">Viewer</MenuItem>
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
              Policy
            </InputLabel>
            <Select
              value={newUserData.policy || ''}
              onChange={(e) => setNewUserData({ ...newUserData, policy: e.target.value })}
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
              <MenuItem value="Relaxed">Relaxed</MenuItem>
              <MenuItem value="Strict">Strict</MenuItem>
              <MenuItem value="RBAC">RBAC</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
              Groups
            </InputLabel>
            <Select
              multiple
              value={newUserData.groups || []}
              onChange={(e) => setNewUserData({ ...newUserData, groups: e.target.value as string[] })}
              renderValue={(selected) => (selected as string[]).join(', ')}
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
              {groups.map((g) => (
                <MenuItem key={g.name} value={g.name}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
          <Button
            onClick={() => {
              setOpenUserDialog(false);
              setError('');
            }}
            sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUserSave}
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

      {/* Add/Edit Group Dialog */}
      <Dialog open={openGroupDialog} onClose={() => setOpenGroupDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
          {newGroupData.name ? 'Edit Group' : 'Add Group'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Group Name"
            value={newGroupData.name || ''}
            onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: '#00bcd4' },
                '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
              },
              '& .MuiInputLabel-root': { color: '#fff' },
              '& .MuiInputBase-input': { color: '#fff' },
            }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
              Role
            </InputLabel>
            <Select
              value={newGroupData.role || ''}
              onChange={(e) => setNewGroupData({ ...newGroupData, role: e.target.value })}
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
              <MenuItem value="Viewer">Viewer</MenuItem>
              <MenuItem value="Editor">Editor</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
              Policy
            </InputLabel>
            <Select
              value={newGroupData.policy || ''}
              onChange={(e) => setNewGroupData({ ...newGroupData, policy: e.target.value })}
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
              <MenuItem value="Relaxed">Relaxed</MenuItem>
              <MenuItem value="Strict">Strict</MenuItem>
              <MenuItem value="RBAC">RBAC</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
              Permissions
            </InputLabel>
            <Select
              multiple
              value={newGroupData.permissions || []}
              onChange={(e) => setNewGroupData({ ...newGroupData, permissions: e.target.value as string[] })}
              renderValue={(selected) => (selected as string[]).join(', ')}
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
              <MenuItem value="view_finances">View Finances</MenuItem>
              <MenuItem value="edit_finances">Edit Finances</MenuItem>
              <MenuItem value="manage_users">Manage Users</MenuItem>
              <MenuItem value="view_logs">View Logs</MenuItem>
              <MenuItem value="view_hr_records">View HR Records</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
          <Button
            onClick={() => {
              setOpenGroupDialog(false);
              setError('');
            }}
            sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGroupSave}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(0,188,212,0.1)', color: '#fff' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#fff' }}>
          <Typography>
            Are you sure you want to delete this {deleteTarget?.type} "{deleteTarget?.name}"?
            {deleteTarget?.type === 'group' && ' This will remove the group from all associated users.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(0,188,212,0.1)' }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
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

      <FooterSection />
    </Box>
  );
};

export default UserManagement;