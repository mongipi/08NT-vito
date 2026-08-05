import { prisma } from '@/lib/prisma'
import { isPrismaInitError, logPrismaInitError } from '@/lib/prisma-errors'
import type { Product, ProductImages, ProductVariant } from '@/types'
import { IMAGE_KEY_TO_URL_PATH, type ImageKey } from '@/lib/domain/product-images'
import { variantImageToken } from '@/lib/domain/variant-image'
import type { Prisma } from '@prisma/client'

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

const productInclude = {
  line: true,
  ingredients: { orderBy: { order: 'asc' as const } },
  productImages: { select: { key: true } },
  variants: { orderBy: { order: 'asc' as const } },
} as const

/**
 * Riga prodotto come arriva da Prisma, derivata dall'include invece che
 * dichiarata a mano: se lo schema cambia, il compilatore segnala qui.
 */
type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }> & {
  b2bPricing?: unknown
}

type ProductVariantRow = ProductRow['variants'][number]

function mapVariant(variant: ProductVariantRow, images: ProductImages): ProductVariant {
  const pricing = normalizedPrice(
    Number(variant.price),
    variant.comparePrice == null ? null : Number(variant.comparePrice)
  )
  const token = variantImageToken(variant.quantity, variant.label)
  return {
    id: variant.id,
    label: variant.label,
    quantity: variant.quantity,
    stock: variant.stock,
    order: variant.order,
    b2bPrice: variant.b2bPrice,
    ...pricing,
    image: images.variants?.[token] ?? images.fronte,
  }
}

/** Unico punto in cui una riga di database diventa un prodotto del sito. */
function mapProduct(p: ProductRow): Product {
  const lineOverride = PRODUCT_LINE_OVERRIDES[p.slug]
  const images = buildImageMap(p.id, p.productImages)
  const pricing = normalizedPrice(
    Number(p.price),
    p.comparePrice == null ? null : Number(p.comparePrice)
  )

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    line: lineOverride ? { ...p.line, ...lineOverride } : p.line,
    ...pricing,
    stock: p.stock,
    published: p.published,
    order: p.order,
    shortDescription: p.shortDescription,
    longDescription: p.longDescription,
    usage: p.usage,
    target: p.target,
    format: p.format,
    ingredientsText: p.ingredientsText,
    nameEn: p.nameEn,
    shortDescriptionEn: p.shortDescriptionEn,
    longDescriptionEn: p.longDescriptionEn,
    usageEn: p.usageEn,
    targetEn: p.targetEn,
    formatEn: p.formatEn,
    ingredientsTextEn: p.ingredientsTextEn,
    capsules: p.capsules,
    days: p.days,
    dosage: p.dosage,
    notificationMs: p.notificationMs,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    ingredients: p.ingredients,
    images,
    variants: p.variants.map((variant) => mapVariant(variant, images)),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

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

export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({ data })
}

export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } })
}

/** Sostituisce integralmente gli ingredienti del prodotto. */
export async function replaceIngredients(
  productId: string,
  ingredients: { name: string; dosage: string | null; vnr: string | null }[]
): Promise<void> {
  await prisma.ingredient.deleteMany({ where: { productId } })
  if (ingredients.length === 0) return
  await prisma.ingredient.createMany({
    data: ingredients.map((ingredient, order) => ({ ...ingredient, productId, order })),
  })
}

/** Sostituisce integralmente le varianti del prodotto. */
export async function replaceVariants(
  productId: string,
  variants: {
    label: string
    quantity: number
    price: number
    comparePrice: number | null
    b2bPrice: number | null
    stock: number
  }[]
): Promise<void> {
  await prisma.productVariant.deleteMany({ where: { productId } })
  if (variants.length === 0) return
  await prisma.productVariant.createMany({
    data: variants.map((variant, order) => ({ ...variant, productId, order })),
  })
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
