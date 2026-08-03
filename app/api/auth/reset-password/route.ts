import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/password'
import { consumePasswordResetToken } from '@/lib/verification'
import { setUserPassword } from '@/services/users'

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword } = await req.json()

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Le password non coincidono' }, { status: 400 })
  }

  const email = await consumePasswordResetToken(token)
  if (!email) {
    return NextResponse.json({ error: 'Link scaduto o non valido' }, { status: 400 })
  }

  await setUserPassword(email, await hashPassword(password))

  return NextResponse.json({ ok: true })
}
