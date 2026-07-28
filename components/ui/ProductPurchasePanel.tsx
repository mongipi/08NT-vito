'use client'

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
  selectedId?: string
  onSelectVariant: (id: string) => void
}

export function ProductPurchasePanel({
  productId,
  slug,
  name,
  image,
  price,
  comparePrice,
  stock,
  variants,
  color,
  selectedId,
  onSelectVariant,
}: Props) {
  const hasVariants = variants.length > 0
  const selected = hasVariants ? (variants.find((variant) => variant.id === selectedId) ?? variants[0]) : null

  const activePrice = selected ? selected.price : price
  const activeComparePrice = selected ? selected.comparePrice : comparePrice
  const activeStock = selected ? selected.stock : stock
  const formattedPrice = formatEuro(activePrice)
  const formattedComparePrice = activeComparePrice ? formatEuro(activeComparePrice) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {hasVariants && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {variants.map((variant) => {
            const active = variant.id === selected?.id
            const labelIncludesQuantity = variant.quantity > 0
              && new RegExp(`^\\s*${variant.quantity}\\b`).test(variant.label)
            const displayLabel = variant.quantity > 0 && !labelIncludesQuantity
              ? `${variant.quantity} ${variant.label}`
              : variant.label
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelectVariant(variant.id)}
                disabled={variant.stock === 0}
                style={{
                  padding: '0.5rem 0.875rem',
                  border: `1px solid ${active ? color : `${color}30`}`,
                  background: active ? `${color}12` : 'transparent',
                  color: variant.stock === 0 ? `${color}50` : color,
                  cursor: variant.stock === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textDecoration: variant.stock === 0 ? 'line-through' : 'none',
                }}
              >
                {displayLabel}
              </button>
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)', fontWeight: 700, color }}>
          € {formattedPrice}
        </span>
        {formattedComparePrice && (
          <span style={{ fontSize: '1rem', color: `${color}55`, textDecoration: 'line-through', fontWeight: 400 }}>
            € {formattedComparePrice}
          </span>
        )}
      </div>

      <AddToCartButton
        key={selected?.id ?? 'base'}
        item={{
          productId,
          slug,
          name: selected ? `${name} - ${selected.label}` : name,
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

function formatEuro(value: number) {
  return value.toFixed(2).replace('.', ',')
}
