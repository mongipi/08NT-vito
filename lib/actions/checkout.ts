'use server'

import Stripe from 'stripe'
import { auth } from '@/auth'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { calcSubtotal, calcDiscount, calcTotal } from '@/lib/cart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface ShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  province: string
  country: string
  phone?: string
}

export async function createPaymentIntent(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  shippingAddress: ShippingAddress
) {
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
          product: i.productId,
          productName: i.name,
          qty: i.qty,
          unitPrice: i.price,
        }))
      ),
      shippingAddress: JSON.stringify(shippingAddress),
    },
    ...(session.user.stripeCustomerId ? { customer: session.user.stripeCustomerId } : {}),
  })

  return { clientSecret: paymentIntent.client_secret }
}
