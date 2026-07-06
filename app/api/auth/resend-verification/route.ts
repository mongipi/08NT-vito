import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { issueVerificationEmail } from '@/lib/verification'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email mancante' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  // Non riveliamo se l'account esiste, è già verificato o è solo OAuth
  if (user && !user.emailVerified && user.password) {
    await issueVerificationEmail(email, user.name)
  }

  return NextResponse.json({ ok: true })
}
