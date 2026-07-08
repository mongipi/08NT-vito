'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function toSlug(title: string) {
  return title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function createArticle(formData: FormData) {
  await prisma.article.create({
    data: {
      slug: toSlug(formData.get('title') as string),
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      body: formData.get('body') as string,
      tag: formData.get('tag') as string,
      publishedAt: new Date(formData.get('publishedAt') as string),
      readingTime: formData.get('readingTime') ? parseInt(formData.get('readingTime') as string) : null,
      published: formData.get('published') === 'on',
      metaTitle: formData.get('metaTitle') as string || null,
      metaDescription: formData.get('metaDescription') as string || null,
      titleEn: formData.get('titleEn') as string || null,
      excerptEn: formData.get('excerptEn') as string || null,
      bodyEn: formData.get('bodyEn') as string || null,
    },
  })
  revalidatePath('/admin/articoli')
  redirect('/admin/articoli')
}

export async function updateArticle(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.article.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      body: formData.get('body') as string,
      tag: formData.get('tag') as string,
      publishedAt: new Date(formData.get('publishedAt') as string),
      readingTime: formData.get('readingTime') ? parseInt(formData.get('readingTime') as string) : null,
      published: formData.get('published') === 'on',
      metaTitle: formData.get('metaTitle') as string || null,
      metaDescription: formData.get('metaDescription') as string || null,
      titleEn: formData.get('titleEn') as string || null,
      excerptEn: formData.get('excerptEn') as string || null,
      bodyEn: formData.get('bodyEn') as string || null,
    },
  })
  revalidatePath('/admin/articoli')
  revalidatePath(`/admin/articoli/${id}`)
}

export async function deleteArticle(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.article.delete({ where: { id } })
  revalidatePath('/admin/articoli')
  redirect('/admin/articoli')
}
