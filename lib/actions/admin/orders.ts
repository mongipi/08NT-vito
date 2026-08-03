'use server'
import { revalidatePath } from 'next/cache'
import { sendOrderShipped, sendOrderDelivered, sendOrderCancelled } from '@/lib/email'
import { ORDER_STATUSES, isOrderStatus } from '@/lib/domain/order-status'
import { buildOrderEmailPayload } from '@/lib/domain/order-email'
import { getOrderForEmail, setOrderStatus } from '@/services/orders'

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const trackingNumber = (formData.get('trackingNumber') as string | null)?.trim() || undefined

  // Il valore arriva da una form: va validato contro l'enum, non scritto a fiducia.
  if (!isOrderStatus(status)) {
    throw new Error(`Stato ordine non valido: "${status}". Ammessi: ${ORDER_STATUSES.join(', ')}`)
  }

  await setOrderStatus(id, status)

  // Invia email al cliente in base al nuovo stato
  const order = await getOrderForEmail(id)

  if (order?.user?.email) {
    const emailData = buildOrderEmailPayload(order, { trackingNumber })

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
