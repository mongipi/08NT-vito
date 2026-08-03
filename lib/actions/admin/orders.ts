'use server'
import { revalidatePath } from 'next/cache'
import { sendOrderShipped, sendOrderDelivered, sendOrderCancelled } from '@/lib/email'
import { buildOrderEmailPayload } from '@/lib/domain/order-email'
import { parseFormData } from '@/lib/validation/form'
import { orderStatusSchema } from '@/lib/validation/admin'
import { getOrderForEmail, setOrderStatus } from '@/services/orders'

/** Email inviata al cliente per ciascun cambio di stato che lo richiede. */
const STATUS_EMAIL = {
  shipped: sendOrderShipped,
  delivered: sendOrderDelivered,
  cancelled: sendOrderCancelled,
} as const

export async function updateOrderStatus(formData: FormData) {
  const { id, status, trackingNumber } = parseFormData(orderStatusSchema, formData)

  await setOrderStatus(id, status)

  const order = await getOrderForEmail(id)
  const sendEmail = STATUS_EMAIL[status as keyof typeof STATUS_EMAIL]

  if (order?.user?.email && sendEmail) {
    const payload = buildOrderEmailPayload(order, { trackingNumber: trackingNumber ?? undefined })
    sendEmail(payload).catch((error) =>
      console.error(`Email cambio stato "${status}" fallita:`, error)
    )
  }

  revalidatePath(`/admin/ordini/${id}`)
  revalidatePath('/admin/ordini')
}
