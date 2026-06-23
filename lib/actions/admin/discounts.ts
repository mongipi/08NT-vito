'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDiscount(formData: FormData) {
  await prisma.discount.create({
    data: {
      code: (formData.get('code') as string).toUpperCase().trim(),
      type: formData.get('type') as 'percent' | 'fixed',
      value: parseFloat(formData.get('value') as string),
      minOrderAmount: formData.get('minOrderAmount') ? parseFloat(formData.get('minOrderAmount') as string) : null,
      maxUses: formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : null,
      expiresAt: formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null,
      applicableTo: (formData.get('applicableTo') as 'all' | 'b2b' | 'consumer') ?? 'all',
      active: true,
    },
  })
  revalidatePath('/admin/sconti')
  redirect('/admin/sconti')
}

export async function deleteDiscount(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.discount.delete({ where: { id } })
  revalidatePath('/admin/sconti')
}
