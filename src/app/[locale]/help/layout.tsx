import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
import { routing } from '@/i18n/routing';



// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/help'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/help', '') || '/help';
  }
  return '/help';
}



export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Changed to more appropriate namespace
  const locale = await getLocale(); 
  const currentProductPath = getLocalizedProductPath(locale);
  return {
    title: t('Help-title'),
    description: t('Help-description'),
   
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1, // Allows longer snippets in search results
      },
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/${locale}/help`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/aide`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/مساعدة`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/hulp`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/hilfe`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/ajuda`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/hjalp`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/помощь`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/aiuto`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/ayuda`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/help`, // Fallback to English
      },
    },
    openGraph: {
      title: t('Help-og-title'),
      description: t('Help-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Help-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Help-og-title'),
      description: t('Help-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Help-og-title'),
      },
    ],
    },
  };
}

export default async function HelpLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();


  return (
    <div className="help-container">
      <section>{children}</section>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t('Help-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`,
          "description": t('Help-name-description'),
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${process.env.NEXT_PUBLIC_HOME}/${locale}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
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
  )
}