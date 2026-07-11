'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const IMAGE_KEYS = ['fronte', 'infografica', 'lato1', 'lato2', 'etichetta'] as const
type ImageKey = typeof IMAGE_KEYS[number]

const KEY_TO_PATH: Record<ImageKey, string> = {
  fronte: 'fronte',
  infografica: 'infografica',
  lato1: 'lato-1',
  lato2: 'lato-2',
  etichetta: 'etichetta',
}

async function saveImages(productId: string, formData: FormData) {
  for (const key of IMAGE_KEYS) {
    const file = formData.get(`img_${key}`) as File | null
    if (!file || file.size === 0) continue
    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type || 'image/png'
    await prisma.productImage.upsert({
      where: { productId_key: { productId, key } },
      create: { productId, key, data: buffer, mimeType },
      update: { data: buffer, mimeType },
    })
  }
}

async function syncIngredients(productId: string, formData: FormData) {
  interface RawIngredient { name: string; dosage?: string; vnr?: string }
  const raw: RawIngredient[] = JSON.parse((formData.get('ingredients') as string) || '[]')
  await prisma.ingredient.deleteMany({ where: { productId } })
  if (raw.length > 0) {
    await prisma.ingredient.createMany({
      data: raw.map((ing, i) => ({
        productId,
        name: ing.name,
        dosage: ing.dosage ?? null,
        vnr: ing.vnr ?? null,
        order: i,
      })),
    })
  }
}

function parseDecimal(value: FormDataEntryValue | string | number | null | undefined, fallback = 0) {
  const normalized = String(value ?? '').trim().replace(',', '.')
  if (!normalized) return fallback
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : fallback
}

async function syncVariants(productId: string, formData: FormData) {
  interface RawVariant {
    label: string
    quantity: number
    price: number
    comparePrice?: number | null
    b2bPrice?: number | null
    stock: number
  }
  const raw: RawVariant[] = JSON.parse((formData.get('variants') as string) || '[]')
  await prisma.productVariant.deleteMany({ where: { productId } })
  if (raw.length > 0) {
    await prisma.productVariant.createMany({
      data: raw.map((v, i) => ({
        productId,
        label: v.label,
        quantity: v.quantity,
        price: parseDecimal(v.price),
        comparePrice: v.comparePrice == null ? null : parseDecimal(v.comparePrice),
        b2bPrice: v.b2bPrice == null ? null : parseDecimal(v.b2bPrice),
        stock: v.stock ?? 0,
        order: i,
      })),
    })
  }
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parseProductData(formData: FormData) {
  return {
    name: formData.get('name') as string,
    price: parseDecimal(formData.get('price')),
    comparePrice: formData.get('comparePrice') ? parseDecimal(formData.get('comparePrice')) : null,
    stock: parseInt(formData.get('stock') as string) || 0,
    published: formData.get('published') === 'on',
    order: parseInt(formData.get('order') as string) || 99,
    shortDescription: formData.get('shortDescription') as string,
    longDescription: formData.get('longDescription') as string,
    usage: (formData.get('usage') as string) || null,
    target: (formData.get('target') as string) || null,
    format: (formData.get('format') as string) || null,
    ingredientsText: (formData.get('ingredientsText') as string) || null,
    nameEn: (formData.get('nameEn') as string) || null,
    shortDescriptionEn: (formData.get('shortDescriptionEn') as string) || null,
    longDescriptionEn: (formData.get('longDescriptionEn') as string) || null,
    usageEn: (formData.get('usageEn') as string) || null,
    targetEn: (formData.get('targetEn') as string) || null,
    formatEn: (formData.get('formatEn') as string) || null,
    ingredientsTextEn: (formData.get('ingredientsTextEn') as string) || null,
    capsules: formData.get('capsules') ? parseInt(formData.get('capsules') as string) : null,
    days: formData.get('days') ? parseInt(formData.get('days') as string) : null,
    dosage: (formData.get('dosage') as string) || null,
    notificationMs: (formData.get('notificationMs') as string) || null,
    metaTitle: (formData.get('metaTitle') as string) || null,
    metaDescription: (formData.get('metaDescription') as string) || null,
  }
}

export async function createProduct(formData: FormData) {
  const slug = slugify(formData.get('name') as string)
  const product = await prisma.product.create({
    data: {
      slug,
      ...parseProductData(formData),
      line: { connect: { id: formData.get('lineId') as string } },
    },
  })
  await Promise.all([
    saveImages(product.id, formData),
    syncIngredients(product.id, formData),
    syncVariants(product.id, formData),
  ])
  revalidatePath('/admin/prodotti')
  redirect('/admin/prodotti')
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.product.update({
    where: { id },
    data: {
      ...parseProductData(formData),
      line: { connect: { id: formData.get('lineId') as string } },
    },
  })
  await Promise.all([
    saveImages(id, formData),
    syncIngredients(id, formData),
    syncVariants(id, formData),
  ])
  revalidatePath('/admin/prodotti')
  revalidatePath(`/admin/prodotti/${id}`)
  redirect(`/admin/prodotti/${id}`)
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/prodotti')
  redirect('/admin/prodotti')
}
