import { NextRequest, NextResponse } from 'next/server'
import { consumeEmailVerificationToken } from '@/lib/verification'
import { markEmailVerified } from '@/services/users'
import { confirmPendingSubscription } from '@/services/newsletter'
import { ensureDiscountExists } from '@/services/discounts'
import { sendNewsletterConfirmation } from '@/lib/email'
import {
  NEWSLETTER_DISCOUNT_CODE,
  NEWSLETTER_DISCOUNT_DATA,
} from '@/lib/domain/newsletter-discount'

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

  // Chi in registrazione aveva chiesto la newsletter viene confermato qui:
  // verificare l'indirizzo dell'account dimostra la proprieta' dell'email.
  try {
    const subscriber = await confirmPendingSubscription(email)
    if (subscriber) {
      await ensureDiscountExists(NEWSLETTER_DISCOUNT_CODE, {
        code: NEWSLETTER_DISCOUNT_CODE,
        ...NEWSLETTER_DISCOUNT_DATA,
      })
      await sendNewsletterConfirmation(email, NEWSLETTER_DISCOUNT_CODE, subscriber.unsubscribeToken)
    }
  } catch (error) {
    console.error('Conferma newsletter da verifica account fallita per', email, error)
  }

  loginUrl.searchParams.set('verify', 'success')
  return NextResponse.redirect(loginUrl)
}
