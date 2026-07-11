import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletterConfirmation } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NEWSLETTER_DISCOUNT_CODE = 'BENVENUTO5'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body?.email ?? '').trim().toLowerCase()
    const locale = String(body?.locale ?? 'it').slice(0, 8)
    const source = String(body?.source ?? 'site').slice(0, 32)

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, message: 'Inserisci una email valida.' }, { status: 400 })
    }

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        create: { email, locale, source },
        update: { locale, source, status: 'active' },
      })

      await prisma.discount.upsert({
        where: { code: NEWSLETTER_DISCOUNT_CODE },
        create: {
          code: NEWSLETTER_DISCOUNT_CODE,
          type: 'percent',
          value: 5,
          active: true,
          applicableTo: 'consumer',
        },
        update: {
          type: 'percent',
          value: 5,
          active: true,
          applicableTo: 'consumer',
        },
      })
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
