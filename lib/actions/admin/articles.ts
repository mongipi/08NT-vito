'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import * as articles from '@/services/articles'

const LIST_PATH = '/admin/articoli'

function optional(formData: FormData, key: string): string | null {
  return (formData.get(key) as string) || null
}

/** Campi comuni a creazione e modifica, prima ricopiati identici. */
function parseArticleFields(formData: FormData) {
  const readingTime = formData.get('readingTime') as string | null
  return {
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    body: formData.get('body') as string,
    tag: formData.get('tag') as string,
    publishedAt: new Date(formData.get('publishedAt') as string),
    readingTime: readingTime ? parseInt(readingTime) : null,
    published: formData.get('published') === 'on',
    metaTitle: optional(formData, 'metaTitle'),
    metaDescription: optional(formData, 'metaDescription'),
    titleEn: optional(formData, 'titleEn'),
    excerptEn: optional(formData, 'excerptEn'),
    bodyEn: optional(formData, 'bodyEn'),
  }
}

export async function createArticle(formData: FormData) {
  const fields = parseArticleFields(formData)
  await articles.createArticle({ ...fields, slug: slugify(fields.title) })
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function updateArticle(formData: FormData) {
  const id = formData.get('id') as string
  await articles.updateArticle(id, parseArticleFields(formData))
  revalidatePath(LIST_PATH)
  revalidatePath(`${LIST_PATH}/${id}`)
}

export async function deleteArticle(formData: FormData) {
  await articles.deleteArticle(formData.get('id') as string)
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}
