
'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Lock as LockIcon } from '@mui/icons-material';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import Sidebar from '../components/SideBar';

interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
}

interface UserForm {
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@company.com',
    department: 'Finance',
    role: 'Manager',
    status: 'Active',
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@company.com',
    department: 'IT',
    role: 'Administrator',
    status: 'Restricted',
  },
];

const departments = ['Finance', 'IT', 'HR', 'Operations'];
const roles = ['Employee', 'Manager', 'Director', 'Administrator'];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<UserForm>({
    name: '',
    email: '',
    department: '',
    role: '',
    status: 'Active',
  });

  // Define custom theme to match original colors
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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            padding: '8px 16px',
            backgroundColor: '#00bcd4',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#0288d1',
            },
            fontSize: '0.9rem',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              color: '#ffffff',
              '& fieldset': {
                borderColor: '#444444',
              },
              '&:hover fieldset': {
                borderColor: '#666666',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#cccccc',
              fontSize: '0.9rem',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#00bcd4',
            },
            '& .MuiInputBase-input': {
              fontSize: '0.9rem',
            },
          },
        },
      },
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
            color: '#cccccc',
            fontWeight: 600,
            background: 'rgba(0, 188, 212, 0.1)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(6px)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#cccccc',
            '&:hover': {
              color: '#00bcd4',
            },
          },
        },
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = () => {
    setOpenDialog(true);
    setForm({ name: '', email: '', department: '', role: '', status: 'Active' });
    setEditIndex(null);
  };

  const handleSaveUser = () => {
    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = { id: users[editIndex].id, ...form };
      setUsers(updatedUsers);
    } else {
      setUsers([...users, { id: Date.now(), ...form }]);
    }
    setOpenDialog(false);
  };

  const handleEdit = (index: number) => {
    setForm({
      name: users[index].name,
      email: users[index].email,
      department: users[index].department,
      role: users[index].role,
      status: users[index].status,
    });
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDelete = (index: number) => {
    const filtered = users.filter((_, i) => i !== index);
    setUsers(filtered);
  };

  const handleRestrict = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].status =
      updatedUsers[index].status === 'Restricted' ? 'Active' : 'Restricted';
    setUsers(updatedUsers);
  };

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
              Users Management
            </Typography>
            <Button
              variant="contained"
              onClick={handleAddUser}
              sx={{ mb: 2, fontSize: '0.9rem' }}
            >
              Add New User
            </Button>
            <Paper sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit User">
                          <IconButton onClick={() => handleEdit(index)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Restrict / Unrestrict">
                          <IconButton onClick={() => handleRestrict(index)}>
                            <LockIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton onClick={() => handleDelete(index)} color="error">
                            <DeleteIcon />
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
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontSize: '1.25rem' }}>
            {editIndex !== null ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 1.5, mt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              fullWidth
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              fullWidth
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveUser}>
              {editIndex !== null ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default UsersPage;
