import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout');
  const locale = await getLocale();
  return {
    title: t('search-title'),
    description: t('search-description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}/search`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/search`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/recherche`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/بحث`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/zoeken`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/suche`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/pesquisa`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/sök`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/поиск`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/cerca`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/buscar`,
        'x-default':`${process.env.NEXT_PUBLIC_HOME}/en/search`, // Fallback to English
      },
    },
    robots: {
      index: false, // Typically don't index search pages
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-image-preview": "standard",
      },
    },
    openGraph: {
      title: t('search-og-title'),
      description: t('search-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt:  t('search-og-title'),
      }],
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('search-og-title'),
      description: t('search-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('search-og-title'),
      },
    ],
    },
  };
}

export default async function SearchLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();

  return (
    <div className="search-page">
      <section>{children}</section>
      
      {/* Structured data for search page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name":  t('search-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}/search`,
          "description":  t('search-name-description'),
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${process.env.NEXT_PUBLIC_HOME}/${locale}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </div>
  );
}