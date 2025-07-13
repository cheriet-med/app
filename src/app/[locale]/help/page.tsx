'use client'
import React from 'react';


import ModernDateRangePicker from '@/components/Data/datePicker';
export default async function TermsAndConditions() {


  return (
    <div className="max-w-4xl mx-auto py-40 px-4 sm:px-6 lg:px-8 text-primary">
      {/* Page Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-extrabold uppercase">Help</h1>
       {/*  <p className="mt-2 text-lg text-gray-600">Last Updated: 01-01-2025</p> */}
      </header>
      <p>In a quiet town nestled between rolling hills and winding rivers, a curious idea took root. People gathered not for fame or fortune, but to build something meaningful an echo of forgotten dreams and new beginnings. Every corner buzzed with potential, every morning felt like a blank page. Amid the laughter and setbacks, a quiet determination grew, reminding them all that sometimes, the most unexpected journeys lead to the most extraordinary destinations.</p>

    <ModernDateRangePicker/>
    </div>
  );
}
