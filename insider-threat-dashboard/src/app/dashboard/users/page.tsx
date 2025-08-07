'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface User {
  id: number;
  employee: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  department: string;
  role: string;
  group: number | null;
}

const AUTH_TOKEN = '4f08a3b4c6fd546de78b38f5fcbf51d7089e2e18'; // Replace with your actual Token

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f9fafb)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: '#4b5563',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '12px 24px',
    color: '#4b5563',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor: '#f0f9ff',
    },
  },
  '& .MuiTabs-indicator': {
    height: '4px',
    borderRadius: '4px 4px 0 0',
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: '#1f2937',
  borderBottom: `1px solid #e5e7eb`,
  padding: '12px',
}));

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    password: '',
    group: '',
  });

  const [editUser, setEditUser] = useState({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    role: '',
    group: '',
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/employees/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        `${user.employee.first_name} ${user.employee.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleOpenDetails = (user: User, mode: 'view' | 'edit' | 'delete') => {
    setSelectedUser(user);
    setDialogMode(mode);
    if (mode === 'edit') {
      setEditUser({
        id: user.id,
        first_name: user.employee.first_name,
        last_name: user.employee.last_name,
        email: user.employee.email,
        department: user.department,
        role: user.role,
        group: user.group ? user.group.toString() : '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setDialogMode('view');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      const nameParts = newUser.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        employee: {
          username: newUser.name.replace(/\s+/g, '').toLowerCase(),
          email: newUser.email,
          password: newUser.password,
          first_name: firstName,
          last_name: lastName,
        },
        department: newUser.department,
        role: newUser.role,
        group: newUser.group ? Number(newUser.group) : null,
      };
      const response = await fetch('http://127.0.0.1:8000/api/employees/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Failed to create employee');
      }

      alert('User successfully added!');
      setNewUser({
        name: '',
        email: '',
        department: '',
        role: '',
        password: '',
        group: '',
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error adding user');
    }
  };

  const handleEditUser = async () => {
    try {
      const payload = {
        employee: {
          username: `${editUser.first_name}${editUser.last_name}`.replace(/\s+/g, '').toLowerCase(),
          email: editUser.email,
          first_name: editUser.first_name,
          last_name: editUser.last_name,
        },
        department: editUser.department,
        role: editUser.role,
        group: editUser.group ? Number(editUser.group) : null,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/employees/${editUser.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Failed to update employee');
      }

      alert('User successfully updated!');
      handleCloseDialog();
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error updating user');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/employees/${selectedUser?.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      alert('User successfully deleted!');
      handleCloseDialog();
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" ml={3} color="text.secondary">Loading users...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f3f4f6' }}>
        <Typography variant="h6" color="error.main">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f3f4f6', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>Insentinel.com</Typography>
        <StyledButton variant="contained" color="primary">Log Out</StyledButton>
      </Box>

      <StyledPaper sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
        <StyledTabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Add New User" />
          <Tab label="View Users" />
        </StyledTabs>

        {/* Tab Panel: Add New User */}
        {tabValue === 0 && (
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>Add New User</Typography>
            <Box sx={{ display: 'grid', gap: 2, maxWidth: 600 }}>
              <StyledTextField
                fullWidth
                label="Full Name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={newUser.email}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Department"
                name="department"
                select
                value={newUser.department}
                onChange={handleInputChange}
                variant="outlined"
              >
                <MenuItem value="finance_department">Finance</MenuItem>
                <MenuItem value="operations_department">Operations</MenuItem>
                <MenuItem value="it_department">IT</MenuItem>
              </StyledTextField>
              <StyledTextField
                fullWidth
                label="Role"
                name="role"
                select
                value={newUser.role}
                onChange={handleInputChange}
                variant="outlined"
              >
                <MenuItem value="auditor">Auditor</MenuItem>
                <MenuItem value="operations_manager">Operations Manager</MenuItem>
                <MenuItem value="security_officer">Security Officer</MenuItem>
              </StyledTextField>
              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                label="Group ID (optional)"
                name="group"
                value={newUser.group}
                onChange={handleInputChange}
                variant="outlined"
              />
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleAddUser}
                sx={{ mt: 2, bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
              >
                Add User
              </StyledButton>
            </Box>
          </Box>
        )}

        {/* Tab Panel: View Users */}
        {tabValue === 1 && (
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>Registered Users</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <StyledTextField
                label="Search Users"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, email, department, or role"
                sx={{ width: '300px' }}
                variant="outlined"
              />
            </Box>
            <TableContainer component={StyledPaper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Department</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ '&:hover': { backgroundColor: '#f0f9ff' } }}
                    >
                      <StyledTableCell>
                        {user.employee.first_name} {user.employee.last_name}
                      </StyledTableCell>
                      <StyledTableCell>{user.employee.email}</StyledTableCell>
                      <StyledTableCell>{user.department}</StyledTableCell>
                      <StyledTableCell>{user.role}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          onClick={() => handleOpenDetails(user, 'edit')}
                          sx={{ color: '#2563eb', mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenDetails(user, 'delete')}
                          sx={{ color: '#dc2626' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Dialog for View/Edit/Delete */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1f2937' }}>
            {dialogMode === 'view' && 'User Details'}
            {dialogMode === 'edit' && 'Edit User'}
            {dialogMode === 'delete' && 'Delete User'}
          </DialogTitle>
          <DialogContent>
            {selectedUser && dialogMode === 'view' && (
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Typography sx={{ color: '#1f2937' }}>
                  <strong>Name:</strong> {selectedUser.employee.first_name} {selectedUser.employee.last_name}
                </Typography>
                <Typography sx={{ color: '#1f2937' }}>
                  <strong>Email:</strong> {selectedUser.employee.email}
                </Typography>
                <Typography sx={{ color: '#1f2937' }}>
                  <strong>Department:</strong> {selectedUser.department}
                </Typography>
                <Typography sx={{ color: '#1f2937' }}>
                  <strong>Role:</strong> {selectedUser.role}
                </Typography>
              </Box>
            )}
            {dialogMode === 'edit' && (
              <Box sx={{ display: 'grid', gap: 2 }}>
                <StyledTextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={editUser.first_name}
                  onChange={handleEditInputChange}
                  variant="outlined"
                />
                <StyledTextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={editUser.last_name}
                  onChange={handleEditInputChange}
                  variant="outlined"
                />
                <StyledTextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editUser.email}
                  onChange={handleEditInputChange}
                  variant="outlined"
                />
                <StyledTextField
                  fullWidth
                  label="Department"
                  name="department"
                  select
                  value={editUser.department}
                  onChange={handleEditInputChange}
                  variant="outlined"
                >
                  <MenuItem value="finance_department">Finance</MenuItem>
                  <MenuItem value="operations_department">Operations</MenuItem>
                  <MenuItem value="it_department">IT</MenuItem>
                </StyledTextField>
                <StyledTextField
                  fullWidth
                  label="Role"
                  name="role"
                  select
                  value={editUser.role}
                  onChange={handleEditInputChange}
                  variant="outlined"
                >
                  <MenuItem value="auditor">Auditor</MenuItem>
                  <MenuItem value="operations_manager">Operations Manager</MenuItem>
                  <MenuItem value="security_officer">Security Officer</MenuItem>
                </StyledTextField>
                <StyledTextField
                  fullWidth
                  label="Group ID (optional)"
                  name="group"
                  value={editUser.group}
                  onChange={handleEditInputChange}
                  variant="outlined"
                />
              </Box>
            )}
            {dialogMode === 'delete' && (
              <Typography sx={{ color: '#1f2937' }}>
                Are you sure you want to delete <strong>{selectedUser?.employee.first_name} {selectedUser?.employee.last_name}</strong>?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            {dialogMode === 'view' && (
              <StyledButton onClick={handleCloseDialog} sx={{ color: '#2563eb' }}>Close</StyledButton>
            )}
            {dialogMode === 'edit' && (
              <>
                <StyledButton onClick={handleCloseDialog} sx={{ color: '#2563eb' }}>Cancel</StyledButton>
                <StyledButton
                  onClick={handleEditUser}
                  variant="contained"
                  sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}
                >
                  Save
                </StyledButton>
              </>
            )}
            {dialogMode === 'delete' && (
              <>
                <StyledButton onClick={handleCloseDialog} sx={{ color: '#2563eb' }}>Cancel</StyledButton>
                <StyledButton
                  onClick={handleDeleteUser}
                  variant="contained"
                  sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
                >
                  Delete
                </StyledButton>
              </>
            )}
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </Box>
  );
}