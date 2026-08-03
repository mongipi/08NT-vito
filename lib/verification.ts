import crypto from 'crypto'
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'
import {
  deleteVerificationToken,
  findVerificationToken,
  replaceVerificationToken,
} from '@/services/verification-tokens'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 // 24h
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60 // 1h
const RESET_PREFIX = 'reset:'

function newToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function issueVerificationEmail(email: string, name?: string | null) {
  const token = newToken()
  await replaceVerificationToken(email, token, new Date(Date.now() + TOKEN_TTL_MS))
  await sendVerificationEmail(email, name ?? null, token)
}

// Il reset password riusa la tabella VerificationToken con un identifier
// prefissato, per non introdurre un nuovo modello Prisma solo per questo.
export async function issuePasswordResetEmail(email: string, name?: string | null) {
  const token = newToken()
  await replaceVerificationToken(
    RESET_PREFIX + email,
    token,
    new Date(Date.now() + RESET_TOKEN_TTL_MS)
  )
  await sendPasswordResetEmail(email, name ?? null, token)
}

/**
 * Consuma un token una sola volta e restituisce l'email associata.
 * Il token viene eliminato anche quando è scaduto o del tipo sbagliato, così
 * non resta utilizzabile.
 */
async function consumeToken(token: string, expectReset: boolean): Promise<string | null> {
  const record = await findVerificationToken(token)
  const isResetToken = record?.identifier.startsWith(RESET_PREFIX) ?? false

  if (!record || isResetToken !== expectReset || record.expires < new Date()) {
    if (record) await deleteVerificationToken(token)
    return null
  }

  await deleteVerificationToken(token)
  return expectReset ? record.identifier.slice(RESET_PREFIX.length) : record.identifier
}

export async function consumePasswordResetToken(token: string): Promise<string | null> {
  return consumeToken(token, true)
}

/** Prima era reimplementato inline in app/api/auth/verify-email/route.ts. */
export async function consumeEmailVerificationToken(token: string): Promise<string | null> {
  return consumeToken(token, false)
}
