'use client';

import React from 'react';
import TopNavBar from '@/app/components/TopNavBar'; 
import HeroSection from '@/app/components/HeroSection';
import AboutSection from '@/app/components/AboutSection';
import StatisticsSection from '@/app/components/StatisticsSection';
import FeaturesSection from '@/app/components/FeaturesSection';
import CTASection from '@/app/components/CTASection';
import FooterSection from '@/app/components/FooterSection';

const LandingPage = () => {
  return (  
    <>
      <TopNavBar />
      <HeroSection />
      < AboutSection/>
      <FeaturesSection/>
      <StatisticsSection/>
      <CTASection/>
      <FooterSection/>
      </>
  );
};

export default LandingPage;
