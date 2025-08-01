'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const FeaturesSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle, #1e1e1e 0%, #0f2027 100%)',
        py: 8,
        px: { xs: 2, md: 4 },
        color: '#fff',
        minHeight: '60vh',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at 30% 30%, rgba(0, 188, 212, 0.1) 0%, transparent 70%)',
          zIndex: 0,
        },
      }}
      id="features"
    >
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          fontWeight: 800,
          mb: 6,
          fontSize: { xs: '2rem', md: '2.5rem' },
          letterSpacing: '0.2rem',
          textTransform: 'uppercase',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Powerful Features
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 4, md: 6 },
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1200px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)', // Static background from hover
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              border: '1px solid rgba(0, 188, 212, 0.5)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for card effect
            }}
          >
            <VerifiedUserIcon sx={{ fontSize: 60, color: '#00bcd4' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#e0e0e0' }}>
            Role-Based Access
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ maxWidth: '200px', lineHeight: 1.5 }}>
            Define and control who accesses what in your organization.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)', // Static background from hover
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              border: '1px solid rgba(0, 188, 212, 0.5)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for card effect
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 60, color: '#00bcd4' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#e0e0e0' }}>
            Real-Time Alerts
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ maxWidth: '200px', lineHeight: 1.5 }}>
            Get notified instantly when suspicious activities are detected.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)', // Static background from hover
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              border: '1px solid rgba(0, 188, 212, 0.5)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for card effect
            }}
          >
            <AssessmentIcon sx={{ fontSize: 60, color: '#00bcd4' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#e0e0e0' }}>
            Insightful Reports
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ maxWidth: '200px', lineHeight: 1.5 }}>
            Generate detailed insights to inform your decisions.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)', // Static background from hover
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              border: '1px solid rgba(0, 188, 212, 0.5)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for card effect
            }}
          >
            <MarkEmailReadIcon sx={{ fontSize: 60, color: '#00bcd4' }} />
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#e0e0e0' }}>
            OTP + Email Auth
          </Typography>
          <Typography variant="body2" color="#bbb" sx={{ maxWidth: '200px', lineHeight: 1.5 }}>
            Secure logins via OTP and verified email credentials.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesSection;