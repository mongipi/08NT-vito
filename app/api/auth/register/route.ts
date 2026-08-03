import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/password'
import { issueVerificationEmail } from '@/lib/verification'
import { createUser, getUserByEmail } from '@/services/users'

export async function POST(req: NextRequest) {
  const { name, email, password, confirmPassword } = await req.json()

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Le password non coincidono' }, { status: 400 })
  }

  const existing = await getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: 'Email già registrata' }, { status: 409 })
  }

  await createUser({ name, email, password: await hashPassword(password), role: 'consumer' })

  await issueVerificationEmail(email, name)

  return NextResponse.json({ ok: true }, { status: 201 })
}
