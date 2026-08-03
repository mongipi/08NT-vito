'use server'

import Stripe from 'stripe'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { computeOrderTotals } from '@/lib/domain/pricing'
import { getPricingConfig } from '@/lib/domain/pricing-config'
import { buildOrderCreateData, type OrderLineInput } from '@/lib/domain/order'
import { buildOrderEmailPayload } from '@/lib/domain/order-email'
import { createOrder, getOrderForEmail } from '@/services/orders'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'
import { issueVerificationEmail } from '@/lib/verification'
import { chunkMetadataValue } from '@/lib/stripe-metadata'
import { createUser, getUserByEmail, getUserContact, updateUser } from '@/services/users'
import { createAddress, upsertDefaultAddress, type AddressInput } from '@/services/addresses'
import { decrementStock } from '@/services/inventory'
import { hashPassword } from '@/lib/auth/password'
import type { ShippingAddress } from '@/types/checkout'

const STRIPE_EXCLUDED_PAYMENT_METHOD_TYPES: Stripe.PaymentIntentCreateParams.ExcludedPaymentMethodType[] =
  ['amazon_pay', 'eps']

// Il tipo vive in types/checkout.ts: e' usato anche dal dominio e dal client,
// che non devono dipendere da un modulo 'use server'.
export type { ShippingAddress }

/** Righe d'ordine a partire dal carrello. */
function toOrderLines(items: CartItem[]): OrderLineInput[] {
  return items.map((item) => ({
    slug: item.slug,
    name: item.name,
    variantLabel: item.variantLabel,
    unitPrice: item.price,
    qty: item.qty,
  }))
}

export async function createPaymentIntent(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  shippingAddress: ShippingAddress
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const session = await auth()

  // I totali si calcolano qui, non si accettano dal client: spedizione e
  // supplementi sarebbero altrimenti manipolabili dal browser.
  const totals = computeOrderTotals(
    { items, coupon, country: shippingAddress.country, paymentMethod: 'stripe' },
    await getPricingConfig()
  )
  const { subtotal, discountAmount, total } = totals

  const amountInCents = Math.round(total * 100)
  if (amountInCents < 50) throw new Error('Importo minimo €0.50')

  const itemsJson = JSON.stringify(
    items.map((i) => ({
      productId: i.productId,
      slug: i.slug,
      name: i.name,
      unitPrice: i.price,
      qty: i.qty,
      variantId: i.variantId ?? null,
      variantLabel: i.variantLabel ?? null,
    }))
  )

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
    excluded_payment_method_types: STRIPE_EXCLUDED_PAYMENT_METHOD_TYPES,
    metadata: {
      userId: session?.user?.id ?? '',
      guestEmail: shippingAddress.guestEmail ?? '',
      createAccount: String(shippingAddress.createAccount ?? false),
      guestPasswordHash: shippingAddress.guestPasswordHash ?? '',
      subtotal: String(subtotal),
      discountAmount: String(discountAmount),
      shippingCost: String(totals.shippingCost),
      foreignSurcharge: String(totals.foreignSurcharge),
      freeShipping: String(totals.freeShipping),
      saveForNextTime: String(shippingAddress.saveForNextTime ?? false),
      couponCode: coupon?.code ?? '',
      // Stripe limita ogni valore di metadata a 500 caratteri: items e shippingAddress
      // vanno spezzati su più chiavi (vedi lib/stripe-metadata.ts).
      ...chunkMetadataValue('items', itemsJson),
      ...chunkMetadataValue('shippingAddress', JSON.stringify(shippingAddress)),
    },
    ...(session?.user?.stripeCustomerId ? { customer: session.user.stripeCustomerId } : {}),
  })

  let order
  try {
    order = await createOrder(
      buildOrderCreateData({
        userId: session?.user?.id,
        guestEmail: session?.user ? undefined : shippingAddress.guestEmail,
        status: 'pending',
        paymentMethod: 'stripe',
        stripePaymentIntentId: paymentIntent.id,
        couponCode: coupon?.code,
        totals,
        address: shippingAddress,
        lines: toOrderLines(items),
      })
    )
  } catch (error) {
    await stripe.paymentIntents.cancel(paymentIntent.id).catch(() => undefined)
    throw error
  }

  await stripe.paymentIntents
    .update(paymentIntent.id, {
      metadata: { orderId: order.id },
    })
    .catch((error) => {
      // The order can still be matched through stripePaymentIntentId. Do not
      // block payment if this optional metadata enrichment is unavailable.
      console.error('Aggiornamento metadata ordine Stripe fallito:', error)
    })

  return { clientSecret: paymentIntent.client_secret, orderId: order.id }
}

