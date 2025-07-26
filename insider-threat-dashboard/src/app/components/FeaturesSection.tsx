'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const FeaturesSection = () => {
  return (
    <Box
      sx={{
         background: '#1e1e1e',
        py: 10,
        px: 4,
        color: '#fff',
      }}
      id="features"
    >
      <Typography
        variant="h4"
        sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}
      >
        Powerful Features
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 8,
          flexWrap: 'wrap',
          textAlign: 'center',
        }}
      >
        <Box>
          <VerifiedUserIcon sx={{ fontSize: 48, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Role-Based Access
          </Typography>
          <Typography variant="body2" color="#bbb">
            Define and control who accesses what in your organization.
          </Typography>
        </Box>

        <Box>
          <NotificationsActiveIcon sx={{ fontSize: 48, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Real-Time Alerts
          </Typography>
          <Typography variant="body2" color="#bbb">
            Get notified instantly when suspicious activities are detected.
          </Typography>
        </Box>

        <Box>
          <AssessmentIcon sx={{ fontSize: 48, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Insightful Reports
          </Typography>
          <Typography variant="body2" color="#bbb">
            Generate detailed insights to inform your decisions.
          </Typography>
        </Box>

        <Box>
          <MarkEmailReadIcon sx={{ fontSize: 48, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            OTP + Email Auth
          </Typography>
          <Typography variant="body2" color="#bbb">
            Secure logins via OTP and verified email credentials.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesSection;
