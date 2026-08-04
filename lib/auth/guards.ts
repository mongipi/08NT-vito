import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { isAdmin, type Role } from '@/lib/domain/roles'

/**
 * Controlli di accesso lato server.
 * Il confronto `(session.user as { role?: string }).role !== 'admin'` era
 * ricopiato in middleware, layout admin e azione impostazioni.
 */

/** Utente autenticato, altrimenti redirect al login. */
export async function requireUser() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return session.user
}

/** Utente amministratore, altrimenti redirect al login. */
export async function requireAdmin() {
  const user = await requireUser()
  if (!isAdmin((user as { role?: Role }).role)) redirect('/login')
  return user
}
