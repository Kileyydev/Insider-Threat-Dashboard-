'use client';

import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/app/dashboard/components/SideBar';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import UserActivityPanel from './components/UserActivityPanel';
import LoginActivityCard from './components/LoginActivityCard';
import ThreatAlertPanel from './components/ThreatAlertPanel';
import LiveSessionPanel from './components/LiveSessionPanel';
import InsightChartsPanel from './components/InsightChartPanel';

const DashboardPage = () => {
  return (
    <>
      {/* Top Navigation */}
      <TopNavBar />

      {/* Layout with Sidebar and Main Content */}
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar (fixed width) */}
        <Box
          component="nav"
          sx={{
            width: 240, // Sidebar width
            flexShrink: 0,
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            minHeight: '100vh',
          }}
        >
           <InsightChartsPanel/>
           <ThreatAlertPanel/>
          <LoginActivityCard/>
          <LiveSessionPanel/>
           <UserActivityPanel />
        
        </Box>
      </Box>

      <FooterSection />
    </>
  );
};

export default DashboardPage;
