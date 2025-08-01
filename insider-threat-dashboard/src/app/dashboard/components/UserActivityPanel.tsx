'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const sampleLogins = [
  {
    user: 'john.kamau@finance.co.ke',
    login: '2025-08-01 08:15 AM',
    logout: '2025-08-01 04:22 PM',
    location: 'Nairobi, Kenya',
    device: 'Chrome on Windows',
  },
  {
    user: 'linda.ombogo@hr.co.ke',
    login: '2025-08-01 09:02 AM',
    logout: 'Active session',
    location: 'Mombasa, Kenya',
    device: 'Safari on Mac',
  },
  {
    user: 'kevin.ndolo@it.co.ke',
    login: '2025-08-01 07:45 AM',
    logout: '2025-08-01 12:30 PM',
    location: 'Remote VPN',
    device: 'Firefox on Linux',
  },
];

const UserActivityPanel = () => {
  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        borderRadius: 3,
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
        mb: 4,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <AccessTimeIcon sx={{ color: '#00bcd4' }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#00bcd4' }}>
            Recent User Activity
          </Typography>
        </Box>

        <List>
          {sampleLogins.map((log, index) => (
            <React.Fragment key={log.user + index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" color="#fff">
                      {log.user}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" color="#ccc">
                        Login: {log.login} | Logout: {log.logout}
                      </Typography>
                      <br />
                      <Typography component="span" color="#aaa" variant="body2">
                        Location: {log.location} | Device: {log.device}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < sampleLogins.length - 1 && <Divider sx={{ borderColor: '#444' }} />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserActivityPanel;
