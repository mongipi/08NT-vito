'use server'

import Stripe from 'stripe'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { calcSubtotal, calcDiscount, calcTotal, COD_SURCHARGE } from '@/lib/cart'


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

export async function createDirectOrder(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  shippingAddress: ShippingAddress,
  paymentMethod: 'bonifico' | 'contrassegno'
) {
  const session = await auth()
  if (!session?.user) throw new Error('Non autenticato')

  const subtotal = calcSubtotal(items)
  const discountAmount = calcDiscount(subtotal, coupon)
  const base = calcTotal(subtotal, discountAmount)
  const codSurcharge = paymentMethod === 'contrassegno' ? COD_SURCHARGE : 0
  const total = base + codSurcharge

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      subtotal,
      discountAmount,
      total,
      couponCode: coupon?.code ?? null,
      paymentMethod,
      codSurcharge,
      status: 'pending',
      items: {
        create: items.map((i) => ({
          slug:      i.slug ?? null,
          name:      i.name,
          unitPrice: i.price,
          qty:       i.qty,
        })),
      },
      shippingAddress: {
        create: {
          firstName:  shippingAddress.firstName,
          lastName:   shippingAddress.lastName,
          company:    shippingAddress.company    ?? null,
          vatNumber:  shippingAddress.vatNumber  ?? null,
          fiscalCode: shippingAddress.fiscalCode ?? null,
          sdiCode:    shippingAddress.sdiCode    ?? null,
          pec:        shippingAddress.pec        ?? null,
          docType:    shippingAddress.docType    ?? null,
          address:    shippingAddress.address,
          city:       shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          province:   shippingAddress.province   ?? null,
          country:    shippingAddress.country,
          phone:      shippingAddress.phone      ?? null,
        },
      },
    },
  })

  redirect(`/checkout/successo?orderId=${order.id}&method=${paymentMethod}`)
}
