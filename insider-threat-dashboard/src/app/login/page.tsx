'use client';

import React from 'react';
import LoginForm from '@/app/components/LoginForm';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
const LoginPage = () => {
  return (
    <>
      <TopNavBar />
      <LoginForm />
      < FooterSection/>
    </>
  );
};

export default LoginPage;
