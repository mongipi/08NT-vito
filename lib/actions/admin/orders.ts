'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendOrderShipped, sendOrderDelivered, sendOrderCancelled } from '@/lib/email'

export async function updateOrderStatus(formData: FormData) {
  const id     = formData.get('id') as string
  const status = formData.get('status') as string
  const trackingNumber = (formData.get('trackingNumber') as string | null)?.trim() || undefined

  await prisma.order.update({ where: { id }, data: { status: status as never } })

  // Invia email al cliente in base al nuovo stato
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { email: true, name: true } }, items: true, shippingAddress: true },
  })

  if (order?.user?.email) {
    const emailData = {
      orderId: order.id,
      paymentMethod: order.paymentMethod,
      total: order.total,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      couponCode: order.couponCode,
      codSurcharge: order.codSurcharge,
      customerName: order.user.name ?? 'Cliente',
      customerEmail: order.user.email,
      items: order.items.map((i) => ({ name: i.name, qty: i.qty, unitPrice: i.unitPrice })),
      address: order.shippingAddress
        ? {
            firstName: order.shippingAddress.firstName,
            lastName:  order.shippingAddress.lastName,
            address:   order.shippingAddress.address,
            city:      order.shippingAddress.city,
            postalCode: order.shippingAddress.postalCode,
            province:  order.shippingAddress.province,
            country:   order.shippingAddress.country,
            phone:     order.shippingAddress.phone,
          }
        : { firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'IT' },
      trackingNumber,
    }

    if (status === 'shipped') {
      sendOrderShipped(emailData).catch((e) => console.error('Email spedizione failed:', e))
    } else if (status === 'delivered') {
      sendOrderDelivered(emailData).catch((e) => console.error('Email consegna failed:', e))
    } else if (status === 'cancelled') {
      sendOrderCancelled(emailData).catch((e) => console.error('Email annullamento failed:', e))
    }
  }

  revalidatePath(`/admin/ordini/${id}`)
  revalidatePath('/admin/ordini')
}
