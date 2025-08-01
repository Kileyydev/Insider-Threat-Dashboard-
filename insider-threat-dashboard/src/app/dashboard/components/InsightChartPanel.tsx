// components/InsightChartsPanel.tsx

'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

// Bar Chart Data (e.g. Threats Detected Per Department)
const barData = {
  labels: ['Finance', 'HR', 'IT', 'Operations', 'Legal'],
  datasets: [
    {
      label: 'Threat Events',
      data: [4, 2, 7, 3, 1],
      backgroundColor: '#00bcd4',
      borderRadius: 6,
    },
  ],
};

// Doughnut Chart Data (e.g. Threat Types)
const doughnutData = {
  labels: ['Unauthorized Access', 'Data Exfiltration', 'Privilege Escalation'],
  datasets: [
    {
      data: [5, 3, 2],
      backgroundColor: ['#ff6b6b', '#feca57', '#1dd1a1'],
    },
  ],
};

const InsightChartsPanel = () => {
  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        p: 3,
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ color: '#00e5ff', fontWeight: 'bold', mb: 3 }}>
        📈 Dashboard Insights & Threat Trends
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-around' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography sx={{ color: '#ccc', mb: 1 }}>Threat Events per Department</Typography>
          <Bar data={barData} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Typography sx={{ color: '#ccc', mb: 1 }}>Types of Detected Threats</Typography>
          <Doughnut data={doughnutData} />
        </Box>
      </Box>
    </Card>
  );
};

export default InsightChartsPanel;
