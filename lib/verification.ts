import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email'

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 // 24h
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60 // 1h
const RESET_PREFIX = 'reset:'

export async function issueVerificationEmail(email: string, name?: string | null) {
  const token = crypto.randomBytes(32).toString('hex')

  await prisma.verificationToken.deleteMany({ where: { identifier: email } })
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
  })

  await sendVerificationEmail(email, name ?? null, token)
}

// Il reset password riusa la tabella VerificationToken con un identifier
// prefissato, per non introdurre un nuovo modello Prisma solo per questo.
export async function issuePasswordResetEmail(email: string, name?: string | null) {
  const token = crypto.randomBytes(32).toString('hex')
  const identifier = RESET_PREFIX + email

  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({
    data: { identifier, token, expires: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
  })

  await sendPasswordResetEmail(email, name ?? null, token)
}

export async function consumePasswordResetToken(token: string): Promise<string | null> {
  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record || !record.identifier.startsWith(RESET_PREFIX) || record.expires < new Date()) {
    if (record) await prisma.verificationToken.delete({ where: { token } }).catch(() => {})
    return null
  }

  await prisma.verificationToken.delete({ where: { token } })
  return record.identifier.slice(RESET_PREFIX.length)
}
