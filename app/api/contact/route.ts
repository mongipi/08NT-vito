import { NextResponse } from 'next/server'
import { sendContactNotification } from '@/lib/email'
import { translate } from '@/lib/i18n/data'
import type { Locale } from '@/contexts/LocaleContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let locale: Locale = 'it'
  try {
    const body = await request.json()
    locale = body?.locale === 'en' ? 'en' : 'it'
    const name = String(body?.name ?? '').trim().slice(0, 120)
    const email = String(body?.email ?? '').trim().toLowerCase().slice(0, 254)
    const subject = String(body?.subject ?? '').trim().slice(0, 160)
    const message = String(body?.message ?? '').trim().slice(0, 5000)

    if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 5) {
      return NextResponse.json(
        { ok: false, message: translate(locale, 'contact_field_error') },
        { status: 400 }
      )
    }

    await sendContactNotification({ name, email, subject, message })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('contact form email failed', error)
    return NextResponse.json(
      { ok: false, message: translate(locale, 'contact_send_error_generic') },
      { status: 500 }
    )
  }
}
