import { prisma } from '@/lib/prisma'
import { normalizeEmail } from '@/lib/domain/email'
import type { Prisma, Role, User } from '@prisma/client'

/**
 * Accesso in lettura/scrittura agli utenti.
 * Unico punto in cui pagine, route API e azioni ottengono utenti.
 */

/** Campi anagrafici precompilati in checkout. */
const checkoutProfileSelect = {
  name: true,
  phone: true,
  fiscalCode: true,
  company: true,
  vatNumber: true,
  pec: true,
  sdiCode: true,
} as const

export type CheckoutProfile = Prisma.UserGetPayload<{ select: typeof checkoutProfileSelect }>

const userWithRecentOrdersInclude = {
  orders: { orderBy: { createdAt: 'desc' as const }, take: 5 },
} as const

export type UserWithRecentOrders = Prisma.UserGetPayload<{
  include: typeof userWithRecentOrdersInclude
}>

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } })
}

export async function getUserWithRecentOrders(id: string): Promise<UserWithRecentOrders | null> {
  return prisma.user.findUnique({ where: { id }, include: userWithRecentOrdersInclude })
}

/** L'indirizzo viene normalizzato: la ricerca non deve dipendere da maiuscole e minuscole. */
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email: normalizeEmail(email) } })
}

export async function getCheckoutProfile(userId: string): Promise<CheckoutProfile | null> {
  return prisma.user.findUnique({ where: { id: userId }, select: checkoutProfileSelect })
}

export async function getUserContact(
  userId: string
): Promise<{ name: string | null; email: string } | null> {
  return prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
}

/** Ricerca utenti per l'elenco admin: nome, email, azienda, partita IVA. */
export async function searchUsers(query?: string): Promise<User[]> {
  const trimmed = query?.trim()
  const where: Prisma.UserWhereInput | undefined = trimmed
    ? {
        OR: [
          { name: { contains: trimmed, mode: 'insensitive' } },
          { email: { contains: trimmed, mode: 'insensitive' } },
          { company: { contains: trimmed, mode: 'insensitive' } },
          { vatNumber: { contains: trimmed, mode: 'insensitive' } },
        ],
      }
    : undefined

  return prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } })
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data: { ...data, email: normalizeEmail(data.email) } })
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
  return prisma.user.update({ where: { id }, data })
}

export async function setUserRole(id: string, role: Role): Promise<User> {
  return prisma.user.update({ where: { id }, data: { role } })
}

export async function setUserPassword(email: string, passwordHash: string): Promise<void> {
  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { password: passwordHash },
  })
}

export async function markEmailVerified(email: string): Promise<void> {
  await prisma.user.update({
    where: { email: normalizeEmail(email) },
    data: { emailVerified: new Date() },
  })
}
