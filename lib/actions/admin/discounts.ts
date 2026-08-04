'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { parseFormData } from '@/lib/validation/form'
import { idOnlySchema } from '@/lib/validation/product'
import { discountCreateSchema } from '@/lib/validation/admin'
import * as discounts from '@/services/discounts'

const LIST_PATH = '/admin/sconti'

export async function createDiscount(formData: FormData) {
  const data = parseFormData(discountCreateSchema, formData)
  await discounts.createDiscount({ ...data, active: true })
  revalidatePath(LIST_PATH)
  redirect(LIST_PATH)
}

export async function deleteDiscount(formData: FormData) {
  const { id } = parseFormData(idOnlySchema, formData)
  await discounts.deleteDiscount(id)
  revalidatePath(LIST_PATH)
}
