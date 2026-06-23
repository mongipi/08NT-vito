'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { calcSubtotal, calcDiscount, calcTotal } from '@/lib/cart'

interface CartState {
  items: CartItem[]
  coupon: AppliedCoupon | null
}

type Action =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; qty: number }
  | { type: 'APPLY_COUPON'; coupon: AppliedCoupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.productId === action.item.productId)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.item.productId ? { ...i, qty: i.qty + action.item.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.item] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) => (i.productId === action.productId ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      }
    case 'APPLY_COUPON':
      return { ...state, coupon: action.coupon }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null }
    case 'CLEAR':
      return { items: [], coupon: null }
    case 'HYDRATE':
      return action.state
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  discountAmount: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = '08nt-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], coupon: null })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const subtotal = calcSubtotal(state.items)
  const discountAmount = calcDiscount(subtotal, state.coupon)
  const total = calcTotal(subtotal, discountAmount)

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
        updateQty: (productId, qty) => dispatch({ type: 'UPDATE_QTY', productId, qty }),
        applyCoupon: (coupon) => dispatch({ type: 'APPLY_COUPON', coupon }),
        removeCoupon: () => dispatch({ type: 'REMOVE_COUPON' }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        itemCount: state.items.reduce((sum, i) => sum + i.qty, 0),
        subtotal,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
