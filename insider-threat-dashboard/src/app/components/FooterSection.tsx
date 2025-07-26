'use client';

import React from 'react';
import { Box, Container, Divider, Typography, Link } from '@mui/material';

const FooterSection = () => {
  return (
    <Box
      component="footer"
      sx={{
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)', 
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ccc',
        textAlign: 'center',
        py: 4,
        px: 2,
      }}
    >
        
      <Container maxWidth="md">
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} Insider Threat Dashboard. All rights reserved.
        </Typography>

        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 4,
            fontSize: '0.9rem',
          }}
        >
          <Link href="#" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Terms of Service
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Contact
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default FooterSection;
