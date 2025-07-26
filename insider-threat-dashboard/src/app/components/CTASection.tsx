'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const CTASection = () => {
  return (
    <Box
      sx={{
        py: 10,
         background: '#1e1e1e',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Ready to Secure Your Organization?
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Start monitoring insider threats before they happen.
      </Typography>
      <Button
        variant="contained"
        sx={{
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          fontSize: '1rem',
          backgroundColor: '#00bcd4',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#00bcd4',
          },
        }}
      >
        Get Started Now
      </Button>
    </Box>
  );
};

export default CTASection;
