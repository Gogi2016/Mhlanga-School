import React from 'react';
import SubPageHeader from '@/components/mhlanga/SubPageHeader';
import Admissions from '@/components/mhlanga/Admissions';
import useReveal from '@/components/mhlanga/useReveal';

export default function AdmissionsPage() {
  useReveal();
  return (
    <div className="basalt-bg min-h-screen text-[#F4F4F4] font-body">
      <SubPageHeader />
      <Admissions />
    </div>
  );
}