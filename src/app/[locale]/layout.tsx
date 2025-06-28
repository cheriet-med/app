
import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
//import { Poppins } from 'next/font/google';
import NavBar from "@/components/header/NavBar";
import ScrollToTopButton from '@/components/home-page/TopButton';
import Footer from '@/components/footer/footer';
import End from '@/components/footer/end';
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart";
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import Script from 'next/script'
import YandexMetrika from "@/components/YandexMetrika";
//const poppins = Poppins({
//  subsets: ['latin'],
//  weight: ['400','600','500' ,'700'], // Specify the weights you need
//  variable: '--font-poppins', // Optional: Define a CSS variable
//});

const isoDate = new Date().toISOString();

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const t = await getTranslations('Layout');


  const {locale} = await params;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["SportsOrganization", "Organization"],
    "name": t('global-name'),
    "description": t('global-name-description'),
    "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}`,
    "publisher": {
      "@type": "Organization",
      "name": "Padlev",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`,
        "width": 600,
        "height": 60
      }
    },
    "potentialAction": {
  "@type": "SearchAction",
  "target": `${process.env.NEXT_PUBLIC_HOME}/${locale}/search?q={search_term}`,
  "query-input": "required name=search_term"
   },
    "inLanguage": locale
  };





  return {


    title: t('global-title'),
    description: t('globale-description'),

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        { url: '/favicon-48×48.png', type: 'image/png', sizes: '48×48' },
        { url: '/icon.png', type: 'image/png', sizes: '192×192' },
      ],
      apple: '/apple-icon.png',
    },
    manifest: '/site.webmanifest',
    other: {
      'msapplication-config': '/browserconfig.xml',
      'ld+json': JSON.stringify(schemaData) // Must be stringified
    },

     // KEYWORDS (not used by Google but some value for Bing/Yandex)
  keywords: [t('keywords')],
  
  // AUTHORSHIP & CREDIBILITY
  authors: [
    { name: "padlev team", url: `${process.env.NEXT_PUBLIC_HOME}/${locale}/about-us` },
  ],
  creator: "padlev",
  publisher: "padlev",  

  openGraph: {
    title: t('global-og-title'),
    description: t('global-og-description'),
    url:  `${process.env.NEXT_PUBLIC_HOME}/` ,
    siteName: "Padlev",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('global-og-title'),
      },
    ],
    locale: "en_US",
    type: "article", // or "website" for non-articles
   // publishedTime: isoDate, // For articles
   // authors: ["Author Name"], // For articles
   // modifiedTime: isoDate, // Helps with updates
   // tags: ['SEO', 'Next.js'], // For article categorization

  },


  twitter: {
    card: "summary_large_image", // Best for engagement
    title: t('global-og-title'),
    description: t('global-og-description'),
   // creator: "@TwitterHandle",
   images: [
    {
      url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
      width: 1200,
      height: 630,
      alt: t('global-og-title'),
    },
  ],
  },

 
  //verification: {
  //  other: {
     // "yandex-verification": "f9a70be44b064c62",
 //   },
  //},
 
  // YANDEX SPECIFICS
 

  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}`,
    languages: {
      'en': `${process.env.NEXT_PUBLIC_HOME}/en`,
      'fr': `${process.env.NEXT_PUBLIC_HOME}/fr`,
      'ar': `${process.env.NEXT_PUBLIC_HOME}/ar`,
      'nl': `${process.env.NEXT_PUBLIC_HOME}/nl`,
      'de': `${process.env.NEXT_PUBLIC_HOME}/de`,
      'pt': `${process.env.NEXT_PUBLIC_HOME}/pt`,
      'sv': `${process.env.NEXT_PUBLIC_HOME}/sv`,
      'ru': `${process.env.NEXT_PUBLIC_HOME}/ru`,
      'it': `${process.env.NEXT_PUBLIC_HOME}/it`,
      'es': `${process.env.NEXT_PUBLIC_HOME}/es`,
      'x-default': `${process.env.NEXT_PUBLIC_HOME}/en`, // Fallback to English
    },
  },

 
  // FOR ARTICLES/NEWS (Google News, Discover)
  //category: "Sports", // Helps with topical relevance
  //archives: ["https://archive.org/example"], // For reference
  //bookmarks: ["https://other-relevant-resource.com"], // For credibility
  
  }
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const locale = await getLocale();
  const t = await getTranslations('Layout');
  const tm = await getTranslations('rss');
  // Validate locale
  const supportedLocales = ["en", "ar", "fr", "ru", "pt", "nl", "sv", "de", "it", "es"];
  if (!locale || !supportedLocales.includes(locale) || !routing.locales) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages({locale});

  if (!messages) {
    return notFound();
  }
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": t('global-name'),
    "description": t('global-name-description'),
    "url": "https://www.padlev.com",
   
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`,
        "width": 600,
        "height": 60
      },
      "foundingDate": "2025-03-17",
      "email": "contact@padlev.com",
  "department": [
    {
      "@type": "Organization",
      "name": "Customer Service"
    },
    {
      "@type": "Organization",
      "name": "Sales"
    }
  ],
    "potentialAction": {
  "@type": "SearchAction",
  "target": `${process.env.NEXT_PUBLIC_HOME}/${locale}/search?q={search_term}`,
  "query-input": "required name=search_term"
   },
   // "inLanguage": locale
  };

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} >
      <head>
      

        {/*<link rel="canonical" href={`https://www.padlev.com/${locale}`} />*/}
        <link rel="alternate" hrefLang="en" href="https://www.padlev.com/en" />
        <link rel="alternate" hrefLang="ar" href="https://www.padlev.com/ar" />
        <link rel="alternate" hrefLang="de" href="https://www.padlev.com/de" />
        <link rel="alternate" hrefLang="fr" href="https://www.padlev.com/fr" />
        <link rel="alternate" hrefLang="es" href="https://www.padlev.com/es" />
        <link rel="alternate" hrefLang="pt" href="https://www.padlev.com/pt" />
        <link rel="alternate" hrefLang="nl" href="https://www.padlev.com/nl" />
        <link rel="alternate" hrefLang="it" href="https://www.padlev.com/it" />
        <link rel="alternate" hrefLang="ru" href="https://www.padlev.com/ru" />
        <link rel="alternate" hrefLang="sv" href="https://www.padlev.com/sv" />
        <link rel="alternate" hrefLang="x-default" href="https://www.padlev.com/en" />
{/* RSS Feed Links */}
<link 
  rel="alternate" 
  type="application/rss+xml" 
  title={`${tm('title-b-p')} - ${tm('title-b-p', { defaultValue: 'RSS Feed' })}`}
  href={`${process.env.NEXT_PUBLIC_HOME}/${locale}/rss`}
