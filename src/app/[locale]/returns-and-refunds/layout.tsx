import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
import { routing } from '@/i18n/routing';




// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/returns-and-refunds'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/returns-and-refunds', '') || '/returns-and-refunds';
  }
  return '/returns-and-refunds';
}



export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  const currentProductPath = getLocalizedProductPath(locale);
  return {
    title: t('Return-title'),
    description: t('Return-description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/returns-and-refunds`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/retours-et-remboursements`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/الإرجاع-والاسترداد`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/retouren-en-terugbetalingen`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/ruckgabe-und-ruckerstattung`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/retur-och-aterbetalning`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/retur-och-aterbetalning`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/возвраты-и-возмещение`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/resi-e-rimborsi`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/devoluciones-y-reembolsos`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/returns-and-refunds`, // Fallback to English
      },
    },
    robots: {
      index: true, // Unlike T&C, return policies often should be indexed
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1, // Allows full description in search results
      },
    },
    openGraph: {
      title: t('Return-og-title'),
      description: t('Return-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`, // Custom returns-themed image
        width: 1200,
        height: 630,
        alt: t('Return-og-title'),
      }],
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Return-og-title'),
      description: t('Return-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Return-og-title'),
      },
    ],
    },
  };
}

export default async function ReturnsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  return (
    <div>
      <section>{children}</section>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t('Return-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`,
          "description": t('Return-name-description'),
          "publisher": {
            "@type": "Organization",
            "name": "Padlev",
            "logo": {
              "@type": "ImageObject",
              "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`,
              "width": 300,
              "height": 60
            },
         
          }
        })}
      </script>

        {/* Breadcrumb Schema - Separate schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${process.env.NEXT_PUBLIC_HOME}/${locale}`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": t('Blog-name'),
                "item": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`
              }
            ]
          })}
        </script>

    </div>
  );
}