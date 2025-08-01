// components/ThreatAlertPanel.tsx

'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const threatAlerts = [
  { id: 1, message: 'Multiple failed login attempts from user john_doe', time: '2 mins ago' },
  { id: 2, message: 'Large download detected from HR department', time: '10 mins ago' },
  { id: 3, message: 'Login from unrecognized device (IT admin)', time: '30 mins ago' },
];

const ThreatAlertPanel = () => {
  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        p: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        mb: 4,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="#ff5252" fontWeight="bold">
            ⚠️ Threat Alert Center
          </Typography>
          <Chip
            label="Current Risk Level: High"
            color="error"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Divider sx={{ mb: 2, borderColor: '#444' }} />

        <Box>
          {threatAlerts.map((alert) => (
            <Box key={alert.id} sx={{ mb: 1 }}>
              <Typography color="#fff">
                <WarningAmberIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: '#ff9800' }} />
                {alert.message}
              </Typography>
              <Typography variant="caption" color="#aaa" sx={{ ml: 4 }}>
                {alert.time}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="outlined"
          sx={{
            mt: 3,
            color: '#ff5252',
            borderColor: '#ff5252',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255,82,82,0.1)',
            },
          }}
        >
          View Full Threat Logs
        </Button>
      </CardContent>
    </Card>
  );
};

export default ThreatAlertPanel;
