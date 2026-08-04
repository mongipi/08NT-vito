import { prisma } from '@/lib/prisma'
import type { VerificationToken } from '@prisma/client'

/** Token di verifica email e reset password. Unico accesso a prisma.verificationToken. */

export async function findVerificationToken(token: string): Promise<VerificationToken | null> {
  return prisma.verificationToken.findUnique({ where: { token } })
}

export async function deleteVerificationToken(token: string): Promise<void> {
  await prisma.verificationToken.delete({ where: { token } }).catch(() => {})
}

/** Sostituisce eventuali token pendenti per lo stesso identificatore. */
export async function replaceVerificationToken(
  identifier: string,
  token: string,
  expires: Date
): Promise<void> {
  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({ data: { identifier, token, expires } })
}
