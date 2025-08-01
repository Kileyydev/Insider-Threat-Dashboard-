// components/LiveSessionPanel.tsx

'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
} from '@mui/material';

const sessions = [
  { id: 1, user: 'john_doe', department: 'Finance', role: 'Manager', status: 'Active', lastAction: 'Downloaded report' },
  { id: 2, user: 'susan_admin', department: 'IT', role: 'Admin', status: 'Active', lastAction: 'Reset user password' },
  { id: 3, user: 'linda_hr', department: 'HR', role: 'Assistant', status: 'Idle', lastAction: 'Viewed employee file' },
];

const LiveSessionPanel = () => {
  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        mb: 4,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: '#00e5ff', fontWeight: 'bold', mb: 2 }}>
          🟢 Active User Sessions
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#ccc' }}>User</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Department</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Role</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Status</TableCell>
              <TableCell sx={{ color: '#ccc' }}>Last Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell sx={{ color: '#fff' }}>{session.user}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{session.department}</TableCell>
                <TableCell sx={{ color: '#fff' }}>{session.role}</TableCell>
                <TableCell>
                  <Chip
                    label={session.status}
                    color={session.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: '#bbb' }}>{session.lastAction}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LiveSessionPanel;
