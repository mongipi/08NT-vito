import type { Role } from '@prisma/client'

/**
 * Ruoli utente, derivati dall'enum Prisma.
 * Sostituisce i cast `as { role?: string }` sparsi nel codice.
 */

export const ROLE_LABELS: Record<Role, string> = {
  consumer: 'Consumer',
  b2b: 'B2B',
  admin: 'Admin',
}

export const ROLES = Object.keys(ROLE_LABELS) as Role[]

/**
 * Vero se il ruolo e' amministratore.
 *
 * Vive qui e non in lib/auth/guards perche' il middleware gira nel runtime
 * Edge: importarla da guards trascinava nel bundle @/auth con l'adapter
 * Prisma e bcrypt, facendo superare il limite di 1 MB.
 */
export function isAdmin(role: unknown): boolean {
  return role === 'admin'
}

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && value in ROLE_LABELS
}

/** Ruolo applicabile agli sconti: gli admin acquistano come consumer. */
export function toCustomerRole(role: unknown): 'consumer' | 'b2b' {
  return role === 'b2b' ? 'b2b' : 'consumer'
}

export type { Role }
