'use client';

import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AboutSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203A43 100%)',
        py: 6,
        px: { xs: 2, md: 4 },
        color: '#fff',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      id="about"
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 700,
          mb: 4,
          fontSize: { xs: '2rem', md: '2.5rem' },
          letterSpacing: '0.1rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        About InsiderDash
      </Typography>

      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          maxWidth: '900px',
          mx: 'auto',
          mb: 6,
          color: '#d3d3d3',
          fontSize: { xs: '1rem', md: '1.1rem' },
          lineHeight: 1.6,
          padding: { xs: 1, md: 0 },
        }}
      >
        InsiderDash is a cutting-edge dashboard designed to help organizations identify, monitor, and mitigate insider threats. Our tool delivers real-time insights and visualizations, enhancing the detection of suspicious activity within a secure, user-friendly interface.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          justifyItems: 'center',
          maxWidth: '1200px',
          mx: 'auto',
          padding: { xs: 2, md: 0 },
        }}
      >
        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            p: 3,
            textAlign: 'center',
            color: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
            maxWidth: '100%',
            width: '300px',
          }}
        >
          <ShieldIcon sx={{ fontSize: 60, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Secure Architecture
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ lineHeight: 1.5 }}>
            Built with security-first principles using modern frameworks like Django and Next.js.
          </Typography>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            p: 3,
            textAlign: 'center',
            color: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
            maxWidth: '100%',
            width: '300px',
          }}
        >
          <AnalyticsIcon sx={{ fontSize: 60, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Real-Time Analytics
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ lineHeight: 1.5 }}>
            Visualize user activities and threats in real time through interactive dashboards.
          </Typography>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            p: 3,
            textAlign: 'center',
            color: '#fff',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            },
            maxWidth: '100%',
            width: '300px',
          }}
        >
          <VisibilityIcon sx={{ fontSize: 60, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Intelligent Monitoring
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ lineHeight: 1.5 }}>
            AI-powered surveillance to proactively detect insider threats before they escalate.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default AboutSection;