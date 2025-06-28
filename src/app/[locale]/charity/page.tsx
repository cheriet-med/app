import React from 'react';
import { getTranslations } from 'next-intl/server';



export default async function CharityPage() {
  const t = await getTranslations('CharityPage');
  return (
   
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 uppercase">{t('title')}</h1>

      {/* Intro */}
      <section className="mb-10 space-y-6">
        <p>{t('intro.p1')}</p>
        <p>{t('intro.p2')}</p>
      </section>

      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('section1.title')}</h2>
        <p>{t('section1.p1')}</p>
        <p>{t('section1.p2')}</p>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('section2.title')}</h2>
        <p>{t('section2.p1')}</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>{t('section2.list.0')}</li>
          <li>{t('section2.list.1')}</li>
          <li>{t('section2.list.2')}</li>
          <li>{t('section2.list.3')}</li>
        </ul>
        <p className="mt-4">{t('section2.p2')}</p>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('section3.title')}</h2>
        <p>{t('section3.p1')}</p>
        <h3 className="text-xl font-semibold mt-6">{t('section3.howItWorks.title')}</h3>
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>{t('section3.howItWorks.list.0')}</li>
          <li>{t('section3.howItWorks.list.1')}</li>
          <li>{t('section3.howItWorks.list.2')}</li>
        </ol>
        <p className="mt-4">{t('section3.p2')}</p>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('section4.title')}</h2>
        <p>{t('section4.p1')}</p>
        <p className="mt-4">{t('section4.p2')}</p>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('section5.title')}</h2>
        <p>{t('section5.p1')}</p>
        <h3 className="text-xl font-semibold mt-6">{t('section5.howWeCan.title')}</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>{t('section5.howWeCan.list.0')}</li>
          <li>{t('section5.howWeCan.list.1')}</li>
          <li>{t('section5.howWeCan.list.2')}</li>
        </ul>
        <p className="mt-4">{t('section5.p2')}</p>
      </section>

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('section6.title')}</h2>
        <p>{t('section6.p1')}</p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>{t('section6.list.0')}</li>
          <li>{t('section6.list.1')}</li>
          <li>{t('section6.list.2')}</li>
          <li>{t('section6.list.3')}</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('section7.title')}</h2>
        <p>{t('section7.p1')}</p>
        <p className="mt-4">{t('section7.p2')}</p>
      </section>

      {/* Closing */}
      <section className='mt-4'>
        <h2 className="text-xl font-semibold mb-4">{t('closing.title')}</h2>
        <p>{t('closing.p1')}</p>
        <p className="mt-6 font-bold text-xl">{t('closing.p2')}</p>
      </section>
    </main>
  
  );
}
