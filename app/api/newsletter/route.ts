import { NextResponse } from 'next/server'
import { sendNewsletterConfirmation } from '@/lib/email'
import {
  NEWSLETTER_DISCOUNT_CODE,
  NEWSLETTER_DISCOUNT_DATA,
} from '@/lib/domain/newsletter-discount'
import { subscribeToNewsletter } from '@/services/newsletter'
import { upsertDiscount } from '@/services/discounts'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body?.email ?? '')
      .trim()
      .toLowerCase()
    const locale = String(body?.locale ?? 'it').slice(0, 8)
    const source = String(body?.source ?? 'site').slice(0, 32)

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'Inserisci una email valida.' },
        { status: 400 }
      )
    }

    try {
      await subscribeToNewsletter(email, locale, source)
      await upsertDiscount(
        NEWSLETTER_DISCOUNT_CODE,
        { code: NEWSLETTER_DISCOUNT_CODE, ...NEWSLETTER_DISCOUNT_DATA },
        { ...NEWSLETTER_DISCOUNT_DATA }
      )
    } catch (error) {
      console.error('newsletter persistence failed', error)
    }

    let emailSent = true
    try {
      await sendNewsletterConfirmation(email, NEWSLETTER_DISCOUNT_CODE)
    } catch (error) {
      emailSent = false
      console.error('newsletter confirmation email failed', error)
    }

    return NextResponse.json({
      ok: true,
      message: emailSent
        ? 'Iscrizione confermata. Ti abbiamo inviato il codice extra sconto 5%.'
        : `Iscrizione confermata. Il tuo codice extra sconto 5% e ${NEWSLETTER_DISCOUNT_CODE}.`,
    })
  } catch (error) {
    console.error('newsletter signup failed', error)
    return NextResponse.json(
      { ok: false, message: 'Newsletter non disponibile al momento. Riprova tra poco.' },
      { status: 500 }
    )
  }
}
