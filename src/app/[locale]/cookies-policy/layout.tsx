import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
import { routing } from '@/i18n/routing';



// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/cookies-policy'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/cookies-policy', '') || '/cookies-policy';
  }
  return '/cookies-policy';
}


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale(); 
  const currentProductPath = getLocalizedProductPath(locale);
  return {
    title: t('Cookie-title'),
    description: t('Cookie-description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_HOME!),

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true // Legal pages don't need image indexing
      }
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/cookies-policy`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/politique-de-cookies`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/سياسة-الكوكيز`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/cookiebeleid`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/cookie-richtlinie`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/politica-de-cookies`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/cookiepolicy`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/политика-файлов-cookie`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/politica-dei-cookie`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/politica-de-cookies`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/cookies-policy`, // Fallback to English
      },
    },
    openGraph: {
      title: t('Cookie-og-title'),
      description: t('Cookie-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Cookie-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Cookie-og-title'),
      description: t('Cookie-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Cookie-og-title'),
      },
    ],
    },
  };
}

export default async function CharityLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();

  const currentUrl = `${process.env.NEXT_PUBLIC_HOME}/${locale}/cookies-policy`;

  return (
    <div className="legal-page">
      {children}
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t('Cookie-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`,
          "description": t('Cookie-name-description'),
          "datePublished": "2025-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "publisher": {
            "@type": "Organization",
            "name": "Padlev",
            "logo": `${process.env.NEXT_PUBLIC_HOME}/logo.png`
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