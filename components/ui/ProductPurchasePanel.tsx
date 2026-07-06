'use client'

import { useState } from 'react'
import { AddToCartButton } from './AddToCartButton'
import type { ProductVariant } from '@/types'

interface Props {
  productId: string
  slug: string
  name: string
  image?: string
  price: number
  comparePrice?: number | null
  stock: number
  variants: ProductVariant[]
  color: string
}

export function ProductPurchasePanel({ productId, slug, name, image, price, comparePrice, stock, variants, color }: Props) {
  const hasVariants = variants.length > 0
  const [selectedId, setSelectedId] = useState(variants[0]?.id)
  const selected = hasVariants ? (variants.find(v => v.id === selectedId) ?? variants[0]) : null

  const activePrice = selected ? selected.price : price
  const activeComparePrice = selected ? selected.comparePrice : comparePrice
  const activeStock = selected ? selected.stock : stock

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {hasVariants && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {variants.map(v => {
            const active = v.id === selected?.id
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                disabled={v.stock === 0}
                style={{
                  padding: '0.5rem 0.875rem',
                  border: `1px solid ${active ? color : `${color}30`}`,
                  background: active ? `${color}12` : 'transparent',
                  color: v.stock === 0 ? `${color}50` : color,
                  cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem', fontWeight: 500,
                  textDecoration: v.stock === 0 ? 'line-through' : 'none',
                }}
              >
                {v.quantity > 0 ? `${v.quantity} ${v.label}` : v.label}
              </button>
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)', fontWeight: 700, color }}>
          €{activePrice.toFixed(2)}
        </span>
        {activeComparePrice && (
          <span style={{ fontSize: '1rem', color: `${color}55`, textDecoration: 'line-through', fontWeight: 400 }}>
            €{activeComparePrice.toFixed(2)}
          </span>
        )}
      </div>

      <AddToCartButton
        key={selected?.id ?? 'base'}
        item={{
          productId,
          slug,
          name: selected ? `${name} — ${selected.label}` : name,
          price: activePrice,
          comparePrice: activeComparePrice ?? undefined,
          image,
          variantId: selected?.id,
          variantLabel: selected?.label,
        }}
        color={color}
        stock={activeStock}
      />
    </div>
  )
}
