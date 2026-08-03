import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/services/users'
import { issuePasswordResetEmail } from '@/lib/verification'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: 'Email mancante' }, { status: 400 })
  }

  const user = await getUserByEmail(email)
  // Non riveliamo se l'account esiste o è solo OAuth
  if (user?.password) {
    await issuePasswordResetEmail(email, user.name)
  }

  return NextResponse.json({ ok: true })
}
