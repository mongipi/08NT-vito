'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/guards'
import { parseFormData } from '@/lib/validation/form'
import { addressSchema, addressUpdateSchema, userInfoSchema } from '@/lib/validation/admin'
import { idOnlySchema } from '@/lib/validation/product'
import * as addresses from '@/services/addresses'
import { updateUser } from '@/services/users'

const PROFILE_PATH = '/account/profilo'

async function requireUserId(): Promise<string> {
  const user = await requireUser()
  return user.id
}

export async function updateUserInfo(formData: FormData) {
  const userId = await requireUserId()
  await updateUser(userId, parseFormData(userInfoSchema, formData))

  revalidatePath('/account')
  revalidatePath(PROFILE_PATH)
  redirect(`${PROFILE_PATH}?saved=1`)
}

export async function createAddress(formData: FormData) {
  const userId = await requireUserId()
  await addresses.createAddress(userId, parseFormData(addressSchema, formData))

  revalidatePath(PROFILE_PATH)
  redirect(PROFILE_PATH)
}

export async function updateAddress(formData: FormData) {
  const userId = await requireUserId()
  const { id, ...input } = parseFormData(addressUpdateSchema, formData)

  if (!(await addresses.getOwnedAddress(id, userId))) redirect(PROFILE_PATH)
  await addresses.updateAddress(id, userId, input)

  revalidatePath(PROFILE_PATH)
  redirect(PROFILE_PATH)
}

export async function deleteAddress(formData: FormData) {
  const userId = await requireUserId()
  const { id } = parseFormData(idOnlySchema, formData)

  if (!(await addresses.getOwnedAddress(id, userId))) redirect(PROFILE_PATH)
  await addresses.deleteAddress(id)

  revalidatePath(PROFILE_PATH)
  redirect(PROFILE_PATH)
}

export async function setDefaultAddress(formData: FormData) {
  const userId = await requireUserId()
  const { id } = parseFormData(idOnlySchema, formData)

  if (!(await addresses.getOwnedAddress(id, userId))) return
  await addresses.makeDefault(id, userId)

  revalidatePath(PROFILE_PATH)
}
