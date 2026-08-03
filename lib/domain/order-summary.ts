/**
 * Righe del riepilogo importi di un ordine.
 *
 * Il riepilogo era costruito a mano in quattro punti (email, dettaglio admin,
 * dettaglio cliente) e in tutti mancavano spedizione e supplemento estero: le
 * voci mostrate non sommavano al totale.
 *
 * Qui si decide *quali* righe mostrare; l'aspetto resta a ciascuna pagina,
 * perché area admin e storefront hanno stili diversi.
 */

export type OrderSummaryRowKind = 'subtotal' | 'discount' | 'shipping' | 'surcharge' | 'total'

export interface OrderSummaryRow {
  key: string
  label: string
  /** Importo con segno: negativo per gli sconti. */
  amount: number
  kind: OrderSummaryRowKind
  /** Vero quando la spedizione è gratuita: da mostrare come testo, non come importo. */
  free?: boolean
}

export interface OrderAmounts {
  subtotal: number
  discountAmount: number
  couponCode?: string | null
  shippingCost?: number | null
  foreignSurcharge?: number | null
  codSurcharge?: number | null
  freeShipping?: boolean | null
  total: number
}

export function buildOrderSummaryRows(order: OrderAmounts): OrderSummaryRow[] {
  const rows: OrderSummaryRow[] = [
    { key: 'subtotal', label: 'Subtotale', amount: order.subtotal, kind: 'subtotal' },
  ]

  if (order.discountAmount > 0) {
    rows.push({
      key: 'discount',
      label: order.couponCode ? `Sconto · ${order.couponCode}` : 'Sconto',
      amount: -order.discountAmount,
      kind: 'discount',
    })
  }

  const shippingCost = order.shippingCost ?? 0
  rows.push({
    key: 'shipping',
    label: 'Spedizione',
    amount: shippingCost,
    kind: 'shipping',
    free: shippingCost === 0,
  })

  const foreignSurcharge = order.foreignSurcharge ?? 0
  if (foreignSurcharge > 0) {
    rows.push({
      key: 'foreign',
      label: 'Supplemento estero',
      amount: foreignSurcharge,
      kind: 'surcharge',
    })
  }

  const codSurcharge = order.codSurcharge ?? 0
  if (codSurcharge > 0) {
    rows.push({
      key: 'cod',
      label: 'Supplemento contrassegno',
      amount: codSurcharge,
      kind: 'surcharge',
    })
  }

  rows.push({ key: 'total', label: 'Totale', amount: order.total, kind: 'total' })

  return rows
}

/**
 * Verifica che le righe sommino al totale. Utile per intercettare ordini
 * storici con importi incoerenti invece di mostrarli senza avvisare.
 */
export function summaryRowsMatchTotal(rows: OrderSummaryRow[]): boolean {
  const total = rows.find((row) => row.kind === 'total')?.amount ?? 0
  const sum = rows.filter((row) => row.kind !== 'total').reduce((acc, row) => acc + row.amount, 0)
  return Math.abs(sum - total) < 0.011
}
