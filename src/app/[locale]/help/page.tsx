import React from 'react';
import { getTranslations } from 'next-intl/server';

export default async function FAQPage() {
  const t = await getTranslations('FAQPage');

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 uppercase">{t('title')}</h1>

      {/* FAQ 1 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('1-question')}</h2>
        <p>{t('1-answer-p1')}</p>
        <ol className="list-decimal list-inside mt-4">
          <li>{t('1-list-1')}</li>
          <li>{t('1-list-2')}</li>
          <li>{t('1-list-3')}</li>
        </ol>
        <p className="mt-4">{t('1-answer-p2')}</p>
      </section>

      {/* FAQ 2 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('2-question')}</h2>
        <p>{t('2-answer-p1')}</p>
        <ul className="list-disc list-inside mt-4">
          <li>{t('2-list-1')}</li>
          <li>{t('2-list-2')}</li>
          <li>{t('2-list-3')}</li>
        </ul>
        <p className="mt-4">{t('2-answer-p2')}</p>
      </section>

      {/* FAQ 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('3-question')}</h2>
        <p>{t('3-answer-p1')}</p>
        <p className="mt-4">{t('3-answer-p2')}</p>
        <p className="mt-4">{t('3-answer-p3')}</p>
      </section>

      {/* FAQ 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('4-question')}</h2>
        <p>{t('4-answer-p1')}</p>
        <ul className="list-disc list-inside mt-4">
          <li>{t('4-list-1')}</li>
          <li>{t('4-list-2')}</li>
        </ul>
        <p className="mt-4">{t('4-answer-p2')}</p>
      </section>

      {/* FAQ 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('5-question')}</h2>
        <p>{t('5-answer-p1')}</p>
        <p className="mt-4">{t('5-answer-p2')}</p>
      </section>

      {/* FAQ 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('6-question')}</h2>
        <p>{t('6-answer-p1')}</p>
        <p>{t('6-answer-p2')}</p>
        <ol className="list-decimal list-inside mt-4">
          <li>{t('6-list-1')}</li>
          <li>{t('6-list-2')}</li>
          <li>{t('6-list-3')}</li>
          <li>{t('6-list-4')}</li>
        </ol>
        <p className="mt-4">{t('6-answer-p3')}</p>
        <p className="mt-4">{t('6-answer-p4')}</p>
      </section>

      {/* FAQ 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('7-question')}</h2>
        <p>{t('7-answer-p1')}</p>
        <ol className="list-decimal list-inside mt-4">
          <li>{t('7-list-1')}</li>
          <li>{t('7-list-2')}</li>
          <li>{t('7-list-3')}</li>
          <li>{t('7-list-4')}</li>
        </ol>
        <p className="mt-4">{t('7-answer-p2')}</p>
      </section>

      {/* FAQ 8 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('8-question')}</h2>
        <p>{t('8-answer-p1')}</p>
        <p className="mt-4">{t('8-answer-p2')}</p>
      </section>

      {/* FAQ 9 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('9-question')}</h2>
        <p>{t('9-answer-p1')}</p>
        <ol className="list-decimal list-inside mt-4">
          <li>{t('9-list-1')}</li>
          <li>{t('9-list-2')}</li>
          <li>{t('9-list-3')}</li>
          <li>{t('9-list-4')}</li>
        </ol>
        <p className="mt-4">{t('9-answer-p2')}</p>
      </section>

      {/* FAQ 10 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('10-question')}</h2>
        <p>{t('10-answer-p1')}</p>
        <ul className="list-disc list-inside mt-4">
          <li>{t('10-list-1')}</li>
        </ul>
        <p className="mt-4">{t('10-answer-p2')}</p>
      </section>
    </main>
  );
}
