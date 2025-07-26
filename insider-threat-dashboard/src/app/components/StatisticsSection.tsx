'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import InsightsIcon from '@mui/icons-material/Insights';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const StatisticsSection = () => {
  return (
    <Box
      sx={{
        background: '#0f2027',
        py: 10,
        px: 4,
        color: '#fff',
        textAlign: 'center',
      }}
      id="statistics"
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 'bold', mb: 6 }}
      >
        Platform Impact Statistics
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
            maxWidth: 280,
          }}
        >
          <TimelineIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">1.2M+</Typography>
          <Typography variant="subtitle2" color="#bbb">
            Activities Analyzed
          </Typography>
        </Paper>

        <Paper
          elevation={6}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            p: 4,
            maxWidth: 280,
          }}
        >
          <InsightsIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">96%</Typography>
          <Typography variant="subtitle2" color="#bbb">
            Threat Detection Accuracy
          </Typography>
        </Paper>

        <Paper
          elevation={6}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            p: 4,
            maxWidth: 280,
          }}
        >
          <VerifiedUserIcon sx={{ fontSize: 50, color: '#00bcd4', mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">850+</Typography>
          <Typography variant="subtitle2" color="#bbb">
            Secure Sessions Daily
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default StatisticsSection;
