// app/sitemap.ts
import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

// Type definitions for your API responses
interface BlogPost {
  slug?: string
  updated_at_meta?: string
  url_en?: string
  url_ar?: string
  url_de?: string
  url_es?: string
  url_fr?: string
  url_it?: string
  url_nl?: string
  url_pt?: string
  url_ru?: string
  url_sv?: string
  [key: string]: any // For other localized fields
}

interface Product {
  slug?: string
  updated_at_meta?: string
  url_en?: string
  url_ar?: string
  url_de?: string
  url_es?: string
  url_fr?: string
  url_it?: string
  url_nl?: string
  url_pt?: string
  url_ru?: string
  url_sv?: string
  [key: string]: any // For other localized fields
}

interface SitemapItem {
  url: string
  updatedAt: Date
}
async function getAllBlogPosts(): Promise<SitemapItem[]> {
  try {
    const posts: BlogPost[] = await fetch(`${process.env.NEXT_PUBLIC_URL}post/`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    }).then((res) => res.json())
    
    const items: SitemapItem[] = []
    const siteUrl = process.env.NEXT_PUBLIC_HOME!
    
    posts.forEach((post: BlogPost) => {
      const locales = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'pt', 'ru', 'sv']
      
      locales.forEach(locale => {
        const slugField = `url_${locale}` as keyof BlogPost
        const slug = post[slugField] as string
        
        if (slug) {
          // Construct full URL with domain, locale, and blog path
          const blogPath = routing.pathnames['/blog']
          let localizedBlogPath = '/blog'
          
          if (typeof blogPath === 'object') {
            localizedBlogPath = blogPath[locale as keyof typeof blogPath] || '/blog'
          }
          
          const fullUrl = `${siteUrl}/${locale}${localizedBlogPath}/${slug}`
          
          items.push({
            url: fullUrl,
            updatedAt: post.updated_at_meta ? new Date(post.updated_at_meta) : new Date(),
          })
        }
      })
    })
    
    return items
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}async function getAllProducts(): Promise<SitemapItem[]> {
  try {
    const products: Product[] = await fetch(`${process.env.NEXT_PUBLIC_URL}product/`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
    }).then((res) => res.json())
    
    const items: SitemapItem[] = []
    const siteUrl = process.env.NEXT_PUBLIC_HOME!
    
    products.forEach((product: Product) => {
      const locales = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'pt', 'ru', 'sv']
      
      locales.forEach(locale => {
        const slugField = `url_${locale}` as keyof Product
        const slug = product[slugField] as string
        
        if (slug) {
          // Construct full URL with domain, locale, and product path
          const productPath = routing.pathnames['/product']
          let localizedProductPath = '/product'
          
          if (typeof productPath === 'object') {
            localizedProductPath = productPath[locale as keyof typeof productPath] || '/product'
          }
          
          const fullUrl = `${siteUrl}/${locale}${localizedProductPath}/${slug}`
          
          items.push({
            url: fullUrl,
            updatedAt: product.updated_at_meta ? new Date(product.updated_at_meta) : new Date(),
          })
        }
      })
    })
    
    return items
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_HOME!
  const currentDate = new Date()
  const urls: MetadataRoute.Sitemap = []

  // Fetch all dynamic content (now returns URLs for all locales)
  const [blogPosts, products] = await Promise.all([
    getAllBlogPosts(),
    getAllProducts()
  ])

  // Generate entries for all locales (main pages only)
  routing.locales.forEach(locale => {
    const blogPath = routing.pathnames['/blog']
    const productPath = routing.pathnames['/product']
    
    // Get localized paths
    let localizedBlogPath = '/blog'
    let localizedProductPath = '/product'
    
    if (typeof blogPath === 'object') {
      localizedBlogPath = blogPath[locale as keyof typeof blogPath] || '/blog'
    }
    if (typeof productPath === 'object') {
      localizedProductPath = productPath[locale as keyof typeof productPath] || '/product'
    }

    // Add main pages
    urls.push(
      {
        url: `${siteUrl}/${locale}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${siteUrl}/${locale}${localizedBlogPath}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${siteUrl}/${locale}${localizedProductPath}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    )
  })

  // Add individual blog posts (already processed for all locales)
  blogPosts.forEach((post: SitemapItem) => {
    urls.push({
      url: post.url, // Use the full URL from the database
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  // Add individual products (already processed for all locales)
  products.forEach((product: SitemapItem) => {
    urls.push({
      url: product.url, // Use the full URL from the database
      lastModified: product.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  return urls
}