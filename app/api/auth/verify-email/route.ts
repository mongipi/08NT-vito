import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const loginUrl = new URL('/login', req.url)

  if (!token) {
    loginUrl.searchParams.set('verify', 'invalid')
    return NextResponse.redirect(loginUrl)
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record || record.expires < new Date()) {
    if (record) await prisma.verificationToken.delete({ where: { token } }).catch(() => {})
    loginUrl.searchParams.set('verify', 'expired')
    return NextResponse.redirect(loginUrl)
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  })
  await prisma.verificationToken.delete({ where: { token } })

  loginUrl.searchParams.set('verify', 'success')
  return NextResponse.redirect(loginUrl)
}
