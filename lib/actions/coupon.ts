'use server'

import { prisma } from '@/lib/prisma'
import { calcDiscount, calcSubtotal } from '@/lib/cart'
import type { CartItem, AppliedCoupon } from '@/lib/cart'

const NEWSLETTER_DISCOUNT_CODE = 'BENVENUTO5'
const NEWSLETTER_DISCOUNT_PERCENT = 5

interface ValidateCouponResult {
  valid: boolean
  coupon?: AppliedCoupon
  error?: string
}

export async function validateCoupon(
  code: string,
  items: CartItem[],
  userRole: 'consumer' | 'b2b'
): Promise<ValidateCouponResult> {
  if (!code) return { valid: false, error: 'Inserisci un codice sconto' }

  const normalizedCode = code.toUpperCase().trim()
  let doc = null

  try {
    doc = await prisma.discount.findUnique({ where: { code: normalizedCode } })
  } catch (error) {
    console.error('coupon lookup failed', error)
  }

  if (!doc && normalizedCode === NEWSLETTER_DISCOUNT_CODE) {
    if (userRole !== 'consumer') return { valid: false, error: 'Codice non applicabile al tuo account' }
    const coupon: AppliedCoupon = {
      code: NEWSLETTER_DISCOUNT_CODE,
      type: 'percent',
      value: NEWSLETTER_DISCOUNT_PERCENT,
      discountAmount: 0,
    }
    coupon.discountAmount = calcDiscount(calcSubtotal(items), coupon)
    return { valid: true, coupon }
  }

  if (!doc) return { valid: false, error: 'Codice non valido' }
  if (!doc.active) return { valid: false, error: 'Codice non attivo' }
  if (doc.expiresAt && doc.expiresAt < new Date()) return { valid: false, error: 'Codice scaduto' }
  if (doc.maxUses && doc.usedCount >= doc.maxUses) return { valid: false, error: 'Codice esaurito' }
  if (doc.applicableTo !== 'all' && doc.applicableTo !== userRole) {
    return { valid: false, error: 'Codice non applicabile al tuo account' }
  }

  const subtotal = calcSubtotal(items)
  if (doc.minOrderAmount && subtotal < doc.minOrderAmount) {
    return { valid: false, error: `Importo minimo ordine: €${doc.minOrderAmount.toFixed(2)}` }
  }

  const coupon: AppliedCoupon = {
    code: normalizedCode,
    type: doc.type as 'percent' | 'fixed',
    value: doc.value,
    discountAmount: 0,
  }
  coupon.discountAmount = calcDiscount(subtotal, coupon)

  return { valid: true, coupon }
}
