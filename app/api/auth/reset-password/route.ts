import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { consumePasswordResetToken } from '@/lib/verification'

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

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { email }, data: { password: hashedPassword } })

  return NextResponse.json({ ok: true })
}
