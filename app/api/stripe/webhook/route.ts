import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { finalizeSucceededStripePayment } from '@/lib/stripe-order-finalization'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    try {
      await finalizeSucceededStripePayment(event.data.object as Stripe.PaymentIntent)
    } catch (error) {
      console.error('Stripe webhook handler error:', error)
      return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
