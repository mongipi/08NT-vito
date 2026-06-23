import type { MetadataRoute } from 'next'
import { getProductSlugs } from '@/services/products'
import { getArticleSlugs } from '@/services/articles'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://08naturaltechnology.it'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, articleSlugs] = await Promise.all([getProductSlugs(), getArticleSlugs()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/prodotti`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/brand`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/metodo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/trasparenza`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contatti`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/prodotti/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const articleRoutes: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...articleRoutes]
}
