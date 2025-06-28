import PostId from "@/components/post/postid";
import { validateLocale } from "@/components/validateLocale";
import { IoTelescope } from "react-icons/io5";
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import type { Metadata } from "next";
import { htmlToText } from "@/components/parser";
import { routing } from '@/i18n/routing';




// Helper function to get localized product path
function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/blog/[id]'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    // Remove the [id] part to get just the base path
    return localizedPath?.replace('/[id]', '') || '/blog';
  }
  return '/blog';
}



// Generate metadata for individual blog posts
export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations('Layout');
  
  try {
    // Fetch the specific post data
    const posts = await fetch(`${process.env.NEXT_PUBLIC_URL}post/?search=${id}`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    }).then((res) => res.json());

    const post = posts[0];
    
    if (!post) {
      // Fallback metadata if post not found
      return {
        title: t('Page-not-found') || 'Post Not Found',
        description: t('Page-not-found-description') || 'The requested blog post could not be found.',
      };
    }

    // Helper function to get localized content
    const getLocalizedField = (item: any, field: string) => 
      item[`${field}_${locale}`] || item[`${field}_en`] || item[field];

    const title = getLocalizedField(post, 'title').slice(0,50)+"...";
    const description = getLocalizedField(post, 'description') || htmlToText(getLocalizedField(post, 'content'))?.substring(0, 160);
    const postUrl = getLocalizedField(post, 'url') || post.id;
    const image = getLocalizedField(post, 'image');
 // Get the current localized product path
 const currentProductPath = getLocalizedProductPath(locale);
    return {
      title: title,
      description: description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}/${postUrl}`,
        languages: {
          "en": `${process.env.NEXT_PUBLIC_HOME}/en/blog/${postUrl}`,
          "fr": `${process.env.NEXT_PUBLIC_HOME}/fr/blog/${postUrl}`,
          "ar": `${process.env.NEXT_PUBLIC_HOME}/ar/مدونة/${postUrl}`,
          "nl": `${process.env.NEXT_PUBLIC_HOME}/nl/blog/${postUrl}`,
          "de": `${process.env.NEXT_PUBLIC_HOME}/de/blog/${postUrl}`,
          "pt": `${process.env.NEXT_PUBLIC_HOME}/pt/blog/${postUrl}`,
          "sv": `${process.env.NEXT_PUBLIC_HOME}/sv/blogg/${postUrl}`,
          "ru": `${process.env.NEXT_PUBLIC_HOME}/ru/блог/${postUrl}`,
          "it": `${process.env.NEXT_PUBLIC_HOME}/it/blog/${postUrl}`,
          "es": `${process.env.NEXT_PUBLIC_HOME}/es/blog/${postUrl}`,
          'x-default': `${process.env.NEXT_PUBLIC_HOME}/en/blog/${postUrl}`,
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
        type: 'article',
        siteName: "padlev",
        title: title,
        description: description,
        url: `${process.env.NEXT_PUBLIC_HOME}/${locale}${currentProductPath}/${postUrl}`,
        images: image ? [{
          url: `${process.env.NEXT_PUBLIC_IMAGE}/${image}`,
          width: 1200,
          height: 630,
          alt: title
        }] : [{
          url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
          width: 1200,
          height: 630,
          alt: title
        }],
        publishedTime: post.created_at_meta,
        modifiedTime: post.updated_at_meta,
        authors: ['Padlev Team'],
        section: 'Blog',
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: image ? [{
          url: `${process.env.NEXT_PUBLIC_IMAGE}/${image}`,
          width: 1200,
          height: 630,
          alt: title,
        }] : [{
          url: `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
          width: 1200,
          height: 630,
          alt: title,
        }],
      },
      keywords: getLocalizedField(post, 'tags') || getLocalizedField(post, 'category'),
      authors: [{ name: 'Padlev Team', url: `${process.env.NEXT_PUBLIC_HOME}/${locale}/about-us` }],
      publisher: 'Padlev',
      category: getLocalizedField(post, 'category') || 'Blog',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: t('Blog-title') || 'Blog Post',
      description: t('Blog-description') || 'Read our latest blog post.',
    };
  }
}

