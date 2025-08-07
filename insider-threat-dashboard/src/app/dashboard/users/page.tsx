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
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    password: '',
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
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDetails = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
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
      const token = localStorage.getItem("authToken");
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
            <Box sx={{ display: 'grid', gap: 3 }}>
              {users.map((user) => (
                <StyledPaper key={user.id} sx={{ p: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {user.employee.first_name} {user.employee.last_name}
                  </Typography>
                  <Typography sx={{ color: '#4b5563', mt: 1 }}>Email: {user.employee.email}</Typography>
                  <Typography sx={{ color: '#4b5563' }}>Department: {user.department}</Typography>
                  <Typography sx={{ color: '#4b5563' }}>Role: {user.role}</Typography>
                  <Divider sx={{ my: 2, bgcolor: '#e5e7eb' }} />
                  <StyledButton
                    variant="outlined"
                    onClick={() => handleOpenDetails(user)}
                    sx={{ borderColor: '#2563eb', color: '#2563eb', '&:hover': { borderColor: '#1d4ed8', color: '#1d4ed8' } }}
                  >
                    View Details
                  </StyledButton>
                </StyledPaper>
              ))}
            </Box>
          </Box>
        )}

        {/* User Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: '12px', p: 2 } }}>
          <DialogTitle sx={{ fontWeight: 600, color: '#1f2937' }}>User Details</DialogTitle>
          <DialogContent>
            {selectedUser && (
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
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleCloseDialog} sx={{ color: '#2563eb' }}>Close</StyledButton>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </Box>
  );
}