'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import type { CartItem, AppliedCoupon } from '@/lib/cart'
import { calcSubtotal, calcDiscount, calcTotal, cartItemKey } from '@/lib/cart'

interface CartState {
  items: CartItem[]
  coupon: AppliedCoupon | null
}

type Action =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; productId: string; variantId?: string }
  | { type: 'UPDATE_QTY'; productId: string; variantId?: string; qty: number }
  | { type: 'APPLY_COUPON'; coupon: AppliedCoupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = cartItemKey(action.item)
      const existing = state.items.find((i) => cartItemKey(i) === key)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            cartItemKey(i) === key ? { ...i, qty: i.qty + action.item.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.item] }
    }
    case 'REMOVE_ITEM': {
      const key = cartItemKey(action)
      return { ...state, items: state.items.filter((i) => cartItemKey(i) !== key) }
    }
    case 'UPDATE_QTY': {
      const key = cartItemKey(action)
      return {
        ...state,
        items: state.items
          .map((i) => (cartItemKey(i) === key ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      }
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
  removeItem: (productId: string, variantId?: string) => void
  updateQty: (productId: string, qty: number, variantId?: string) => void
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

  // Le azioni dipendono solo da dispatch, che React garantisce stabile: senza
  // useCallback venivano ricreate a ogni render, rendendo inutile qualsiasi
  // memoizzazione nei componenti che le ricevono.
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', item })
    window.dispatchEvent(new Event('cart:open'))
  }, [])

  const removeItem = useCallback(
    (productId: string, variantId?: string) =>
      dispatch({ type: 'REMOVE_ITEM', productId, variantId }),
    []
  )

  const updateQty = useCallback(
    (productId: string, qty: number, variantId?: string) =>
      dispatch({ type: 'UPDATE_QTY', productId, qty, variantId }),
    []
  )

  const applyCoupon = useCallback(
    (coupon: AppliedCoupon) => dispatch({ type: 'APPLY_COUPON', coupon }),
    []
  )

  const removeCoupon = useCallback(() => dispatch({ type: 'REMOVE_COUPON' }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  // Senza useMemo il valore del context era un oggetto nuovo a ogni render,
  // quindi ogni consumatore si ri-renderizzava anche a carrello invariato.
  const value = useMemo<CartContextValue>(() => {
    const subtotal = calcSubtotal(state.items)
    const discountAmount = calcDiscount(subtotal, state.coupon)
    return {
      ...state,
      addItem,
      removeItem,
      updateQty,
      applyCoupon,
      removeCoupon,
      clearCart,
      itemCount: state.items.reduce((sum, item) => sum + item.qty, 0),
      subtotal,
      discountAmount,
      total: calcTotal(subtotal, discountAmount),
    }
  }, [state, addItem, removeItem, updateQty, applyCoupon, removeCoupon, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
