'use server'

import { prisma } from '@/lib/prisma'
import { calcSubtotal } from '@/lib/cart'
import type { CartItem, AppliedCoupon } from '@/lib/cart'

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

  const doc = await prisma.discount.findUnique({ where: { code: code.toUpperCase().trim() } })
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

  const type = doc.type as 'percent' | 'fixed'
  const discountAmount =
    type === 'percent'
      ? Math.round((subtotal * doc.value) / 100 * 100) / 100
      : Math.min(doc.value, subtotal)

  return {
    valid: true,
    coupon: { code: code.toUpperCase(), type, value: doc.value, discountAmount },
  }
}