/>
<link 
  rel="alternate" 
  type="application/rss+xml" 
  title={`${tm('title-blog')} - ${tm('title-blog', { defaultValue: 'Blog RSS Feed' })}`}
  href={`${process.env.NEXT_PUBLIC_HOME}/${locale}/rss?type=blog`}
/>
<link 
  rel="alternate" 
  type="application/rss+xml" 
  title={`${tm('title-product')} - ${tm('title-product', { defaultValue: 'Products RSS Feed' })}`}
  href={`${process.env.NEXT_PUBLIC_HOME}/${locale}/rss?type=products`}
/>

 {/* OG Locale Tags */}
 <meta property="og:locale" content={locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`} />
        {supportedLocales.map(lang => (
          lang !== locale && (
            <meta 
              key={lang} 
              property="og:locale:alternate" 
              content={lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`} 
            />
          )
        ))}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
  />
 {/* SwG Script */}
 <Script
          src="https://news.google.com/swg/js/v1/swg-basic.js"
          strategy="afterInteractive"
          async
          type="application/javascript"
        />
        <Script id="swg-init" strategy="afterInteractive">
          {`
            (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
              basicSubscriptions.init({
                type: "NewsArticle",
                isPartOfType: ["Product"],
                isPartOfProductId: "CAow5Nq-DA:openaccess",
                clientOptions: { theme: "light", lang: "en-GB" },
              });
            });
          `}
        </Script>

      </head>
      <body> 
        <NextIntlClientProvider locale={locale} messages={messages} >  
       
        <SessionProvider>
         
            <CartProvider>   
            
              <NavBar/>
              {children}
              <YandexMetrika />
              <Footer/>
              <End/>
              <ScrollToTopButton/>
            </CartProvider>  
        
        </SessionProvider>  
         </NextIntlClientProvider>  
      </body>
    </html>
  );
}


//export const dynamic = 'force-dynamic'; // Ensures headers are sent






/**dir={locale === "ar" ? "rtl" : "ltr"}  lang={locale}  className="font-poppins antialiased "*/