import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import {getLocale } from "next-intl/server";
import { htmlToText } from "@/components/parser";
import { routing } from '@/i18n/routing';

// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/blog'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/blog', '') || '/blog';
  }
  return '/blog';
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();
  const currentProductPath = getLocalizedProductPath(locale);
  
  return {
    title: t('Blog-title'),
    description: t('Blog-description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}`,
      languages: {
        "en": `${process.env.NEXT_PUBLIC_HOME}/en/blog`,
        "fr": `${process.env.NEXT_PUBLIC_HOME}/fr/blog`,
        "ar": `${process.env.NEXT_PUBLIC_HOME}/ar/مدونة`,
        "nl": `${process.env.NEXT_PUBLIC_HOME}/nl/blog`,
        "de": `${process.env.NEXT_PUBLIC_HOME}/de/blog`,
        "pt": `${process.env.NEXT_PUBLIC_HOME}/pt/blog`,
        "sv": `${process.env.NEXT_PUBLIC_HOME}/sv/blogg`,
        "ru": `${process.env.NEXT_PUBLIC_HOME}/ru/блог`,
        "it": `${process.env.NEXT_PUBLIC_HOME}/it/blog`,
        "es": `${process.env.NEXT_PUBLIC_HOME}/es/blog`,
        'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/blog`, // Fallback to English
      },
      // Add RSS feed links for each locale
      types: {
        'application/rss+xml': [
          {
            url: `${process.env.NEXT_PUBLIC_HOME}/${locale}/rss`,
            title: `${t('Blog-name')} - RSS Feed`
          }
        ]
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      siteName: "padlev",
      title: t('Blog-og-title'),
      description: t('Blog-og-description'),
      images: [{
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Blog-og-title')
      }]
    },
    twitter: {
      card: "summary_large_image", // Best for engagement
      title: t('Blog-og-title-tw'),
      description: t('Blog-og-description-tw'),
     // creator: "@TwitterHandle",
     images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
        width: 1200,
        height: 630,
        alt: t('Blog-og-title-tw'),
      },
    ],
    },
    // Add RSS feed links to HTML head
    other: {
      'link': `<link rel="alternate" type="application/rss+xml" title="${t('Blog-name')} RSS Feed" href="${process.env.NEXT_PUBLIC_HOME}/${locale}/rss" />`
    }
  };
}

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations('Layout'); // Fixed namespace
  const locale = await getLocale();

  // Fetch blog posts
  const posts = await fetch(`${process.env.NEXT_PUBLIC_URL}post/`, {
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  }).then((res) => res.json());

  const getLocalizedField = (item: any, field: string) => 
    item[`${field}_${locale}`] || item[`${field}_en`] || item[field]; // Fallback to raw field if no localization

  return (
    <>
      {/* Add RSS feed links to HTML head */}
      <link 
        rel="alternate" 
        type="application/rss+xml" 
        title={`${t('Blog-name')} RSS Feed`}
        href={`${process.env.NEXT_PUBLIC_HOME}/${locale}/rss?type=blog`} 
      />
      <link 
        rel="alternate" 
        type="application/rss+xml" 
        title="Padlev Products RSS Feed"
        href={`${process.env.NEXT_PUBLIC_HOME}/${locale}/rss?type=products`} 
      />
      <link 
        rel="alternate" 
        type="application/rss+xml" 
        title="Padlev Complete RSS Feed"
        href={`${process.env.NEXT_PUBLIC_HOME}/${locale}/rss`} 
      />
      
      <main>
        <section>{children}</section>
        
        {/* Blog Schema - Correct structure */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": t('Blog-name'),
            "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`,
            "description": t('Blog-name-description'),
            "publisher": {
              "@type": "Organization",
              "name": "Padlev",
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`,
              }
            },
            "blogPost": posts.map((item: any) => ({
              "@type": "BlogPosting",
              "headline": getLocalizedField(item, 'title'),
              "description": getLocalizedField(item, 'description') || '',
              "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}/${getLocalizedField(item, 'url') || item.id}`,
              "image": `${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(item, 'image')}` || '',
              "datePublished": item.created_at_meta,
              "dateModified": item.updated_at_meta,
              "mainEntityOfPage": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}/${getLocalizedField(item, 'url') || item.id}`,
              "isAccessibleForFree": true,
              "wordCount": htmlToText(getLocalizedField(item, 'content'))?.split(' ').length || 0,
              "articleSection": getLocalizedField(item, 'category') || "Blog",
              "author": {
                "@type": "Person",
                "name": "Padlev Team",
                "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}/about-us`,
              },
              "publisher": {
                "@type": "Organization",
                "name": "Padlev",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_HOME}/logo.png`,
                }
              }
            }))
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

        {/* FAQ Schema (separate from blog posts) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": posts.map((item: any) => ({
                "@type": "Question",
                "name": getLocalizedField(item, 'title'),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": htmlToText(getLocalizedField(item, 'content'))  || ''
                }
              }))
          })}
        </script>
      </main>
    </>
  );
}