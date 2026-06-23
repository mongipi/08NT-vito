export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  comparePrice?: number
  image?: string
  qty: number
}

export interface AppliedCoupon {
  code: string
  type: 'percent' | 'fixed'
  value: number
  discountAmount: number
}

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function calcDiscount(subtotal: number, coupon: AppliedCoupon | null): number {
  if (!coupon) return 0
  if (coupon.type === 'percent') return Math.round((subtotal * coupon.value) / 100 * 100) / 100
  return Math.min(coupon.value, subtotal)
}

export function calcTotal(subtotal: number, discount: number): number {
  return Math.max(0, subtotal - discount)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents)
}
