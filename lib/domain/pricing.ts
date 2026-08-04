import { calcDiscount, calcSubtotal, calcTotal } from '@/lib/cart'
import type { AppliedCoupon, CartItem } from '@/lib/cart'
import { DOMESTIC_COUNTRIES } from '@/lib/countries'

/**
 * Logica di prezzo dell'ordine. Modulo puro: nessun accesso a DB, rete o React,
 * così server e client calcolano gli stessi numeri con la stessa funzione.
 *
 * I valori di configurazione (contrassegno, soglia e prezzo spedizione,
 * supplemento estero) sono gestiti da /admin/impostazioni: vanno letti dal DB
 * con getPricingConfig() (lib/domain/pricing-config.ts), non scritti qui.
 */

export type PaymentMethod = 'stripe' | 'bonifico' | 'contrassegno'

export interface PricingConfig {
  /** Sovrapprezzo contrassegno (SETTING_KEYS.COD_SURCHARGE) */
  codSurcharge: number
  /** Soglia oltre la quale la spedizione è gratuita (SETTING_KEYS.SPEDIZIONE_GRATUITA) */
  shippingThreshold: number
  /** Costo spedizione sotto soglia (SETTING_KEYS.PREZZO_SPEDIZIONE) */
  shippingPrice: number
  /** Supplemento per destinazioni non domestiche (SETTING_KEYS.SUPPLEMENTO_ESTERO) */
  foreignSurcharge: number
}

/**
 * Configurazione neutra: nessun importo. Usata finché i valori reali non sono
 * stati letti da /admin/impostazioni, e quando il DB non risponde.
 *
 * Attenzione: con questa configurazione la spedizione risulta sempre gratuita e
 * non viene applicato alcun sovrapprezzo. È una scelta deliberata: nel codice
 * non esiste alcuna copia degli importi, che vivono solo nel database.
 */
export const ZERO_PRICING_CONFIG: PricingConfig = {
  codSurcharge: 0,
  shippingThreshold: 0,
  shippingPrice: 0,
  foreignSurcharge: 0,
}

export interface OrderTotalsInput {
  items: CartItem[]
  coupon: AppliedCoupon | null
  /** Codice paese ISO della destinazione di spedizione */
  country: string
  paymentMethod: PaymentMethod
}

export interface OrderTotals {
  subtotal: number
  discountAmount: number
  /** Imponibile merce, cioè subtotale meno sconto, prima di spedizione e sovrapprezzi */
  itemsTotal: number
  shippingCost: number
  foreignSurcharge: number
  codSurcharge: number
  freeShipping: boolean
  total: number
}

export function isDomesticCountry(country: string): boolean {
  return (DOMESTIC_COUNTRIES as readonly string[]).includes(country)
}

/** Arrotonda ai centesimi, per evitare code di floating point sui totali. */
function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Unico calcolo dei totali d'ordine dell'applicazione.
 *
 * La soglia di spedizione gratuita si confronta con l'imponibile merce
 * (subtotale al netto dello sconto), coerentemente con quanto mostrato in carrello.
 */
export function computeOrderTotals(
  { items, coupon, country, paymentMethod }: OrderTotalsInput,
  config: PricingConfig
): OrderTotals {
  const subtotal = calcSubtotal(items)
  const discountAmount = calcDiscount(subtotal, coupon)
  const itemsTotal = calcTotal(subtotal, discountAmount)

  const freeShipping = itemsTotal >= config.shippingThreshold
  const shippingCost = freeShipping ? 0 : config.shippingPrice
  const foreignSurcharge = isDomesticCountry(country) ? 0 : config.foreignSurcharge
  const codSurcharge = paymentMethod === 'contrassegno' ? config.codSurcharge : 0

  return {
    subtotal: roundCurrency(subtotal),
    discountAmount: roundCurrency(discountAmount),
    itemsTotal: roundCurrency(itemsTotal),
    shippingCost: roundCurrency(shippingCost),
    foreignSurcharge: roundCurrency(foreignSurcharge),
    codSurcharge: roundCurrency(codSurcharge),
    freeShipping,
    total: roundCurrency(itemsTotal + shippingCost + foreignSurcharge + codSurcharge),
  }
}

/** Quanto manca alla spedizione gratuita, 0 se già raggiunta. */
export function amountMissingForFreeShipping(itemsTotal: number, config: PricingConfig): number {
  return roundCurrency(Math.max(0, config.shippingThreshold - itemsTotal))
}

/** Avanzamento verso la spedizione gratuita, 0-100. Senza soglia è già completo. */
export function freeShippingProgress(itemsTotal: number, config: PricingConfig): number {
  if (config.shippingThreshold <= 0) return 100
  return Math.min(100, (itemsTotal / config.shippingThreshold) * 100)
}
