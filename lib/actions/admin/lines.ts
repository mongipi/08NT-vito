'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export async function createLine(formData: FormData) {
  const name = formData.get('name') as string
  await prisma.line.create({
    data: {
      name,
      slug: formData.get('slug') as string || slugify(name),
      color: formData.get('color') as string,
      colorLight: formData.get('colorLight') as string,
    },
  })
  revalidatePath('/admin/linee')
  redirect('/admin/linee')
}

export async function updateLine(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.line.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      color: formData.get('color') as string,
      colorLight: formData.get('colorLight') as string,
    },
  })
  revalidatePath('/admin/linee')
  revalidatePath(`/admin/linee/${id}`)
  redirect('/admin/linee')
}

export async function deleteLine(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.line.delete({ where: { id } })
  revalidatePath('/admin/linee')
  redirect('/admin/linee')
}
