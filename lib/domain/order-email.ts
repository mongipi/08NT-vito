import type { OrderData } from '@/lib/email'
import type { OrderForEmail } from '@/services/orders'

/**
 * Costruzione del payload per le email d'ordine.
 *
 * Era assemblato a mano in tre punti (ordine diretto, finalizzazione Stripe,
 * cambio stato da admin), con differenze silenziose: il percorso Stripe passava
 * sempre codSurcharge = 0 e nessuno dei tre includeva spedizione e supplemento
 * estero, per cui le righe dell'email non sommavano mai al totale.
 */
export function buildOrderEmailPayload(
  order: OrderForEmail,
  extra: { trackingNumber?: string } = {}
): OrderData {
  const shippingAddress = order.shippingAddress

  const customerName =
    order.user?.name ??
    (shippingAddress ? `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim() : '') ??
    ''

  return {
    orderId: order.id,
    paymentMethod: order.paymentMethod,
    total: order.total,
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    couponCode: order.couponCode,
    codSurcharge: order.codSurcharge,
    shippingCost: order.shippingCost,
    foreignSurcharge: order.foreignSurcharge,
    customerName: customerName || 'Cliente',
    customerEmail: order.user?.email ?? order.guestEmail ?? '',
    items: order.items.map((item) => ({
      name: item.name,
      qty: item.qty,
      unitPrice: item.unitPrice,
    })),
    address: shippingAddress
      ? {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          province: shippingAddress.province,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        }
      : { firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'IT' },
    deliveryType: order.deliveryType ?? 'home',
    pickupCarrier: order.pickupCarrier ?? null,
    pickupPointCode: order.pickupPointCode ?? null,
    pickupPointAddress: order.pickupPointAddress ?? null,
    ...extra,
  }
}
