'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const IMAGE_KEYS = ['fronte', 'infografica', 'lato1', 'lato2', 'etichetta'] as const
type ImageKey = typeof IMAGE_KEYS[number]

const FILE_NAMES: Record<ImageKey, string> = {
  fronte: 'fronte',
  infografica: 'infografica',
  lato1: 'lato-1',
  lato2: 'lato-2',
  etichetta: 'etichetta',
}

async function saveImages(productId: string, formData: FormData, existing: Record<string, string> = {}) {
  const images: Record<string, string> = { ...existing }

  for (const key of IMAGE_KEYS) {
    const file = formData.get(`img_${key}`) as File | null
    if (!file || file.size === 0) continue

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mimeType = file.type || 'image/png'

    await prisma.productImage.upsert({
      where: { productId_key: { productId, key } },
      create: { productId, key, data: buffer, mimeType },
      update: { data: buffer, mimeType },
    })

    images[key] = `/api/product-images/${productId}/${FILE_NAMES[key]}`
  }

  return images
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
    price: parseFloat(formData.get('price') as string),
    comparePrice: formData.get('comparePrice') ? parseFloat(formData.get('comparePrice') as string) : null,
    stock: parseInt(formData.get('stock') as string) || 0,
    published: formData.get('published') === 'on',
    order: parseInt(formData.get('order') as string) || 99,
    shortDescription: formData.get('shortDescription') as string,
    longDescription: formData.get('longDescription') as string,
    usage: (formData.get('usage') as string) || null,
    target: (formData.get('target') as string) || null,
    format: (formData.get('format') as string) || null,
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
      ingredients: JSON.parse((formData.get('ingredients') as string) || '[]'),
      images: {},
    },
  })

  const images = await saveImages(product.id, formData)

  await prisma.product.update({
    where: { id: product.id },
    data: { images },
  })

  revalidatePath('/admin/prodotti')
  redirect('/admin/prodotti')
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true, images: true } })
  if (!existing) return

  const images = await saveImages(id, formData, existing.images as Record<string, string>)

  await prisma.product.update({
    where: { id },
    data: {
      ...parseProductData(formData),
      line: { connect: { id: formData.get('lineId') as string } },
      ingredients: JSON.parse((formData.get('ingredients') as string) || '[]'),
      images,
    },
  })
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
