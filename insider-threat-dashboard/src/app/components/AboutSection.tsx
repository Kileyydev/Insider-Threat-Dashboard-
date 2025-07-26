'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AboutSection = () => {
  return (
    <Box
      sx={{
         background: '#0f2027',
        py: 10,
        px: 4,
        color: '#fff',
      }}
      id="about"
    >
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}
      >
        About InsiderDash
      </Typography>

      <Typography
        variant="h6"
        sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto', mb: 8, color: '#ccc' }}
      >
        InsiderDash is a cutting-edge dashboard built to help organizations identify, monitor, and mitigate insider threats. Our tool provides real-time insights and visualizations that enhance the detection of suspicious activity within a secure and user-friendly interface.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            p: 4,
            textAlign: 'center',
            color: '#fff',
            maxWidth: 300,
          }}
        >
          <ShieldIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Secure Architecture
          </Typography>
          <Typography variant="body2" color="#bbb">
            Built with security-first principles using modern frameworks like Django and Next.js.
          </Typography>
        </Paper>

        <Paper
          elevation={6}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            p: 4,
            textAlign: 'center',
            color: '#fff',
            maxWidth: 300,
          }}
        >
          <AnalyticsIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Real-Time Analytics
          </Typography>
          <Typography variant="body2" color="#bbb">
            Visualize user activities and threats in real time through interactive dashboards.
          </Typography>
        </Paper>

        <Paper
          elevation={6}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            p: 4,
            textAlign: 'center',
            color: '#fff',
            maxWidth: 300,
          }}
        >
          <VisibilityIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold">
            Intelligent Monitoring
          </Typography>
          <Typography variant="body2" color="#bbb">
            AI-powered surveillance to proactively detect insider threats before they escalate.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default AboutSection;
