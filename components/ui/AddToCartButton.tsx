'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/lib/cart'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

interface Props {
  item: Omit<CartItem, 'qty'>
  color: string
  stock: number
}

export function AddToCartButton({ item, color, stock }: Props) {
  const { addItem } = useCart()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({ ...item, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (stock === 0) {
    return (
      <div style={{
        padding: '0.875rem 1.5rem', textAlign: 'center',
        border: `1px solid ${color}30`, color: `${color}70`,
        fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        {t('cart_out_of_stock')}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content' }}>
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          aria-label={t('cart_decrease_qty')}
          style={{
            width: 36, height: 36, border: `1px solid ${color}30`,
            background: 'transparent', cursor: 'pointer', fontSize: '1.125rem',
            color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >−</button>
        <span style={{
          width: 44, textAlign: 'center', fontSize: '0.875rem', fontWeight: 600,
          color, borderTop: `1px solid ${color}30`, borderBottom: `1px solid ${color}30`,
          height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {qty}
        </span>
        <button
          onClick={() => setQty(q => Math.min(stock, q + 1))}
          aria-label={t('cart_increase_qty')}
          style={{
            width: 36, height: 36, border: `1px solid ${color}30`,
            background: 'transparent', cursor: 'pointer', fontSize: '1.125rem',
            color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >+</button>
      </div>

      <button
        onClick={handleAdd}
        style={{
          padding: '0.9375rem 2rem',
          background: added ? '#16a34a' : color,
          color: 'white', border: 'none', cursor: 'pointer',
          fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          transition: 'background 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {added ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {t('cart_added')}
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {t('cart_add')}
          </>
        )}
      </button>
    </div>
  )
}
