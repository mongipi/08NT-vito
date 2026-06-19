import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  /** 'home' = compact (50×110 pkg, 3 ingredients, "Scopri").
   *  'catalog' = larger (56×130 pkg, 4 ingredients, "Scheda completa"). */
  variant?: 'home' | 'catalog'
}

/** Per-line product card. Packaging uses hex-with-alpha for dynamic line colors. */
export function ProductCard({ product, variant = 'home' }: ProductCardProps) {
  const { line, name, shortDescription, ingredients, capsules, days, dosage, notificationMs, slug, images } =
    product
  const isCatalog = variant === 'catalog'
  const pkgW = isCatalog ? 56 : 50
  const pkgH = isCatalog ? 130 : 110
  const visH = isCatalog ? 220 : 196
  const ingrCount = isCatalog ? 4 : 3

  const detailText =
    isCatalog && notificationMs
      ? `${capsules} capsule · ${dosage} · ${notificationMs}`
      : `${capsules} capsule · ${days} giorni`

  return (
    <article className="group relative flex flex-col bg-white transition-colors duration-[220ms] hover:bg-[var(--green-ll)] border-r border-[var(--border-2)] last:border-r-0">
      {/* Top color bar */}
      <div style={{ height: 4, background: line.color }} />

      {/* Visual */}
      <div
        className="relative flex flex-col items-center justify-center border-b border-[var(--border-2)]"
        style={{ height: visH, background: line.colorLight }}
      >
        {/* Line tag */}
        <div
          className="absolute left-3.5 top-3.5"
          style={{
            fontSize: '0.5rem',
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.625rem',
            background: `${line.color}1A`,
            color: line.color,
          }}
        >
          {line.name}
        </div>

        {/* Product image */}
        <div
          className="flex items-end justify-center"
          style={{ flex: 1, padding: '1.25rem 1rem 0.75rem', position: 'relative' }}
        >
          {images?.fronte ? (
            <Image
              src={images.fronte}
              alt={name}
              width={isCatalog ? 120 : 100}
              height={isCatalog ? 220 : 190}
              style={{
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.13)) drop-shadow(0 3px 6px rgba(0,0,0,0.08))',
                maxHeight: isCatalog ? 200 : 170,
              }}
              sizes="140px"
            />
          ) : (
            <div
              style={{
                width: pkgW, height: pkgH,
                borderRadius: '3px 3px 2px 2px',
                background: `linear-gradient(180deg, ${line.color}D9 0%, ${line.color}E6 100%)`,
                border: '0.5px solid rgba(0,0,0,0.09)',
              }}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col" style={{ padding: '1.5rem 1.625rem 1.75rem' }}>
        {/* Accent stripe */}
        <div
          style={{ height: 2, background: line.color, margin: '-1.5rem -1.625rem 1rem', opacity: 0.15 }}
        />

        {/* Name */}
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '1.375rem',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.25,
            marginBottom: '0.625rem',
          }}
        >
          {name}
        </div>

        {/* Short description */}
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 300,
            color: 'var(--ink-3)',
            lineHeight: 1.85,
            marginBottom: '1rem',
          }}
        >
          {shortDescription}
        </div>

        {/* Ingredient pills */}
        <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '1.125rem' }}>
          {ingredients.slice(0, ingrCount).map((ing) => (
            <span
              key={ing.name}
              style={{
                fontSize: '0.59rem',
                fontWeight: 300,
                padding: '0.25rem 0.5rem',
                background: `${line.color}12`,
                color: line.color,
                border: `0.5px solid ${line.color}33`,
              }}
            >
              {ing.name}
            </span>
          ))}
        </div>

        {/* Footer row */}
        <div
          className="mt-auto flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}
        >
          <span style={{ fontSize: '0.59rem', fontWeight: 300, color: 'var(--ink-4)' }}>
            {detailText}
          </span>
          <Link
            href={`/prodotti/${slug}`}
            className="flex shrink-0 items-center gap-1 transition-all duration-150 group-hover:gap-2"
            style={{
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: line.color,
              marginLeft: '0.5rem',
            }}
          >
            {isCatalog ? 'Scheda completa' : 'Scopri'}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
