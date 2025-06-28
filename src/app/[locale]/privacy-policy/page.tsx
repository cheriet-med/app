import React from 'react';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
export default async function PrivacyPolicy() {
  const t = await getTranslations('PrivacyPolicy');
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-primary">
      <h1 className="text-2xl font-bold mb-6 uppercase">{t('title')}</h1>
      <p className="text-sm mb-10">{t('effectiveDate')} | {t('lastUpdated')}</p>
<p>In a quiet town nestled between rolling hills and winding rivers, a curious idea took root. People gathered not for fame or fortune, but to build something meaningful an echo of forgotten dreams and new beginnings. Every corner buzzed with potential, every morning felt like a blank page. Amid the laughter and setbacks, a quiet determination grew, reminding them all that sometimes, the most unexpected journeys lead to the most extraordinary destinations.</p>
    </main>
  );
}
