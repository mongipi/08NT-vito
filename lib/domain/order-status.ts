import type { OrderStatus } from '@prisma/client'

/**
 * Stati ordine e relative etichette italiane.
 * Deriva dall'enum Prisma: aggiungendo uno stato allo schema, TypeScript segnala
 * qui l'etichetta mancante invece di lasciare passare una tabella incompleta.
 */

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'In attesa',
  paid: 'Pagato',
  shipped: 'Spedito',
  delivered: 'Consegnato',
  cancelled: 'Annullato',
}

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = ORDER_STATUSES.map(
  (value) => ({ value, label: ORDER_STATUS_LABELS[value] })
)

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === 'string' && value in ORDER_STATUS_LABELS
}

export type { OrderStatus }
