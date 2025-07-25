'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const TopNavBar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={8}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* Left Side (Logo/Menu) */}
        <Box display="flex" alignItems="center">
          <IconButton edge="start" sx={{ color: '#00e5ff', mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', color: '#ffffff' }}
          >
            InsiderDash
          </Typography>
        </Box>

        {/* Right Side (Nav links) */}
        <Box display="flex" gap={2}>
          <Button
            variant="text"
            sx={{
              color: '#ffffff',
              '&:hover': {
                color: '#00e5ff',
              },
            }}
            href="/login"
          >
            Login
          </Button>
          <Button
            variant="text"
            sx={{
              color: '#ffffff',
              '&:hover': {
                color: '#00e5ff',
              },
            }}
            href="#"
          >
            Docs
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
