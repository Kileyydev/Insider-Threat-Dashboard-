'use client';

import React from 'react';
import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { text: 'Overview', path: '/dashboard' },
    { text: 'Users', path: '/dashboard/users' },
    { text: 'Threat Logs', path: '/dashboard/logs' },
    { text: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        px: 2,
        py: 4,
        color: '#fff',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        InsiderDash
      </Typography>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => router.push(item.path)}
            sx={{
              borderRadius: 1,
              my: 1,
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(0, 188, 212, 0.1)',
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
