import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import type { ShippingAddress } from '@/lib/actions/checkout'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const meta = pi.metadata

    try {
      const items: { slug?: string; name: string; unitPrice: number; qty: number }[] =
        JSON.parse(meta.items ?? '[]')
      const addr: ShippingAddress = JSON.parse(meta.shippingAddress ?? '{}')

      await prisma.order.create({
        data: {
          userId: meta.userId,
          subtotal: Number(meta.subtotal),
          discountAmount: Number(meta.discountAmount ?? 0),
          total: pi.amount / 100,
          couponCode: meta.couponCode || null,
          status: 'paid',
          stripePaymentIntentId: pi.id,
          items: {
            create: items.map((i) => ({
              slug: i.slug ?? null,
              name: i.name,
              unitPrice: Number(i.unitPrice),
              qty: Number(i.qty),
            })),
          },
          shippingAddress: {
            create: {
              firstName: addr.firstName,
              lastName: addr.lastName,
              company: addr.company ?? null,
              vatNumber: addr.vatNumber ?? null,
              fiscalCode: addr.fiscalCode ?? null,
              sdiCode: addr.sdiCode ?? null,
              pec: addr.pec ?? null,
              docType: addr.docType ?? null,
              address: addr.address,
              city: addr.city,
              postalCode: addr.postalCode,
              province: addr.province ?? null,
              country: addr.country ?? 'IT',
              phone: addr.phone ?? null,
            },
          },
        },
      })

      await Promise.all([
        ...items
          .filter((i) => i.slug)
          .map((i) =>
            prisma.product.update({
              where: { slug: i.slug! },
              data: { stock: { decrement: i.qty } },
            })
          ),
        meta.couponCode
          ? prisma.discount.update({
              where: { code: meta.couponCode.toUpperCase() },
              data: { usedCount: { increment: 1 } },
            })
          : Promise.resolve(),
      ])
    } catch (err) {
      console.error('Webhook handler error:', err)
      return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
