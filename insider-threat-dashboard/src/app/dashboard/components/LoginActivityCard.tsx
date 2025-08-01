// components/LoginActivityCard.tsx

'use client';
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const LoginActivityCard = () => {
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
        <Typography variant="h6" color="#00bcd4" gutterBottom>
          Login Activity Overview
        </Typography>
        <Box
          sx={{
            height: 220,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          {/* Chart placeholder */}
          [ Chart will be rendered here ]
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginActivityCard;
