'use server'

import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as addresses from '@/services/addresses'
import type { AddressInput } from '@/services/addresses'
import { updateUser } from '@/services/users'

const PROFILE_PATH = '/account/profilo'

/** Campo di form opzionale: stringa vuota equivale ad assente. */
function optional(formData: FormData, key: string): string | null {
  return (formData.get(key) as string) || null
}

function required(formData: FormData, key: string): string {
  return formData.get(key) as string
}

/** Mappatura form → indirizzo, prima ricopiata identica in creazione e modifica. */
function parseAddressInput(formData: FormData): AddressInput {
  return {
    label: optional(formData, 'label'),
    isDefault: formData.get('isDefault') === 'on',
    firstName: required(formData, 'firstName'),
    lastName: required(formData, 'lastName'),
    company: optional(formData, 'company'),
    vatNumber: optional(formData, 'vatNumber'),
    fiscalCode: optional(formData, 'fiscalCode'),
    address: required(formData, 'address'),
    city: required(formData, 'city'),
    postalCode: required(formData, 'postalCode'),
    province: optional(formData, 'province'),
    country: (formData.get('country') as string) || 'IT',
    phone: optional(formData, 'phone'),
  }
}

async function requireUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return session.user.id
}

export async function updateUserInfo(formData: FormData) {
  const userId = await requireUserId()

  await updateUser(userId, {
    name: optional(formData, 'name'),
    phone: optional(formData, 'phone'),
    fiscalCode: optional(formData, 'fiscalCode'),
    company: optional(formData, 'company'),
    vatNumber: optional(formData, 'vatNumber'),
    pec: optional(formData, 'pec'),
    sdiCode: optional(formData, 'sdiCode'),
  })

  revalidatePath('/account')
  revalidatePath(PROFILE_PATH)
  redirect(`${PROFILE_PATH}?saved=1`)
}

export async function createAddress(formData: FormData) {
  const userId = await requireUserId()

  await addresses.createAddress(userId, parseAddressInput(formData))

  revalidatePath(PROFILE_PATH)
  redirect(PROFILE_PATH)
}

export async function updateAddress(formData: FormData) {
  const userId = await requireUserId()
  const id = formData.get('id') as string

  if (!(await addresses.getOwnedAddress(id, userId))) redirect(PROFILE_PATH)

  await addresses.updateAddress(id, userId, parseAddressInput(formData))

  revalidatePath(PROFILE_PATH)
  redirect(PROFILE_PATH)
}

export async function deleteAddress(formData: FormData) {
  const userId = await requireUserId()
  const id = formData.get('id') as string

  if (!(await addresses.getOwnedAddress(id, userId))) redirect(PROFILE_PATH)

  await addresses.deleteAddress(id)

  revalidatePath(PROFILE_PATH)
  redirect(PROFILE_PATH)
}

export async function setDefaultAddress(formData: FormData) {
  const userId = await requireUserId()
  const id = formData.get('id') as string

  if (!(await addresses.getOwnedAddress(id, userId))) return

  await addresses.makeDefault(id, userId)

  revalidatePath(PROFILE_PATH)
}
