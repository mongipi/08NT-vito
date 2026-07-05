'use client'
import { useLayoutEffect } from 'react'
import { useCart } from '@/contexts/CartContext'

export function ClearCart() {
  const { clearCart } = useCart()

  useLayoutEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
