'use client';

import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';

const CTASection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #0f2027 100%)',
        py: 6,
        px: { xs: 2, md: 4 },
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '50%',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%230f2027\' fill-opacity=\'0.8\' d=\'M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,149.3C672,139,768,149,864,149.3C960,149,1056,139,1152,133.3C1248,128,1344,128,1392,128L1440,128V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z\'/%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          zIndex: 0,
        },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 2,
          fontSize: { xs: '2rem', md: '2.5rem' },
          letterSpacing: '0.1rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Protect Your Organization Now
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mb: 4,
          maxWidth: '600px',
          mx: 'auto',
          color: '#d3d3d3',
          fontSize: { xs: '1rem', md: '1.1rem' },
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Take the first step to safeguard your data with our insider threat monitoring solution.
      </Typography>
      <Button
        variant="contained"
        href="/signup"
        sx={{
          px: 5,
          py: 2,
          fontWeight: 'bold',
          fontSize: '1.1rem',
          background: 'linear-gradient(45deg, #00bcd4 0%, #00aaff 100%)',
          color: '#fff',
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(45deg, #00aaff 0%, #00bcd4 100%)',
            boxShadow: '0 4px 12px rgba(0, 188, 212, 0.4)',
          },
          position: 'relative',
          zIndex: 1,
        }}
      >
        Start Your Free Trial
      </Button>
    </Box>
  );
};

export default CTASection;