'use server'

import Stripe from 'stripe'
import { auth } from '@/auth'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { calcSubtotal, calcDiscount, calcTotal } from '@/lib/cart'

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  vatNumber?: string
  fiscalCode?: string
  sdiCode?: string
  pec?: string
  docType?: 'fattura' | 'scontrino' | null
  address: string
  city: string
  postalCode: string
  province?: string
  country: string
  phone?: string
}

export async function createPaymentIntent(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  shippingAddress: ShippingAddress
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const session = await auth()
  if (!session?.user) throw new Error('Non autenticato')

  const subtotal = calcSubtotal(items)
  const discountAmount = calcDiscount(subtotal, coupon)
  const total = calcTotal(subtotal, discountAmount)

  const amountInCents = Math.round(total * 100)
  if (amountInCents < 50) throw new Error('Importo minimo €0.50')

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'eur',
    metadata: {
      userId: session.user.id,
      subtotal: String(subtotal),
      discountAmount: String(discountAmount),
      couponCode: coupon?.code ?? '',
      items: JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          unitPrice: i.price,
          qty: i.qty,
        }))
      ),
      shippingAddress: JSON.stringify(shippingAddress),
    },
    ...(session.user.stripeCustomerId ? { customer: session.user.stripeCustomerId } : {}),
  })

  return { clientSecret: paymentIntent.client_secret }
}
