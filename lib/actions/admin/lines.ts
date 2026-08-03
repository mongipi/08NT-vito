'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import * as lines from '@/services/lines'

const LIST_PATH = '/admin/linee'

export async function createLine(formData: FormData) {
  const name = formData.get('name') as string
  await lines.createLine({
    name,
    slug: (formData.get('slug') as string) || slugify(name),
    color: formData.get('color') as string,
    colorLight: formData.get('colorLight') as string,
  })
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function updateLine(formData: FormData) {
  const id = formData.get('id') as string
  await lines.updateLine(id, {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    color: formData.get('color') as string,
    colorLight: formData.get('colorLight') as string,
  })
  revalidatePath(LIST_PATH)
  revalidatePath(`${LIST_PATH}/${id}`)
  redirect(LIST_PATH)
}

export async function deleteLine(formData: FormData) {
  await lines.deleteLine(formData.get('id') as string)
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}
