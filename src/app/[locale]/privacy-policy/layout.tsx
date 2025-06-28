import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
import { routing } from '@/i18n/routing';



// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/privacy-policy'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/privacy-policy', '') || '/privacy-policy';
  }
  return '/privacy-policy';
}




export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout');
  const locale = await getLocale();
  const currentProductPath = getLocalizedProductPath(locale);
  return {
    title: t('Privacy-title'),
    description: t('Privacy-description'),

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/privacy-policy`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/politique-de-confidentialite`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/سياسة-الخصوصية`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/privacybeleid`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/datenschutz`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/politica-de-privacidade`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/integritetspolicy`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/политика-конфиденциальности`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/politica-sulla-privacy`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/politica-de-privacidad`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/privacy-policy`, // Fallback to English
      },
    },
    openGraph: {
      title: t('Privacy-og-title'),
      description: t('Privacy-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Privacy-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Privacy-og-title'),
      description: t('Privacy-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Privacy-og-title'),
      },
    ],
    },
  };
}

export default async function PrivacyLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();

  return (
    <div>
      <section>{children}</section>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          "name":t('Privacy-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`,
          "description":t('Privacy-name-description'),
          "datePublished": "2025-01-01",
          "publisher": {
            "@type": "Organization",
            "name": "Padlev"
          },
       
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