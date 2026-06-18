import { PRODUCTS } from '@/lib/mock-data'
import type { Product } from '@/types'

/** Returns all published products sorted by order. */
export async function getProducts(): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.published).sort((a, b) => a.order - b.order)
}

/** Returns a single published product by slug, or null if not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug && p.published) ?? null
}

/** Returns all published product slugs (used for generateStaticParams). */
export async function getProductSlugs(): Promise<string[]> {
  return PRODUCTS.filter((p) => p.published).map((p) => p.slug)
}
