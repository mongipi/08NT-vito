import { prisma } from '@/lib/prisma'
import type { Product, Ingredient, ProductImages } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  return {
    ...p,
    ingredients: (p.ingredients ?? []) as Ingredient[],
    images: (p.images ?? {}) as ProductImages,
  }
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { line: true },
    orderBy: { order: 'asc' },
  })
  return products.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({
    where: { slug, published: true },
    include: { line: true, b2bPricing: true },
  })
  if (!p) return null
  return mapProduct(p)
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return products.map((p) => p.slug)
}

export async function getB2BPrice(productId: string): Promise<number | null> {
  const b2b = await prisma.b2BPricing.findUnique({ where: { productId } })
  return b2b?.price ?? null
}
