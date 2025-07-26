'use client';

import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const pages = ['Home', 'About', 'Statistics', 'System Admin', 'Employee'];

const TopNavBar = () => {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'Home':
        router.push('/');
        break;
      case 'About':
        router.push('/#about'); // section in landing page
        break;
      case 'Statistics':
        router.push('/#statistics'); // section in landing page
        break;
      case 'System Admin':
        router.push('/login'); // login page
        break;
      case 'Employee':
        router.push('/employee'); // you can implement this route later
        break;
      default:
        break;
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          InsiderDash
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {pages.map((page) => (
            <Button
              key={page}
              onClick={() => handleNavigate(page)}
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                '&:hover': {
                  color: '#00e5ff',
                  textShadow: '0 0 5px rgba(0, 229, 255, 0.5)',
                },
              }}
            >
              {page}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;