// This function generates static paths at build time
export async function generateStaticParams() {
  // You should fetch all possible post IDs here and return them
  // Example:
  const posts = await fetch(`${process.env.NEXT_PUBLIC_URL}post/`, {
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  }).then((res) => res.json());

  // Define all supported locales
  const supportedLocales = ['en', 'fr', 'ar', 'it', 'ru', 'de', 'sv', 'nl', 'es', 'pt'];

  // Generate all combinations of posts and locales
  return posts.flatMap((post: any) =>
    supportedLocales.map(locale => ({
      id: post.id.toString(),
      locale: locale
    }))
  );
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = await getTranslations('Not-found');

  if (!id) {
    return (
      <div>
        <h1>Error: Missing Cart ID</h1>
        <p>The page requires a valid cart ID.</p>
      </div>
    );
  }

  try {
    validateLocale(locale);
  } catch (error) {
    return (
      <div>
        <h1>Error: Invalid Locale</h1>
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  // Fetch the post data using the `id`
  const posts = await fetch(`${process.env.NEXT_PUBLIC_URL}post/?search=${id}`, {
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
    },
  }).then((res) => res.json());

  const med = posts[0]; // Get the first post from the response

  // Fallback if the post is not found
  if (!med) {
  
    return (
      <div className="py-40 mx-auto items-center container flex justify-center flex-col space-y-4">
        <IoTelescope size={96}/>
        <div className="flex justify-center flex-col items-center">
          <h1 className="text-4xl font-bold capitalize">{t('Page-not-found')}</h1>
          <p className="text-lg font-medium capitalize">{t('Page-not-found-description')}</p>
        </div>
      </div>
    );
  }

  // Helper function for structured data
  const getLocalizedField = (item: any, field: string) => 
    item[`${field}_${locale}`] || item[`${field}_en`] || item[field];
  const postUrl = getLocalizedField(med, 'url') || med.id;
  return (
    <div>
       <h1 className="sr-only" aria-hidden="true">
       {getLocalizedField(med, 'title')}
      </h1>
      {/* Pass both `info` and `locale` to the `PostId` component */}
      <PostId info={med} locale={locale} />
      
      {/* Individual Blog Post Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": getLocalizedField(med, 'title').slice(0,50)+"...",
          "description": getLocalizedField(med, 'description') || '',
          "url": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}/${postUrl}`,
          "image": med.image ? `${process.env.NEXT_PUBLIC_IMAGE}/${getLocalizedField(med, 'image')}` : `${process.env.NEXT_PUBLIC_HOME}/og/og.png`,
          "datePublished": med.created_at_meta,
          "dateModified": med.updated_at_meta,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}/${postUrl}`
          },
          "isAccessibleForFree": true,
          "wordCount": htmlToText(getLocalizedField(med, 'content'))?.split(' ').length || 0,
          "articleSection":"Blog",
          "articleBody": htmlToText(getLocalizedField(med, 'content')) || '',
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
              "url": `${process.env.NEXT_PUBLIC_HOME}/logo-black/padlev-logo-black.svg`,
            }
          },
       "sourceOrganization": {
  "@type": "Organization",
  "name": "Padlev",
  "url": "https://www.padlev.com"
}

        })}
      </script>
             {/* ✅ BreadcrumbList schema (separate block) */}
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
                "name": "Products",
                 // Use localized path for breadcrumb too
                  "item": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": getLocalizedField(med, 'title'),
                "item": `${process.env.NEXT_PUBLIC_HOME}/${locale}${getLocalizedProductPath(locale)}/${postUrl}`
              }
            ]
          })}
        </script>
    </div>
  );
}