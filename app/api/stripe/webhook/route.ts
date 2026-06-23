import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

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
      const items = JSON.parse(meta.items ?? '[]')

      await prisma.order.create({
        data: {
          userId: meta.userId,
          items,
          subtotal: Number(meta.subtotal),
          discountAmount: Number(meta.discountAmount ?? 0),
          total: pi.amount / 100,
          couponCode: meta.couponCode || null,
          status: 'paid',
          stripePaymentIntentId: pi.id,
          shippingAddress: JSON.parse(meta.shippingAddress ?? '{}'),
        },
      })

      for (const item of items) {
        await prisma.product.update({
          where: { id: item.product },
          data: { stock: { decrement: item.qty } },
        })
      }

      if (meta.couponCode) {
        await prisma.discount.update({
          where: { code: meta.couponCode.toUpperCase() },
          data: { usedCount: { increment: 1 } },
        })
      }
    } catch (err) {
      console.error('Webhook handler error:', err)
      return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
