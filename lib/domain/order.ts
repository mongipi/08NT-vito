import type { Prisma } from '@prisma/client'
import type { OrderStatus } from '@/lib/domain/order-status'
import type { OrderTotals } from '@/lib/domain/pricing'
import type { ShippingAddress } from '@/types/checkout'

/**
 * Costruzione del record ordine.
 *
 * Lo stesso payload annidato (items + shippingAddress + billingAddress) era
 * scritto tre volte: creazione intent Stripe, ordine diretto bonifico/contrassegno
 * e finalizzazione da metadata Stripe. Le tre copie erano già divergenti, per
 * esempio sul contrassegno sempre a zero nel percorso Stripe.
 */

/** Riga d'ordine, indipendente dalla forma del carrello e dei metadata Stripe. */
export interface OrderLineInput {
  slug?: string | null
  name: string
  variantLabel?: string | null
  unitPrice: number
  qty: number
}

export interface CreateOrderInput {
  userId?: string | null
  guestEmail?: string | null
  status: OrderStatus
  paymentMethod: string
  stripePaymentIntentId?: string | null
  couponCode?: string | null
  totals: OrderTotals
  address: ShippingAddress
  lines: OrderLineInput[]
}

function buildShippingAddressCreate(address: ShippingAddress) {
  return {
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
    country: address.country,
    phone: address.phone ?? null,
  }
}

/** L'indirizzo di fatturazione si crea solo se diverso e valorizzato. */
function buildBillingAddressCreate(address: ShippingAddress) {
  if (!address.billingDifferent || !address.billingAddress) return {}
  return {
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
}

export function buildOrderCreateData({
  userId,
  guestEmail,
  status,
  paymentMethod,
  stripePaymentIntentId,
  couponCode,
  totals,
  address,
  lines,
}: CreateOrderInput): Prisma.OrderUncheckedCreateInput {
  return {
    userId: userId ?? undefined,
    guestEmail: guestEmail ?? undefined,
    subtotal: totals.subtotal,
    discountAmount: totals.discountAmount,
    total: totals.total,
    couponCode: couponCode ?? null,
    status,
    paymentMethod,
    stripePaymentIntentId: stripePaymentIntentId ?? null,
    codSurcharge: totals.codSurcharge,
    shippingCost: totals.shippingCost,
    foreignSurcharge: totals.foreignSurcharge,
    freeShipping: totals.freeShipping,
    shippingNotes: address.shippingNotes ?? null,
    deliveryType: address.deliveryType ?? 'home',
    pickupCarrier: address.pickupCarrier ?? null,
    pickupPointCode: address.pickupPointCode ?? null,
    pickupPointAddress: address.pickupPointAddress ?? null,
    ...buildBillingAddressCreate(address),
    items: {
      create: lines.map((line) => ({
        slug: line.slug ?? null,
        name: line.name,
        variantLabel: line.variantLabel ?? null,
        unitPrice: Number(line.unitPrice),
        qty: Number(line.qty),
      })),
    },
    shippingAddress: { create: buildShippingAddressCreate(address) },
  }
}
