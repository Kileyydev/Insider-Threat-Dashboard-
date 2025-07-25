'use client';

import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import TopNavBar from '@/app/components/topnavbar';

const LandingPage = () => {
  const router = useRouter();

  const handleSelect = (role: string) => {
    if (role === 'admin') {
      router.push('/login'); // ✅ Redirect to LoginForm
    } else {
      alert('Employee dashboard coming soon!');
    }
  };

  return (
    <>
      <TopNavBar />

      <Grid
        container
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 6,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            color: '#fff',
            textAlign: 'center',
            maxWidth: 700,
            width: '100%',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Insider Threat Monitoring System
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            A smart, secure, and intuitive dashboard for detecting and managing
            suspicious activities within your organization. This tool helps
            System Administrators track insider behavior, respond to threats in
            real-time, and maintain the integrity of enterprise assets — all
            through a user-friendly interface.
          </Typography>

          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
            Select your role to continue:
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSelect('admin')}
                sx={{
                  py: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(to right, #00bcd4, #2196f3)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #00acc1, #1976d2)',
                  },
                }}
              >
                System Admin
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleSelect('employee')}
                sx={{
                  py: 2,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderColor: '#00e5ff',
                  color: '#00e5ff',
                  '&:hover': {
                    borderColor: '#00acc1',
                    color: '#00acc1',
                  },
                }}
              >
                Employee
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default LandingPage;
