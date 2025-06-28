import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
import { routing } from '@/i18n/routing';


// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/about-us'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/about-us', '') || '/about-us';
  }
  return '/about-us';
}



export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale(); 
  const currentProductPath = getLocalizedProductPath(locale);
  return {
    title: t('About-title'),
    description: t('About-description'),
 
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/about-us`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/a-propos`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/معلومات-عنا`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/over-ons`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/uber-uns`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/sobre-nos`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/om-oss`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/о-нас`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/chi-siamo`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/sobre-nosotros`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/about-us`, // Fallback to English
      },
    },
    openGraph: {
      type:"website",
      siteName:'padlev',
      title: t('About-og-title'),
      description: t('About-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('About-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('About-og-title'),
      description: t('About-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('About-og-title'),
      },
    ],
    },
  };
}

export default async function AboutLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();

  return (
    <div className="about-container">
      <section>{children}</section>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": t('About-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`,
          "description":t('About-name-description'),
          "publisher": {
            "@type": "Organization",
            "name": "Padlev",
            "logo": {
              "@type": "ImageObject",
              "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`
            }
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