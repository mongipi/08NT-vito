import { NextRequest, NextResponse } from 'next/server'
import { consumeEmailVerificationToken } from '@/lib/verification'
import { markEmailVerified } from '@/services/users'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const loginUrl = new URL('/login', req.url)

  if (!token) {
    loginUrl.searchParams.set('verify', 'invalid')
    return NextResponse.redirect(loginUrl)
  }

  const email = await consumeEmailVerificationToken(token)
  if (!email) {
    loginUrl.searchParams.set('verify', 'expired')
    return NextResponse.redirect(loginUrl)
  }

  await markEmailVerified(email)

  loginUrl.searchParams.set('verify', 'success')
  return NextResponse.redirect(loginUrl)
}
