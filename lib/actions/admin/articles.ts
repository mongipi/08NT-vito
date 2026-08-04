'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { parseFormData } from '@/lib/validation/form'
import { idOnlySchema } from '@/lib/validation/product'
import { articleSchema, articleUpdateSchema } from '@/lib/validation/admin'
import * as articles from '@/services/articles'

const LIST_PATH = '/admin/articoli'

export async function createArticle(formData: FormData) {
  const fields = parseFormData(articleSchema, formData)
  await articles.createArticle({ ...fields, slug: slugify(fields.title) })
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function updateArticle(formData: FormData) {
  const { id, ...fields } = parseFormData(articleUpdateSchema, formData)
  await articles.updateArticle(id, fields)
  revalidatePath(LIST_PATH)
  revalidatePath(`${LIST_PATH}/${id}`)
}

export async function deleteArticle(formData: FormData) {
  const { id } = parseFormData(idOnlySchema, formData)
  await articles.deleteArticle(id)
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}
