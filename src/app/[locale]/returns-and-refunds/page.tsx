import React from 'react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
export default async function ReturnPolicy() {
  const t = await getTranslations('ReturnPolicy');
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 uppercase">{t('title')}</h1>
      <p className="text-sm text-gray-500 mb-10">
        01-01-2025
      </p>

      {/* Intro */}
      <section className="mb-10 space-y-6">
        <p>{t('intro')}</p>
      </section>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('eligibility.title')}</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>{t('eligibility.list.0')}</li>
          <li>{t('eligibility.list.1')}</li>
          <li>{t('eligibility.list.2')}</li>
          <li>{t('eligibility.list.3')}</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('howToSubmit.title')}</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>{t('howToSubmit.steps.0')}</li>
          <li>{t('howToSubmit.steps.1')}</li>
          <li>{t('howToSubmit.steps.2')}</li>
          <li>{t('howToSubmit.steps.3')}</li>
        </ol>
        <p className="mt-4">{t('howToSubmit.note')}</p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('reviewAndApproval.title')}</h2>
        <p>{t('reviewAndApproval.content')}</p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>{t('reviewAndApproval.list.0')}</li>
          <li>{t('reviewAndApproval.list.1')}</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('returnShipping.title')}</h2>
        <p>{t('returnShipping.content')}</p>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('refunds.title')}</h2>
        <p>{t('refunds.content')}</p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>{t('refunds.list.0')}</li>
          <li>{t('refunds.list.1')}</li>
          <li>{t('refunds.list.2')}</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('itemsNotEligible.title')}</h2>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>{t('itemsNotEligible.list.0')}</li>
          <li>{t('itemsNotEligible.list.1')}</li>
          <li>{t('itemsNotEligible.list.2')}</li>
          <li>{t('itemsNotEligible.list.3')}</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('exchanges.title')}</h2>
        <p>{t('exchanges.content')}</p>
      </section>

      {/* Section 8 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('contactUs.title')}</h2>
        <p>{t('contactUs.content')}</p>
        <address className="not-italic mt-4 space-y-1">
          <p><strong>{t('contactUs.address.company')}</strong></p>
          <Link href="mailto:contact@padlev.com">  
          <p className='font-bold'>
            {t('contactUs.address.email')}
            </p>
          </Link>
        
          <p>{t('contactUs.address.supportHours')}</p>
        </address>
      </section>

      {/* Section 9 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('changes.title')}</h2>
        <p>{t('changes.content')}</p>
      </section>
    </main>
  );
}