export async function createDirectOrder(
  items: CartItem[],
  coupon: AppliedCoupon | null,
  shippingAddress: ShippingAddress,
  paymentMethod: 'bonifico' | 'contrassegno'
) {
  const session = await auth()

  // Stessa regola del percorso Stripe: i totali li decide il server.
  const totals = computeOrderTotals(
    { items, coupon, country: shippingAddress.country, paymentMethod },
    await getPricingConfig()
  )
  const { subtotal, discountAmount, codSurcharge, total } = totals

  const order = await createOrder(
    buildOrderCreateData({
      userId: session?.user?.id,
      guestEmail: session?.user ? undefined : shippingAddress.guestEmail,
      status: 'pending',
      paymentMethod,
      couponCode: coupon?.code,
      totals,
      address: shippingAddress,
      lines: toOrderLines(items),
    })
  )

  // Bonifico/contrassegno non hanno un webhook di conferma pagamento: le scorte
  // si riservano subito alla creazione dell'ordine, a differenza di Stripe che
  // le scala solo a pagamento riuscito.
  await decrementStock(items)

  const user = session?.user?.id ? await getUserContact(session.user.id) : null

  if (shippingAddress.saveForNextTime && session?.user?.id) {
    await saveCheckoutDataToProfile(session.user.id, shippingAddress)
  }

  const customerName =
    user?.name ?? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
  const customerEmail = user?.email ?? shippingAddress.guestEmail ?? ''

  if (
    !session?.user &&
    shippingAddress.createAccount &&
    shippingAddress.guestPasswordHash &&
    customerEmail
  ) {
    await createAccountFromCheckout(customerEmail, shippingAddress).catch((e) =>
      console.error('Create account failed:', e)
    )
  }

  // Il payload email si ricava dall'ordine appena salvato, così le email
  // riflettono esattamente ciò che è a database.
  const savedOrder = await getOrderForEmail(order.id)
  if (!savedOrder) throw new Error(`Ordine ${order.id} non trovato dopo la creazione`)

  const emailData = {
    ...buildOrderEmailPayload(savedOrder),
    customerName,
    customerEmail,
  }

  if (emailData.customerEmail) {
    sendOrderConfirmation(emailData).catch((e) => console.error('Email conferma failed:', e))
  }
  sendAdminOrderNotification(emailData).catch((e) => console.error('Email admin failed:', e))

  redirect(`/checkout/successo?orderId=${order.id}&method=${paymentMethod}`)
}

/** Indirizzo predefinito ricavato dai dati di checkout. */
function toDefaultAddressInput(addr: ShippingAddress): AddressInput {
  return {
    label: 'Casa',
    isDefault: true,
    firstName: addr.firstName,
    lastName: addr.lastName,
    company: null,
    vatNumber: null,
    fiscalCode: null,
    address: addr.address,
    city: addr.city,
    postalCode: addr.postalCode,
    province: addr.province ?? null,
    country: addr.country,
    phone: addr.phone ?? null,
  }
}

export async function saveCheckoutDataToProfile(userId: string, addr: ShippingAddress) {
  const nameParts = [addr.firstName, addr.lastName].filter(Boolean).join(' ')

  await Promise.all([
    updateUser(userId, {
      name: nameParts || undefined,
      phone: addr.phone || undefined,
      fiscalCode: addr.fiscalCode || undefined,
      company: addr.company || undefined,
      vatNumber: addr.vatNumber || undefined,
      pec: addr.pec || undefined,
      sdiCode: addr.sdiCode || undefined,
    }),
    upsertDefaultAddress(userId, toDefaultAddressInput(addr)),
  ])
}

export async function createAccountFromCheckout(email: string, addr: ShippingAddress) {
  if (await getUserByEmail(email)) return // email già registrata, non sovrascrivere

  const name = [addr.firstName, addr.lastName].filter(Boolean).join(' ')
  const user = await createUser({
    email,
    name: name || null,
    password: addr.guestPasswordHash!,
    phone: addr.phone || null,
    fiscalCode: addr.fiscalCode || null,
    company: addr.company || null,
    vatNumber: addr.vatNumber || null,
    pec: addr.pec || null,
    sdiCode: addr.sdiCode || null,
  })

  await createAddress(user.id, toDefaultAddressInput(addr))

  await issueVerificationEmail(email, name)
}

export async function hashPasswordForCheckout(password: string): Promise<string> {
  return hashPassword(password)
}
