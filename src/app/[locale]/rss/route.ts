// app/[locale]/rss/route.ts - Fixed RSS Feed with Proper Image Support
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { htmlToText } from '@/components/parser';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  category?: string;
  author?: string;
  type: 'blog' | 'product';
}

// Helper functions to get localized paths
function getLocalizedBlogPath(locale: string): string {
  const pathConfig = routing.pathnames['/blog'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    return localizedPath?.replace('/[id]', '') || '/blog';
  }
  return '/blog';
}

function getLocalizedProductPath(locale: string): string {
  const pathConfig = routing.pathnames['/product'];
  if (typeof pathConfig === 'object') {
    const localizedPath = pathConfig[locale as keyof typeof pathConfig];
    return localizedPath?.replace('/[id]', '') || '/product';
  }
  return '/product';
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Helper function to clean and truncate text
function cleanDescription(text: string, maxLength: number = 200): string {
  if (!text) return '';
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Truncate if needed
  if (cleanText.length > maxLength) {
    return cleanText.slice(0, maxLength).trim() + '...';
  }
  
  return cleanText.trim();
}

// Helper function to get localized field
const getLocalizedField = (item: any, field: string, locale: string) => 
  item[`${field}_${locale}`] || item[`${field}_en`] || item[field];

// Fetch blog posts
const getBlogPosts = async (locale: string): Promise<RSSItem[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const homeUrl = process.env.NEXT_PUBLIC_HOME || 'https://padlev.com';
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_URL environment variable is not set');
    }

    const response = await fetch(`${baseUrl}post/`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const posts = await response.json();
    const blogPath = getLocalizedBlogPath(locale);

    return posts.map((post: any) => {
      const title = getLocalizedField(post, 'title', locale) || 'Untitled';
      const rawDescription = getLocalizedField(post, 'description', locale) || 
                            getLocalizedField(post, 'content', locale) || '';
      const description = cleanDescription(rawDescription);
      
      return {
        title,
        description,
        link: `${homeUrl}/${locale}${blogPath}/${getLocalizedField(post, 'url', locale) || post.id}`,
        pubDate: new Date(post.created_at_meta || post.created_at).toUTCString(),
        guid: `${homeUrl}/${locale}${blogPath}/${getLocalizedField(post, 'url', locale) || post.id}`,
        category: getLocalizedField(post, 'category', locale) || 'Blog',
        author: 'Padlev Team',
        type: 'blog'
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Fetch products
const getProducts = async (locale: string): Promise<RSSItem[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const homeUrl = process.env.NEXT_PUBLIC_HOME || 'https://padlev.com';
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_URL environment variable is not set');
    }

    const response = await fetch(`${baseUrl}product/`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    const productPath = getLocalizedProductPath(locale);

    return products.map((product: any) => {
      const title = getLocalizedField(product, 'title', locale) || 'Untitled Product';
      const rawDescription = getLocalizedField(product, 'content', locale) || 
                            `${getLocalizedField(product, 'brand', locale) || 'Padlev'} product - ${title}`;
      const description = cleanDescription(rawDescription);
      
      return {
        title,
        description,
        link: `${homeUrl}/${locale}${productPath}/${getLocalizedField(product, 'url', locale)}`,
        pubDate: new Date(product.created_at_meta || product.created_at || Date.now()).toUTCString(),
        guid: `${homeUrl}/${locale}${productPath}/${getLocalizedField(product, 'url', locale)}`,
        category: 'Products',
        author: 'Padlev Team',
        type: 'product'
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Generate RSS XML
const generateRSSFeed = async (items: RSSItem[], locale: string, feedType: 'combined' | 'blog' | 'products' = 'combined', currentUrl?: string): Promise<string> => {
  const siteUrl = process.env.NEXT_PUBLIC_HOME || 'https://padlev.com';
  
  const rssItems = items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category><![CDATA[${item.category}]]></category>
      <author>team@padlev.com (Padlev Team)</author>
      <source url="${escapeXml(siteUrl)}/${locale}/rss">${item.type === 'blog' ? 'Blog' : 'Products'}</source>
    </item>`).join('');
    const t = await getTranslations('rss');

  // Get localized content based on feed type
  let feedTitle = '';
  let feedDescription = '';
  let feedPath = '';
  
  switch (feedType) {
    case 'blog':
      feedTitle = t('title-blog');
      feedDescription = t('description-blog');
      feedPath = getLocalizedBlogPath(locale);
      break;
    case 'products':
      feedTitle = t('title-product');
      feedDescription = t('description-product');
      feedPath = getLocalizedProductPath(locale);
      break;
    default:
      feedTitle = t('title-b-p');
      feedDescription = t('description-b-p');
      feedPath = '';
  }
  
  // Build the self URL based on feed type
  let selfUrl = currentUrl || `${siteUrl}/${locale}/rss`;
  if (feedType === 'blog') {
    selfUrl = currentUrl || `${siteUrl}/${locale}/rss?type=blog`;
  } else if (feedType === 'products') {
    selfUrl = currentUrl || `${siteUrl}/${locale}/rss?type=products`;
  }

  // Try multiple image options for maximum compatibility
  const imageOptions = [
    `${siteUrl}/logo-rss.png`,
    `${siteUrl}/favicon-96x96.png`,
    `${siteUrl}/icon.png`,
    `${siteUrl}/favicon-16x16.png`,
    `${siteUrl}/apple-icon.png`,
    `${siteUrl}/favicon-32x32.png`,
    `${siteUrl}/favicon-48×48.png`,
    `${siteUrl}/android-chrome-192x192.png`,
    `${siteUrl}/mstile-150x150.png`
  ];
  
  // Use the first available image (you should test which one exists)
  const imageUrl = imageOptions[0]; // Change index based on which image exists
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[${feedTitle}]]></title>
    <description><![CDATA[${feedDescription}]]></description>
    <link>${escapeXml(siteUrl)}/${locale}${feedPath}</link>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js 15</generator>
    <managingEditor>team@padlev.com (Padlev Team)</managingEditor>
    <webMaster>team@padlev.com (Padlev Team)</webMaster>
    <image>
      <url>${escapeXml(imageUrl)}</url>
      <title><![CDATA[${feedTitle}]]></title>
      <link>${escapeXml(siteUrl)}/${locale}${feedPath}</link>
      <width>96</width>
      <height>96</height>
    </image>${rssItems}
  </channel>
</rss>`;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams, pathname } = request.nextUrl;

    // Extract locale from the pathname (e.g., /en/rss or /fr/rss)
    const segments = pathname.split('/');
    const locale = segments[1] || 'en'; // fallback to 'en' or your default locale

    const type = searchParams.get('type') as 'blog' | 'products' | null;

    if (!routing.locales.includes(locale as any)) {
      return new NextResponse('Invalid locale', { status: 404 });
    }

    // Build the current URL for the self reference
    const baseUrl = process.env.NEXT_PUBLIC_HOME || 'https://padlev.com';
    const currentUrl = `${baseUrl}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    let items: RSSItem[] = [];
    let feedType: 'combined' | 'blog' | 'products' = 'combined';

    if (type === 'blog') {
      items = await getBlogPosts(locale);
      feedType = 'blog';
    } else if (type === 'products') {
      items = await getProducts(locale);
      feedType = 'products';
    } else {
      const [blogPosts, products] = await Promise.all([
        getBlogPosts(locale),
        getProducts(locale),
      ]);

      const newestBlogs = blogPosts
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      const newestProducts = products
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      // Interleave them for variety
      items = [];
      const maxLength = Math.max(newestBlogs.length, newestProducts.length);
      for (let i = 0; i < maxLength; i++) {
        if (newestBlogs[i]) items.push(newestBlogs[i]);
        if (newestProducts[i]) items.push(newestProducts[i]);
      }
    }

    const rssXml = await generateRSSFeed(items, locale, feedType, currentUrl);

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Vary': 'Accept-Language',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function HEAD(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const locale = segments[1] || 'en';

  if (!routing.locales.includes(locale as any)) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}