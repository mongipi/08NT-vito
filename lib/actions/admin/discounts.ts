'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as discounts from '@/services/discounts'

const LIST_PATH = '/admin/sconti'

function optionalNumber(formData: FormData, key: string): number | null {
  const raw = formData.get(key) as string | null
  return raw ? parseFloat(raw) : null
}

export async function createDiscount(formData: FormData) {
  const maxUses = formData.get('maxUses') as string | null
  const expiresAt = formData.get('expiresAt') as string | null

  await discounts.createDiscount({
    code: (formData.get('code') as string).toUpperCase().trim(),
    type: formData.get('type') as 'percent' | 'fixed',
    value: parseFloat(formData.get('value') as string),
    minOrderAmount: optionalNumber(formData, 'minOrderAmount'),
    maxUses: maxUses ? parseInt(maxUses) : null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    applicableTo: (formData.get('applicableTo') as 'all' | 'b2b' | 'consumer') ?? 'all',
    active: true,
  })
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function deleteDiscount(formData: FormData) {
  await discounts.deleteDiscount(formData.get('id') as string)
  revalidatePath(LIST_PATH)
}
