import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  return {
    title:  t('Login-title'),
    description:  t('Login-description'),

    robots: {
      index: false, // Hide from search engines (sensitive page)
      follow: false,
      noarchive: true, // Add this to prevent caching
      nosnippet: true, // Prevent text snippets in search results
      googleBot: {
        index: false,
        follow: false,
      },
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}/login-signin`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_HOME}/en/login-signin`,
        'fr': `${process.env.NEXT_PUBLIC_HOME}/fr/connexion`,
        'ar': `${process.env.NEXT_PUBLIC_HOME}/ar/تسجيل-الدخول`,
        'nl': `${process.env.NEXT_PUBLIC_HOME}/nl/inloggen`,
        'de': `${process.env.NEXT_PUBLIC_HOME}/de/anmelden`,
        'pt': `${process.env.NEXT_PUBLIC_HOME}/pt/entrar`,
        'sv': `${process.env.NEXT_PUBLIC_HOME}/sv/logga-in`,
        'ru': `${process.env.NEXT_PUBLIC_HOME}/ru/вход`,
        'it': `${process.env.NEXT_PUBLIC_HOME}/it/accedi`,
        'es': `${process.env.NEXT_PUBLIC_HOME}/es/iniciar-sesion`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/login-signin`, // Fallback to English
      },
    },
    openGraph: {
      title: t('Login-og-title'),
      description: t('Login-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Login-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Login-og-title'),
      description: t('Login-og-description'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Login-og-title'),
      },
    ],
    },
  };
}

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();



  return (
    <div>
      <section>{children}</section>
      {/* Structured data for login page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name":  t('Login-name'),
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}/login-signin`,
          "description":  t('Login-name-description'),
          "publisher": {
            "@type": "Organization",
            "name": "Padlev",
            "logo": `${process.env.NEXT_PUBLIC_HOME}/logo.png`
          }
        })}
      </script>
    </div>
  );
}