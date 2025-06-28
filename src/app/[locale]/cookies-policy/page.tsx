import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getLocale } from "next-intl/server";
export default async function CookiePolicy() {
  const t = await getTranslations('CookiePolicy');
  const locale = await getLocale();
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-700">
      <h1 className="text-2xl font-bold mb-6 uppercase">{t('title')}</h1>
      <p className="text-sm text-gray-500 mb-10">{t('lastUpdated')}</p>

      {/* Intro Section */}
      <section className="mb-10 space-y-6">
        <p>{t('intro')}</p>
      </section>

      {/* Section 1 */}
      <section className="mb-10 ">
        <h2 className="text-xl font-semibold mb-4">{t('sections.0.title')}</h2>
        <p>{t('sections.0.content')}</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>{t('sections.0.list.0')}</li>
          <li>{t('sections.0.list.1')}</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-10"  dir={locale === "ar" ? "rtl" : "ltr"}>
        <h2 className="text-xl font-semibold mb-4">{t('sections.1.title')}</h2>
        <p>{t('sections.1.content')}</p>
        <div className="overflow-x-auto mt-4">
        <table
  className="table-auto w-full text-left border border-gray-300"
  dir={locale === "ar" ? "rtl" : "ltr"}
>
            <thead className="bg-gray-100"  >
              <tr>
                <th className="px-4 py-2 border"  >{t('sections.1.table.headers.0')}</th>
                <th className="px-4 py-2 border">{t('sections.1.table.headers.1')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border font-medium">{t('sections.1.table.rows.0.0')}</td>
                <td className="px-4 py-2 border">{t('sections.1.table.rows.0.1')}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">{t('sections.1.table.rows.1.0')}</td>
                <td className="px-4 py-2 border">{t('sections.1.table.rows.1.1')}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">{t('sections.1.table.rows.2.0')}</td>
                <td className="px-4 py-2 border">{t('sections.1.table.rows.2.1')}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border font-medium">{t('sections.1.table.rows.3.0')}</td>
                <td className="px-4 py-2 border">{t('sections.1.table.rows.3.1')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('sections.2.title')}</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>{t('sections.2.list.0')}</li>
          <li> {t('sections.2.list.1')}</li>
          <li>{t('sections.2.list.2')}</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('sections.3.title')}</h2>
        <p>{t('sections.3.content')}</p>
        <ul className="list-disc list-inside mt-2 space-y-2">
          <li>{t('sections.3.list.0')}</li>
          <li>{t('sections.3.list.1')}</li>
          <li>{t('sections.3.list.2')}</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('sections.4.title')}</h2>
        <p>{t('sections.4.content')}</p>
      </section>

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('sections.5.title')}</h2>
        <p>{t('sections.5.content')}</p>
      </section>

      {/* Section 7 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">{t('sections.6.title')}</h2>
        <p>{t('sections.6.content')} <strong>contact@padlev.com</strong> </p>
      </section>

    </main>
  );
}
