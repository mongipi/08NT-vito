/**
 * Coupon di benvenuto della newsletter.
 *
 * Era definito due volte: in lib/actions/coupon.ts (come fallback applicato
 * anche senza riga a database) e in app/api/newsletter/route.ts (che lo crea).
 * Le due copie potevano divergere su percentuale e destinatari.
 */
export const NEWSLETTER_DISCOUNT_CODE = 'BENVENUTO5'
export const NEWSLETTER_DISCOUNT_PERCENT = 5

/** Riga Discount corrispondente, usata in creazione e aggiornamento. */
export const NEWSLETTER_DISCOUNT_DATA = {
  type: 'percent',
  value: NEWSLETTER_DISCOUNT_PERCENT,
  active: true,
  applicableTo: 'consumer',
} as const
