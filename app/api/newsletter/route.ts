import { NextResponse } from 'next/server'
import { sendNewsletterOptIn } from '@/lib/email'
import { issueNewsletterConfirmationToken } from '@/lib/verification'
import { subscribeToNewsletter } from '@/services/newsletter'
import { translate } from '@/lib/i18n/data'
import type { Locale } from '@/contexts/LocaleContext'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let email = ''
  let locale: Locale = 'it'
  try {
    const body = await request.json()
    email = String(body?.email ?? '')
      .trim()
      .toLowerCase()
    const rawLocale = String(body?.locale ?? 'it').slice(0, 8)
    locale = rawLocale === 'en' ? 'en' : 'it'
    const source = String(body?.source ?? 'site').slice(0, 32)
    const consent = body?.consent === true

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, message: translate(locale, 'newsletter_error_invalid_email') },
        { status: 400 }
      )
    }

    if (!consent) {
      return NextResponse.json(
        { ok: false, message: translate(locale, 'newsletter_error_consent_required') },
        { status: 400 }
      )
    }

    // Se il salvataggio non riesce, l'iscrizione non e' avvenuta: va detto,
    // invece di rispondere "confermata" come faceva la versione precedente.
    await subscribeToNewsletter(email, rawLocale, source)

    // Doppio consenso: il codice sconto arriva solo dopo la conferma, cosi'
    // iscrivere l'indirizzo di un altro non porta alcun vantaggio.
    const token = await issueNewsletterConfirmationToken(email)
    await sendNewsletterOptIn(email, token)

    return NextResponse.json({ ok: true, message: translate(locale, 'newsletter_success') })
  } catch (error) {
    console.error('Iscrizione newsletter fallita per', email, error)
    return NextResponse.json(
      { ok: false, message: translate(locale, 'newsletter_error') },
      { status: 500 }
    )
  }
}
