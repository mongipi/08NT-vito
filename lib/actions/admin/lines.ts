'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { parseFormData } from '@/lib/validation/form'
import { idOnlySchema } from '@/lib/validation/product'
import { lineCreateSchema, lineUpdateSchema } from '@/lib/validation/admin'
import * as lines from '@/services/lines'

const LIST_PATH = '/admin/linee'

export async function createLine(formData: FormData) {
  const { name, slug, color, colorLight } = parseFormData(lineCreateSchema, formData)
  await lines.createLine({ name, slug: slug ?? slugify(name), color, colorLight })
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function updateLine(formData: FormData) {
  const { id, ...data } = parseFormData(lineUpdateSchema, formData)
  await lines.updateLine(id, data)
  revalidatePath(LIST_PATH)
  revalidatePath(`${LIST_PATH}/${id}`)
  redirect(LIST_PATH)
}

export async function deleteLine(formData: FormData) {
  const { id } = parseFormData(idOnlySchema, formData)
  await lines.deleteLine(id)
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}
