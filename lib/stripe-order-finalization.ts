import Stripe from 'stripe'
import type { ShippingAddress } from '@/lib/actions/checkout'
import { saveCheckoutDataToProfile, createAccountFromCheckout } from '@/lib/actions/checkout'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'
import { unchunkMetadataValue } from '@/lib/stripe-metadata'
import {
  claimPendingOrderAsPaid,
  createOrder,
  findOrderByPaymentIntent,
  getCompletedOrderOrThrow,
} from '@/services/orders'
import { incrementDiscountUsage } from '@/services/discounts'
import { decrementStock } from '@/services/inventory'

interface StripeOrderItem {
  slug?: string
  name: string
  unitPrice: number
  qty: number
  variantId?: string | null
  variantLabel?: string | null
}

export async function finalizeStripePaymentById(paymentIntentId: string) {
  if (!paymentIntentId.startsWith('pi_')) return null
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  if (paymentIntent.status !== 'succeeded') return null
  return finalizeSucceededStripePayment(paymentIntent)
}

export async function finalizeSucceededStripePayment(paymentIntent: Stripe.PaymentIntent) {
  const meta = paymentIntent.metadata
  const items = parseItems(meta)
  const address = parseAddress(meta)

  const existing = await findOrderByPaymentIntent(paymentIntent.id)
  let orderId: string

  if (existing) {
    // Webhook e pagina di successo possono arrivare entrambi: solo chi riesce a
    // rivendicare la transizione pending → paid prosegue con email e scorte.
    if (existing.status === 'paid') return existing.id
    if (!(await claimPendingOrderAsPaid(existing.id))) return existing.id
    orderId = existing.id
  } else {
    orderId = (await createPaidOrderFromMetadata(paymentIntent, items, address)).id
  }

  const completedOrder = await getCompletedOrderOrThrow(orderId)
  const shippingAddress = completedOrder.shippingAddress
  if (!shippingAddress) throw new Error('Indirizzo di spedizione mancante per ordine Stripe')

  const customerName =
    completedOrder.user?.name ?? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
  const customerEmail = completedOrder.user?.email ?? completedOrder.guestEmail ?? ''

  const emailData = {
    orderId: completedOrder.id,
    paymentMethod: 'stripe',
    total: completedOrder.total,
    subtotal: completedOrder.subtotal,
    discountAmount: completedOrder.discountAmount,
    couponCode: completedOrder.couponCode,
    codSurcharge: 0,
    customerName,
    customerEmail,
    items: completedOrder.items.map((item) => ({
      name: item.name,
      qty: item.qty,
      unitPrice: item.unitPrice,
    })),
    address: {
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      province: shippingAddress.province,
      country: shippingAddress.country,
      phone: shippingAddress.phone,
    },
    deliveryType: completedOrder.deliveryType ?? 'home',
    pickupCarrier: completedOrder.pickupCarrier ?? null,
    pickupPointCode: completedOrder.pickupPointCode ?? null,
    pickupPointAddress: completedOrder.pickupPointAddress ?? null,
  }

  await Promise.all([
    decrementStock(
      items
        .filter((item) => item.variantId || item.slug)
        .map((item) => ({
          productId: '',
          slug: item.slug ?? '',
          name: item.name,
          price: Number(item.unitPrice),
          qty: Number(item.qty),
          variantId: item.variantId ?? undefined,
        }))
    ),
    completedOrder.couponCode
      ? incrementDiscountUsage(completedOrder.couponCode.toUpperCase())
      : Promise.resolve(),
    customerEmail
      ? sendOrderConfirmation(emailData).catch((error) =>
          console.error('Email conferma Stripe fallita:', error)
        )
      : Promise.resolve(),
    sendAdminOrderNotification(emailData).catch((error) =>
      console.error('Email admin Stripe fallita:', error)
    ),
    meta.saveForNextTime === 'true' && meta.userId
      ? saveCheckoutDataToProfile(meta.userId, address).catch((error) =>
          console.error('Salvataggio profilo Stripe fallito:', error)
        )
      : Promise.resolve(),
    meta.createAccount === 'true' && !meta.userId && customerEmail && meta.guestPasswordHash
      ? createAccountFromCheckout(customerEmail, {
          ...address,
          guestPasswordHash: meta.guestPasswordHash,
        }).catch((error) => console.error('Creazione account Stripe fallita:', error))
      : Promise.resolve(),
  ])

  return completedOrder.id
}

function parseItems(metadata: Stripe.Metadata): StripeOrderItem[] {
  const value = unchunkMetadataValue(metadata, 'items')
  const items = JSON.parse(value || '[]') as StripeOrderItem[]
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Prodotti mancanti nei metadata Stripe')
  }
  return items
}

function parseAddress(metadata: Stripe.Metadata): ShippingAddress {
  const value = unchunkMetadataValue(metadata, 'shippingAddress')
  const address = JSON.parse(value || '{}') as ShippingAddress
  if (
    !address.firstName ||
    !address.lastName ||
    !address.address ||
    !address.city ||
    !address.postalCode
  ) {
    throw new Error('Indirizzo incompleto nei metadata Stripe')
  }
  return address
}

async function createPaidOrderFromMetadata(
  paymentIntent: Stripe.PaymentIntent,
  items: StripeOrderItem[],
  address: ShippingAddress
) {
  const meta = paymentIntent.metadata
  return createOrder({
    userId: meta.userId || undefined,
    guestEmail: meta.guestEmail || undefined,
    subtotal: Number(meta.subtotal ?? 0),
    discountAmount: Number(meta.discountAmount ?? 0),
    total: paymentIntent.amount / 100,
    couponCode: meta.couponCode || null,
    status: 'paid',
    paymentMethod: 'stripe',
    stripePaymentIntentId: paymentIntent.id,
    shippingCost: Number(meta.shippingCost ?? 0),
    foreignSurcharge: Number(meta.foreignSurcharge ?? 0),
    freeShipping: meta.freeShipping === 'true',
    shippingNotes: address.shippingNotes ?? null,
    deliveryType: address.deliveryType ?? 'home',
    pickupCarrier: address.pickupCarrier ?? null,
    pickupPointCode: address.pickupPointCode ?? null,
    pickupPointAddress: address.pickupPointAddress ?? null,
    ...(address.billingDifferent && address.billingAddress
      ? {
          billingAddress: {
            create: {
              firstName: address.billingFirstName ?? address.firstName,
              lastName: address.billingLastName ?? address.lastName,
              company: address.billingCompany ?? null,
              vatNumber: address.billingVatNumber ?? null,
              fiscalCode: address.billingFiscalCode ?? null,
              address: address.billingAddress,
              city: address.billingCity ?? '',
              postalCode: address.billingPostalCode ?? '',
              province: address.billingProvince ?? null,
              country: address.billingCountry ?? 'IT',
            },
          },
        }
      : {}),
    items: {
      create: items.map((item) => ({
        slug: item.slug ?? null,
        name: item.name,
        variantLabel: item.variantLabel ?? null,
        unitPrice: Number(item.unitPrice),
        qty: Number(item.qty),
      })),
    },
    shippingAddress: {
      create: {
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company ?? null,
        vatNumber: address.vatNumber ?? null,
        fiscalCode: address.fiscalCode ?? null,
        sdiCode: address.sdiCode ?? null,
        pec: address.pec ?? null,
        docType: address.docType ?? null,
        address: address.address,
        city: address.city,
        postalCode: address.postalCode,
        province: address.province ?? null,
        country: address.country ?? 'IT',
        phone: address.phone ?? null,
      },
    },
  })
}
