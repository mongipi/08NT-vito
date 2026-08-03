'use server'

import Stripe from 'stripe'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { computeOrderTotals } from '@/lib/domain/pricing'
import { getPricingConfig } from '@/lib/domain/pricing-config'
import { sendOrderConfirmation, sendAdminOrderNotification } from '@/lib/email'
import { issueVerificationEmail } from '@/lib/verification'
import { chunkMetadataValue } from '@/lib/stripe-metadata'
import bcrypt from 'bcryptjs'

const STRIPE_EXCLUDED_PAYMENT_METHOD_TYPES: Stripe.PaymentIntentCreateParams.ExcludedPaymentMethodType[] = ['amazon_pay', 'eps']

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  vatNumber?: string
  fiscalCode?: string
  sdiCode?: string
  pec?: string
  docType?: 'fattura' | 'scontrino' | 'nessuno' | null
  address: string
  city: string
  postalCode: string
  province?: string
  country: string
  phone?: string
  shippingNotes?: string
  deliveryType?: 'home' | 'pickup'
  pickupCarrier?: 'BRT' | 'POSTE' | null
  pickupPointCode?: string
  pickupPointAddress?: string
  billingDifferent?: boolean
  billingFirstName?: string
  billingLastName?: string
  billingCompany?: string
  billingVatNumber?: string
  billingFiscalCode?: string
  billingAddress?: string
  billingCity?: string
  billingPostalCode?: string
  billingProvince?: string
  billingCountry?: string
  saveForNextTime?: boolean
  guestEmail?: string
  createAccount?: boolean
  guestPasswordHash?: string
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
    order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? undefined,
        guestEmail: session?.user ? undefined : (shippingAddress.guestEmail ?? undefined),
        subtotal,
        discountAmount,
        total,
        couponCode: coupon?.code ?? null,
        status: 'pending',
        paymentMethod: 'stripe',
        stripePaymentIntentId: paymentIntent.id,
        shippingCost: totals.shippingCost,
        foreignSurcharge: totals.foreignSurcharge,
        freeShipping: totals.freeShipping,
        shippingNotes: shippingAddress.shippingNotes ?? null,
        deliveryType: shippingAddress.deliveryType ?? 'home',
        pickupCarrier: shippingAddress.pickupCarrier ?? null,
        pickupPointCode: shippingAddress.pickupPointCode ?? null,
        pickupPointAddress: shippingAddress.pickupPointAddress ?? null,
        ...(shippingAddress.billingDifferent && shippingAddress.billingAddress ? {
          billingAddress: {
            create: {
              firstName: shippingAddress.billingFirstName ?? shippingAddress.firstName,
              lastName: shippingAddress.billingLastName ?? shippingAddress.lastName,
              company: shippingAddress.billingCompany ?? null,
              vatNumber: shippingAddress.billingVatNumber ?? null,
              fiscalCode: shippingAddress.billingFiscalCode ?? null,
              address: shippingAddress.billingAddress,
              city: shippingAddress.billingCity ?? '',
              postalCode: shippingAddress.billingPostalCode ?? '',
              province: shippingAddress.billingProvince ?? null,
              country: shippingAddress.billingCountry ?? 'IT',
            },
          },
        } : {}),
        items: {
          create: items.map((item) => ({
            slug: item.slug ?? null,
            name: item.name,
            variantLabel: item.variantLabel ?? null,
            unitPrice: item.price,
            qty: item.qty,
          })),
        },
        shippingAddress: {
          create: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            company: shippingAddress.company ?? null,
            vatNumber: shippingAddress.vatNumber ?? null,
            fiscalCode: shippingAddress.fiscalCode ?? null,
            sdiCode: shippingAddress.sdiCode ?? null,
            pec: shippingAddress.pec ?? null,
            docType: shippingAddress.docType ?? null,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
            province: shippingAddress.province ?? null,
            country: shippingAddress.country,
            phone: shippingAddress.phone ?? null,
          },
        },
      },
    })
  } catch (error) {
    await stripe.paymentIntents.cancel(paymentIntent.id).catch(() => undefined)
    throw error
  }

  await stripe.paymentIntents.update(paymentIntent.id, {
    metadata: { orderId: order.id },
  }).catch((error) => {
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

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id ?? undefined,
      guestEmail: session?.user ? undefined : (shippingAddress.guestEmail ?? undefined),
      subtotal,
      discountAmount,
      total,
      couponCode: coupon?.code ?? null,
      paymentMethod,
      codSurcharge,
      shippingCost:     totals.shippingCost,
      foreignSurcharge: totals.foreignSurcharge,
      freeShipping:     totals.freeShipping,
      shippingNotes:     shippingAddress.shippingNotes     ?? null,
      deliveryType:      shippingAddress.deliveryType      ?? 'home',
      pickupCarrier:     shippingAddress.pickupCarrier     ?? null,
      pickupPointCode:   shippingAddress.pickupPointCode   ?? null,
      pickupPointAddress: shippingAddress.pickupPointAddress ?? null,
      status: 'pending',
      ...(shippingAddress.billingDifferent && shippingAddress.billingAddress ? {
        billingAddress: {
          create: {
            firstName:  shippingAddress.billingFirstName  ?? shippingAddress.firstName,
            lastName:   shippingAddress.billingLastName   ?? shippingAddress.lastName,
            company:    shippingAddress.billingCompany    ?? null,
            vatNumber:  shippingAddress.billingVatNumber  ?? null,
            fiscalCode: shippingAddress.billingFiscalCode ?? null,
            address:    shippingAddress.billingAddress,
            city:       shippingAddress.billingCity       ?? '',
            postalCode: shippingAddress.billingPostalCode ?? '',
            province:   shippingAddress.billingProvince   ?? null,
            country:    shippingAddress.billingCountry    ?? 'IT',
          },
        },
      } : {}),
      items: {
        create: items.map((i) => ({
          slug:         i.slug ?? null,
          name:         i.name,
          variantLabel: i.variantLabel ?? null,
          unitPrice:    i.price,
          qty:          i.qty,
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

  // Bonifico/contrassegno non hanno un webhook di conferma pagamento: le scorte
  // si riservano subito alla creazione dell'ordine (a differenza di Stripe, che
  // le scala solo a pagamento riuscito nel webhook). updateMany invece di update:
  // se la variante/prodotto non esiste più (es. cancellato) non deve far fallire l'ordine.
  await Promise.all(
    items.map((i) => {
      if (i.variantId) {
        return prisma.productVariant.updateMany({
          where: { id: i.variantId },
          data: { stock: { decrement: i.qty } },
        })
      }
      return prisma.product.updateMany({
        where: { slug: i.slug },
        data: { stock: { decrement: i.qty } },
      })
    })
  )

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true },
      })
    : null

  if (shippingAddress.saveForNextTime && session?.user?.id) {
    await saveCheckoutDataToProfile(session.user.id, shippingAddress)
  }

  const customerName = user?.name ?? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim()
  const customerEmail = user?.email ?? shippingAddress.guestEmail ?? ''

  if (!session?.user && shippingAddress.createAccount && shippingAddress.guestPasswordHash && customerEmail) {
    await createAccountFromCheckout(customerEmail, shippingAddress).catch((e) =>
      console.error('Create account failed:', e)
    )
  }

  const emailData = {
    orderId: order.id,
    paymentMethod,
    total,
    subtotal,
    discountAmount,
    couponCode: coupon?.code ?? null,
    codSurcharge,
    customerName,
    customerEmail,
    items: items.map((i) => ({ name: i.name, qty: i.qty, unitPrice: i.price })),
    address: {
      firstName: shippingAddress.firstName, lastName: shippingAddress.lastName,
      address: shippingAddress.address, city: shippingAddress.city,
      postalCode: shippingAddress.postalCode, province: shippingAddress.province ?? null,
      country: shippingAddress.country, phone: shippingAddress.phone ?? null,
    },
    deliveryType: shippingAddress.deliveryType ?? 'home',
    pickupCarrier: shippingAddress.pickupCarrier ?? null,
    pickupPointCode: shippingAddress.pickupPointCode ?? null,
    pickupPointAddress: shippingAddress.pickupPointAddress ?? null,
  }

  if (emailData.customerEmail) {
    sendOrderConfirmation(emailData).catch((e) => console.error('Email conferma failed:', e))
  }
  sendAdminOrderNotification(emailData).catch((e) => console.error('Email admin failed:', e))

  redirect(`/checkout/successo?orderId=${order.id}&method=${paymentMethod}`)
}

export async function saveCheckoutDataToProfile(userId: string, addr: ShippingAddress) {
  const nameParts = [addr.firstName, addr.lastName].filter(Boolean).join(' ')

  await Promise.all([
    // Aggiorna dati anagrafici utente
    prisma.user.update({
      where: { id: userId },
      data: {
        name:       nameParts      || undefined,
        phone:      addr.phone     || undefined,
        fiscalCode: addr.fiscalCode || undefined,
        company:    addr.company   || undefined,
        vatNumber:  addr.vatNumber || undefined,
        pec:        addr.pec       || undefined,
        sdiCode:    addr.sdiCode   || undefined,
      },
    }),
    // Crea o aggiorna indirizzo di spedizione predefinito
    (async () => {
      const existing = await prisma.userAddress.findFirst({
        where: { userId, isDefault: true },
      })
      const addrData = {
        userId,
        label:      'Casa',
        firstName:  addr.firstName,
        lastName:   addr.lastName,
        address:    addr.address,
        city:       addr.city,
        postalCode: addr.postalCode,
        province:   addr.province   ?? null,
        country:    addr.country,
        phone:      addr.phone      ?? null,
        isDefault:  true,
      }
      if (existing) {
        await prisma.userAddress.update({ where: { id: existing.id }, data: addrData })
      } else {
        await prisma.userAddress.create({ data: addrData })
      }
    })(),
  ])
}

export async function createAccountFromCheckout(email: string, addr: ShippingAddress) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return // email già registrata, non sovrascrivere

  const name = [addr.firstName, addr.lastName].filter(Boolean).join(' ')
  const user = await prisma.user.create({
    data: {
      email,
      name:       name       || null,
      password:   addr.guestPasswordHash!,
      phone:      addr.phone      || null,
      fiscalCode: addr.fiscalCode || null,
      company:    addr.company    || null,
      vatNumber:  addr.vatNumber  || null,
      pec:        addr.pec        || null,
      sdiCode:    addr.sdiCode    || null,
    },
  })

  await prisma.userAddress.create({
    data: {
      userId:     user.id,
      label:      'Casa',
      firstName:  addr.firstName,
      lastName:   addr.lastName,
      address:    addr.address,
      city:       addr.city,
      postalCode: addr.postalCode,
      province:   addr.province   ?? null,
      country:    addr.country,
      phone:      addr.phone      ?? null,
      isDefault:  true,
    },
  })

  await issueVerificationEmail(email, name)
}

export async function hashPasswordForCheckout(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
