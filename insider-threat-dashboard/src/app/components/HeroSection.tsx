'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        background: '#0f2027',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/images/insider1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.85,
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Insider Threat Monitoring Dashboard
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, fontStyle: 'italic', maxWidth: '600px' }}>
          Enhance your organization’s cybersecurity by detecting, analyzing, and preventing internal threats in real-time.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00bcd4',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#0097a7',
            },
            padding: '10px 24px',
            borderRadius: '30px',
            fontWeight: 'bold',
          }}
          href="/login"
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
