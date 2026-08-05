import type { Metadata } from 'next'
import { getSettingsMap } from '@/lib/settings'
import { SuccessContent } from './SuccessContent'
import { finalizeStripePaymentById } from '@/lib/stripe-order-finalization'

export const metadata: Metadata = {
  title: 'Ordine confermato — 08 Natural Technology',
  robots: { index: false },
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderId?: string
    method?: string
    payment_intent?: string
    redirect_status?: string
  }>
}) {
  const [{ orderId, method, payment_intent: paymentIntent, redirect_status: redirectStatus }, settings] =
    await Promise.all([searchParams, getSettingsMap()])
  let confirmedOrderId = orderId

  if (paymentIntent && redirectStatus === 'succeeded') {
    try {
      confirmedOrderId = await finalizeStripePaymentById(paymentIntent) ?? undefined
    } catch (error) {
      console.error('Finalizzazione ordine Stripe dalla pagina successo fallita:', error)
    }
  }

  const iban = settings['IBAN_BONIFICO'] ?? 'IT00 X000 0000 0000 0000 0000 000'
  const intestatario = settings['INTESTATARIO_BONIFICO'] ?? 'VIPHARMA di Tatulli Vito & Co. S.A.S.'

  return <SuccessContent orderId={confirmedOrderId} method={method ?? 'stripe'} iban={iban} intestatario={intestatario} />
}
