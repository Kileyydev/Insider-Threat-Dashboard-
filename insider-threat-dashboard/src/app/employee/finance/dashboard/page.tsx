'use client';

import React from 'react';
import FinanceDirectorDashboard from './components/FinanceFilesPage';
import ITDepartmentSharedFiles from '../../it/dashboard/components/ITFilesPage';

const Page = () => {
  return (
     <>
    <FinanceDirectorDashboard />
    <ITDepartmentSharedFiles/>
</>
 );
};

export default Page;
