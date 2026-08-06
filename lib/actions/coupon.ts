'use server'

import { calcDiscount, calcSubtotal } from '@/lib/cart'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { getDiscountByCode } from '@/services/discounts'
import type { DictionaryKey } from '@/lib/i18n/dictionary'

interface ValidateCouponResult {
  valid: boolean
  coupon?: AppliedCoupon
  errorKey?: DictionaryKey
  errorVars?: Record<string, string>
}

export async function validateCoupon(
  code: string,
  items: CartItem[],
  userRole: 'consumer' | 'b2b'
): Promise<ValidateCouponResult> {
  if (!code) return { valid: false, errorKey: 'coupon_error_empty' }

  const normalizedCode = code.toUpperCase().trim()
  let doc = null

  try {
    doc = await getDiscountByCode(normalizedCode)
  } catch (error) {
    console.error('coupon lookup failed', error)
  }

  // Nessun coupon vive nel codice: la fonte di verità è /admin/sconti.
  // Disattivare o eliminare un codice da admin lo disattiva davvero.
  if (!doc) return { valid: false, errorKey: 'coupon_error_invalid' }
  if (!doc.active) return { valid: false, errorKey: 'coupon_error_inactive' }
  if (doc.expiresAt && doc.expiresAt < new Date()) return { valid: false, errorKey: 'coupon_error_expired' }
  if (doc.maxUses && doc.usedCount >= doc.maxUses) return { valid: false, errorKey: 'coupon_error_exhausted' }
  if (doc.applicableTo !== 'all' && doc.applicableTo !== userRole) {
    return { valid: false, errorKey: 'coupon_error_not_applicable' }
  }

  const subtotal = calcSubtotal(items)
  if (doc.minOrderAmount && subtotal < doc.minOrderAmount) {
    return {
      valid: false,
      errorKey: 'coupon_error_min_order',
      errorVars: { amount: `€${doc.minOrderAmount.toFixed(2)}` },
    }
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
