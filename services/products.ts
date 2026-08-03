import { prisma } from '@/lib/prisma'
import { isPrismaInitError, logPrismaInitError } from '@/lib/prisma-errors'
import type { Product, ProductImages } from '@/types'
import { IMAGE_KEY_TO_URL_PATH, type ImageKey } from '@/lib/domain/product-images'

const PRODUCT_LINE_OVERRIDES: Record<string, { color: string; colorLight: string }> = {
  'multivitaminico-minerali': { color: '#f47b20', colorLight: '#fff0e4' },
}

function buildImageMap(productId: string, productImages: { key: string }[]): ProductImages {
  const result: ProductImages = {}
  for (const img of productImages) {
    const path = IMAGE_KEY_TO_URL_PATH[img.key as ImageKey]
    if (path) {
      ;(result as Record<string, string>)[img.key] = `/api/product-images/${productId}/${path}`
    } else if (img.key.startsWith('variant-')) {
      const token = img.key.slice('variant-'.length)
      result.variants ??= {}
      result.variants[token] = `/api/product-images/${productId}/${encodeURIComponent(img.key)}`
    }
  }
  return result
}

function normalizedPrice(price: number, comparePrice?: number | null) {
  if (!comparePrice || comparePrice === price) return { price, comparePrice: comparePrice ?? null }
  return {
    price: Math.min(price, comparePrice),
    comparePrice: Math.max(price, comparePrice),
  }
}

function variantImageToken(quantity: number, label: string) {
  if (quantity > 0) return String(quantity)
  const quantityInLabel = label.match(/\d+/)?.[0]
  if (quantityInLabel) return quantityInLabel
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any): Product {
  const lineOverride = PRODUCT_LINE_OVERRIDES[p.slug]
  const images = buildImageMap(p.id, p.productImages ?? [])
  const productPricing = normalizedPrice(
    Number(p.price),
    p.comparePrice == null ? null : Number(p.comparePrice)
  )
  const variants = (p.variants ?? []).map((variant: any) => {
    const pricing = normalizedPrice(
      Number(variant.price),
      variant.comparePrice == null ? null : Number(variant.comparePrice)
    )
    const token = variantImageToken(Number(variant.quantity ?? 0), String(variant.label ?? ''))
    return {
      ...variant,
      ...pricing,
      image: images.variants?.[token] ?? images.fronte,
    }
  })

  return {
    ...p,
    ...productPricing,
    line: lineOverride ? { ...p.line, ...lineOverride } : p.line,
    images,
    variants,
  }
}

const productInclude = {
  line: true,
  ingredients: { orderBy: { order: 'asc' as const } },
  productImages: { select: { key: true } },
  variants: { orderBy: { order: 'asc' as const } },
} as const

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      include: productInclude,
      orderBy: { order: 'asc' },
    })
    return products.map(mapProduct)
  } catch (error) {
    logPrismaInitError('products:list', error)
    if (isPrismaInitError(error)) return []
    throw error
  }
}

export async function getProductNavLinks(): Promise<{ name: string; slug: string }[]> {
  try {
    return await prisma.product.findMany({
      where: { published: true },
      select: { name: true, slug: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    logPrismaInitError('products:nav-links', error)
    if (isPrismaInitError(error)) return []
    throw error
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findFirst({
      where: { slug, published: true },
      include: { ...productInclude, b2bPricing: true },
    })
    if (!p) return null
    return mapProduct(p)
  } catch (error) {
    logPrismaInitError('products:by-slug', error)
    if (isPrismaInitError(error)) return null
    throw error
  }
}

export async function getProductSlugs(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return products.map((p) => p.slug)
  } catch (error) {
    logPrismaInitError('products:slugs', error)
    if (isPrismaInitError(error)) return []
    throw error
  }
}

/**
 * Elenco prodotti per l'area admin: include anche i non pubblicati e non applica
 * il mapping storefront, perche' la tabella mostra i campi grezzi del database.
 */
export async function getAdminProducts() {
  return prisma.product.findMany({ orderBy: { order: 'asc' }, include: { line: true } })
}

/** Prodotto completo per il form di modifica admin. */
export async function getProductForEdit(id: string) {
  return prisma.product.findUnique({ where: { id }, include: productInclude })
}

export async function getB2BPrice(productId: string): Promise<number | null> {
  try {
    const b2b = await prisma.b2BPricing.findUnique({ where: { productId } })
    return b2b?.price ?? null
  } catch (error) {
    logPrismaInitError('products:b2b-price', error)
    if (isPrismaInitError(error)) return null
    throw error
  }
}
