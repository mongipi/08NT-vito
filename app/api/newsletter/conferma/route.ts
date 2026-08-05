import { NextRequest, NextResponse } from 'next/server'
import { sendNewsletterConfirmation } from '@/lib/email'
import {
  NEWSLETTER_DISCOUNT_CODE,
  NEWSLETTER_DISCOUNT_DATA,
} from '@/lib/domain/newsletter-discount'
import { consumeNewsletterToken } from '@/lib/verification'
import { confirmSubscription } from '@/services/newsletter'
import { ensureDiscountExists } from '@/services/discounts'

/**
 * Secondo passo del doppio consenso: il link ricevuto per posta.
 * Solo qui l'iscrizione diventa attiva e viene comunicato il codice sconto.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const redirect = (esito: string) => {
    const url = new URL('/newsletter', req.url)
    url.searchParams.set('esito', esito)
    return NextResponse.redirect(url)
  }

  if (!token) return redirect('non-valida')

  const email = await consumeNewsletterToken(token)
  if (!email) return redirect('scaduta')

  const subscriber = await confirmSubscription(email)
  if (!subscriber) return redirect('non-valida')

  try {
    await ensureDiscountExists(NEWSLETTER_DISCOUNT_CODE, {
      code: NEWSLETTER_DISCOUNT_CODE,
      ...NEWSLETTER_DISCOUNT_DATA,
    })
    await sendNewsletterConfirmation(
      email,
      NEWSLETTER_DISCOUNT_CODE,
      subscriber.unsubscribeToken
    )
  } catch (error) {
    // L'iscrizione e' comunque valida: l'email col codice si puo' reinviare.
    console.error('Invio codice sconto newsletter fallito per', email, error)
    return redirect('confermata-senza-email')
  }

  return redirect('confermata')
}
