'use client';
import React from 'react';
import Sidebar from '@/app/dashboard/components/SideBar';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';

const DashboardPage = () => {
  return (
    <>
    <TopNavBar/>
      <Sidebar />
      <FooterSection/>
      </>

  );
};

export default DashboardPage;
