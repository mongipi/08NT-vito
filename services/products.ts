import { prisma } from '@/lib/prisma'
import type { Product, ProductImages } from '@/types'

const KEY_TO_URL_PATH: Record<string, string> = {
  fronte: 'fronte',
  infografica: 'infografica',
  lato1: 'lato-1',
  lato2: 'lato-2',
  etichetta: 'etichetta',
}

const PRODUCT_LINE_OVERRIDES: Record<string, { color: string; colorLight: string }> = {
  'multivitaminico-minerali': { color: '#f47b20', colorLight: '#fff0e4' },
}

function buildImageMap(productId: string, productImages: { key: string }[]): ProductImages {
  const result: ProductImages = {}
  for (const img of productImages) {
    const path = KEY_TO_URL_PATH[img.key]
    if (path) {
      (result as Record<string, string>)[img.key] = `/api/product-images/${productId}/${path}`
    }
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  const lineOverride = PRODUCT_LINE_OVERRIDES[p.slug]
  return {
    ...p,
    line: lineOverride ? { ...p.line, ...lineOverride } : p.line,
    images: buildImageMap(p.id, p.productImages ?? []),
  }
}

const productInclude = {
  line: true,
  ingredients: { orderBy: { order: 'asc' as const } },
  productImages: { select: { key: true } },
} as const

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: productInclude,
    orderBy: { order: 'asc' },
  })
  return products.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({
    where: { slug, published: true },
    include: { ...productInclude, b2bPricing: true },
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
