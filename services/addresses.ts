import { prisma } from '@/lib/prisma'
import type { UserAddress } from '@prisma/client'

/**
 * Indirizzi della rubrica utente.
 * Racchiude anche le due regole che prima erano ricopiate in ogni azione:
 * la verifica di proprietà e l'unicità dell'indirizzo predefinito.
 */

/** Campi indirizzo scrivibili, comuni a creazione e modifica. */
export interface AddressInput {
  label: string | null
  isDefault: boolean
  firstName: string
  lastName: string
  company: string | null
  vatNumber: string | null
  fiscalCode: string | null
  address: string
  city: string
  postalCode: string
  province: string | null
  country: string
  phone: string | null
}

export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
}

export async function getDefaultAddress(userId: string): Promise<UserAddress | null> {
  return prisma.userAddress.findFirst({ where: { userId, isDefault: true } })
}

/** Restituisce l'indirizzo solo se appartiene all'utente, altrimenti null. */
export async function getOwnedAddress(id: string, userId: string): Promise<UserAddress | null> {
  const address = await prisma.userAddress.findUnique({ where: { id } })
  if (!address || address.userId !== userId) return null
  return address
}

/** Azzera il flag predefinito su tutti gli indirizzi dell'utente. */
async function clearDefault(userId: string): Promise<void> {
  await prisma.userAddress.updateMany({ where: { userId }, data: { isDefault: false } })
}

export async function createAddress(userId: string, input: AddressInput): Promise<UserAddress> {
  if (input.isDefault) await clearDefault(userId)
  return prisma.userAddress.create({ data: { ...input, userId } })
}

export async function updateAddress(
  id: string,
  userId: string,
  input: AddressInput
): Promise<UserAddress> {
  if (input.isDefault) await clearDefault(userId)
  return prisma.userAddress.update({ where: { id }, data: input })
}

export async function deleteAddress(id: string): Promise<void> {
  await prisma.userAddress.delete({ where: { id } })
}

export async function makeDefault(id: string, userId: string): Promise<void> {
  await clearDefault(userId)
  await prisma.userAddress.update({ where: { id }, data: { isDefault: true } })
}

/**
 * Crea o aggiorna l'indirizzo predefinito dell'utente.
 * Usato dal checkout quando si sceglie "salva per la prossima volta".
 */
export async function upsertDefaultAddress(userId: string, input: AddressInput): Promise<void> {
  const existing = await getDefaultAddress(userId)
  if (existing) {
    await prisma.userAddress.update({
      where: { id: existing.id },
      data: { ...input, isDefault: true },
    })
    return
  }
  await prisma.userAddress.create({ data: { ...input, userId, isDefault: true } })
}
