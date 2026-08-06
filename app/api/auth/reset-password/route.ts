import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/password'
import { consumePasswordResetToken } from '@/lib/verification'
import { setUserPassword } from '@/services/users'
import { translate } from '@/lib/i18n/data'

export async function POST(req: NextRequest) {
  const { token, password, confirmPassword, locale: rawLocale } = await req.json()
  const locale = rawLocale === 'en' ? 'en' : 'it'

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: translate(locale, 'auth_error_invalid_data') }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: translate(locale, 'auth_error_password_mismatch') }, { status: 400 })
  }

  const email = await consumePasswordResetToken(token)
  if (!email) {
    return NextResponse.json({ error: translate(locale, 'auth_error_link_expired') }, { status: 400 })
  }

  await setUserPassword(email, await hashPassword(password))

  return NextResponse.json({ ok: true })
}
