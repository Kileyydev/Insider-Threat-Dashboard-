'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ThreatInsightsSection = () => {
  const theme = useTheme();

  const alerts = [
    'Suspicious login detected at 03:15 PM EAT, IP: 192.168.1.10',
    'Unauthorized data access attempt at 02:50 PM EAT, User: john_doe',
    'Unusual file activity reported at 01:30 PM EAT, Department: IT',
  ];

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f2027 0%, #1a3c50 70%)',
        py: 6,
        px: { xs: 2, md: 4 },
        color: '#fff',
        minHeight: '60vh',
        position: 'relative',
        overflow: 'hidden',
      }}
      id="threat-insights"
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 800,
          mb: 4,
          fontSize: { xs: '2rem', md: '2.5rem' },
          letterSpacing: '0.1rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
        }}
      >
        Threat Insights & Alerts
      </Typography>

      {/* Alert Ticker */}
      <Box
        sx={{
          background: 'rgba(0, 0, 0, 0.7)',
          py: 1.5,
          mb: 4,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'relative',
          '&:hover': { animationPlayState: 'paused' },
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            animation: 'scroll 30s linear infinite',
            '@keyframes scroll': {
              from: { transform: 'translateX(100%)' },
              to: { transform: 'translateX(-100%)' },
            },
          }}
        >
          {alerts.map((alert, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                display: 'inline-block',
                mx: 4,
                color: '#ff4444',
                fontWeight: 500,
                padding: '0 10px',
              }}
            >
              {alert} <ArrowForwardIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />
            </Typography>
          ))}
          {alerts.map((alert, index) => (
            <Typography
              key={`dup-${index}`}
              variant="body2"
              sx={{
                display: 'inline-block',
                mx: 4,
                color: '#ff4444',
                fontWeight: 500,
                padding: '0 10px',
              }}
            >
              {alert} <ArrowForwardIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} />
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Insight Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
          gap: 4,
          maxWidth: '1200px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 188, 212, 0.3)',
            color: '#fff',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <SecurityIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Threat Overview
            </Typography>
            <Typography variant="body2" color="#bbb" sx={{ lineHeight: 1.6 }}>
              Monitor 450+ active threats weekly with real-time updates and risk assessment.
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 188, 212, 0.3)',
            color: '#fff',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'translateY(-5px)' },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <WarningIcon sx={{ fontSize: 50, color: '#ff4444', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Active Alerts
            </Typography>
            <Typography variant="body2" color="#bbb" sx={{ lineHeight: 1.6 }}>
              Track 25 high-priority incidents daily with automated response triggers.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ThreatInsightsSection;