import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email già registrata' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'consumer' },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
