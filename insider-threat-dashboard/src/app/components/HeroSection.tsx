'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
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
          backgroundImage: 'url("/images/herosection/insiderthreat1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 1,
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
          background: 'rgba(0, 0, 0, 0.2)', // Darker overlay for contrast
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start', // Left alignment
          justifyContent: 'flex-end', // Bottom alignment
          color: '#fff',
          textAlign: 'left',
          px: 2,
          pb: 4, // Padding at the bottom for spacing
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Solid background for text
            padding: 3,
            borderRadius: 10,
            maxWidth: '700px',
          }}
        >
          
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;