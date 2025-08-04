'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  Divider,
  Button,
  MenuItem,
  Paper,
  Avatar,
  Chip,
  Select,
  FormControl,
  InputLabel,
  Container,
  Stack,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import Sidebar from '../components/SideBar';

const mockUsers = [
  'Aaron Bennett',
  'Abbey Christy',
  'Alli Connors',
  'Alex Nelson',
  'Aron Benet',
  'Trevor Hansen',
];

const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState<'Users' | 'Groups'>('Users');
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['Aron Benet', 'Trevor Hansen']);
  const [searchText, setSearchText] = useState('');
  const [newUserAttr, setNewUserAttr] = useState('');
  const [settingOption, setSettingOption] = useState('');
  const [policyOption, setPolicyOption] = useState('');

  const toggleUser = (name: string) => {
    setSelectedUsers((prev) =>
      prev.includes(name) ? prev.filter((u) => u !== name) : [...prev, name]
    );
  };

  const filteredUsers = mockUsers.filter((user) =>
    user.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0a101f, #1a2a3c)', minHeight: '100vh' }}>
      <TopNavBar />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <Sidebar />
        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 12, md: 14 }, // Increased padding-top to avoid overlap with TopNavBar
            pb: 6,
            ml: { xs: 0, md: '240px' }, // Offset for Sidebar width
            flexGrow: 1,
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
            User Management
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              flexGrow: 1,
            }}
          >
            {/* Left Panel - User/Group Selection */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                width: { xs: '100%', md: '30%' },
                minWidth: { md: 300 },
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)',
                height: 'fit-content',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                Select Users or Groups
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Checkbox
                  checked={selectedTab === 'Groups'}
                  onChange={() => setSelectedTab('Groups')}
                  sx={{ color: '#00bcd4', '&.Mui-checked': { color: '#00bcd4' } }}
                />
                <Typography sx={{ color: '#fff' }}>Groups</Typography>
                <Checkbox
                  checked={selectedTab === 'Users'}
                  onChange={() => setSelectedTab('Users')}
                  sx={{ color: '#00bcd4', '&.Mui-checked': { color: '#00bcd4' } }}
                />
                <Typography sx={{ color: '#fff' }}>Users</Typography>
              </Stack>
              <Divider sx={{ my: 2, background: 'rgba(255,255,255,0.2)' }} />
              <TextField
                variant="outlined"
                placeholder="Search users"
                size="small"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover fieldset': { borderColor: '#00bcd4' },
                    '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                  },
                  '& .MuiInputBase-input': { color: '#fff' },
                }}
                InputProps={{
                  startAdornment: <Search fontSize="small" sx={{ mr: 1, color: '#fff' }} />,
                  endAdornment: searchText && (
                    <IconButton size="small" onClick={() => setSearchText('')}>
                      <Close fontSize="small" sx={{ color: '#fff' }} />
                    </IconButton>
                  ),
                }}
              />
              <Box sx={{ maxHeight: 300, overflow: 'auto', mt: 2 }}>
                {filteredUsers.map((user) => (
                  <Box
                    key={user}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      background: selectedUsers.includes(user)
                        ? 'rgba(0,188,212,0.2)'
                        : 'transparent',
                      '&:hover': {
                        background: selectedUsers.includes(user)
                          ? 'rgba(0,188,212,0.3)'
                          : 'rgba(255,255,255,0.05)',
                      },
                    }}
                    onClick={() => toggleUser(user)}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: '#00bcd4' }}>{user[0]}</Avatar>
                    <Typography sx={{ color: '#fff' }}>{user}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Right Panel - Settings and Add User */}
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                minWidth: 0, // Prevent overflow
              }}
            >
              {/* Update Settings */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: '100%',
                }}
              >
                <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                  Update User Settings
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Choose Setting
                  </InputLabel>
                  <Select
                    value={settingOption}
                    onChange={(e) => setSettingOption(e.target.value)}
                    label="Choose Setting"
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00bcd4',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00bcd4',
                      },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                  >
                    <MenuItem value="Theme">Light/Dark Mode</MenuItem>
                    <MenuItem value="2FA">2-Factor Authentication</MenuItem>
                    <MenuItem value="Notification">Email Notifications</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Change Chosen Setting"
                  variant="outlined"
                  sx={{
                    mb: 3,
                    background: 'rgba(255,255,255,0.05)',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00bcd4' },
                      '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                    },
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Choose Policy
                  </InputLabel>
                  <Select
                    value={policyOption}
                    onChange={(e) => setPolicyOption(e.target.value)}
                    label="Choose Policy"
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00bcd4',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00bcd4',
                      },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                  >
                    <MenuItem value="RBAC">RBAC</MenuItem>
                    <MenuItem value="Strict">Strict Policy</MenuItem>
                    <MenuItem value="Relaxed">Relaxed Policy</MenuItem>
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                  {selectedUsers.map((user) => (
                    <Chip
                      key={user}
                      label={user}
                      onDelete={() => toggleUser(user)}
                      sx={{
                        backgroundColor: '#00bcd4',
                        color: '#fff',
                        '& .MuiChip-deleteIcon': { color: '#fff' },
                      }}
                    />
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                  }}
                >
                  Apply Settings
                </Button>
              </Paper>

              {/* Add User */}
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: '100%',
                }}
              >
                <Typography variant="h5" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                  Add User
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { borderColor: '#00bcd4', background: 'rgba(0,188,212,0.1)' },
                    }}
                  >
                    Use CMS
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,0.2)',
                      '&:hover': { borderColor: '#00bcd4', background: 'rgba(0,188,212,0.1)' },
                    }}
                  >
                    Add Users Manually
                  </Button>
                </Stack>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel sx={{ color: '#fff', '&.Mui-focused': { color: '#00bcd4' } }}>
                    Choose Attribute
                  </InputLabel>
                  <Select
                    value={newUserAttr}
                    onChange={(e) => setNewUserAttr(e.target.value)}
                    label="Choose Attribute"
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00bcd4',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00bcd4',
                      },
                      '& .MuiSvgIcon-root': { color: '#fff' },
                    }}
                  >
                    <MenuItem value="Intern">Intern</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Administrator">Administrator</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Add Chosen Attribute"
                  variant="outlined"
                  sx={{
                    mb: 3,
                    background: 'rgba(255,255,255,0.05)',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&:hover fieldset': { borderColor: '#00bcd4' },
                      '&.Mui-focused fieldset': { borderColor: '#00bcd4' },
                    },
                    '& .MuiInputLabel-root': { color: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(90deg, #00bcd4, #4fc3f7)',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: 1,
                    '&:hover': { background: 'linear-gradient(90deg, #0288d1, #0288d1)' },
                  }}
                >
                  Add User
                </Button>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
      <FooterSection />
    </Box>
  );
};

export default UserManagement;