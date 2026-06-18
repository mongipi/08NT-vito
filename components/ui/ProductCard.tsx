import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  /** 'home' = compact (50×110 pkg, 3 ingredients, "Scopri").
   *  'catalog' = larger (56×130 pkg, 4 ingredients, "Scheda completa"). */
  variant?: 'home' | 'catalog'
}

/** Per-line product card. Packaging uses hex-with-alpha for dynamic line colors. */
export function ProductCard({ product, variant = 'home' }: ProductCardProps) {
  const { line, name, shortDescription, ingredients, capsules, days, dosage, notificationMs, slug } =
    product
  const isCatalog = variant === 'catalog'
  const pkgW = isCatalog ? 56 : 50
  const pkgH = isCatalog ? 130 : 110
  const visH = isCatalog ? 210 : 180
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
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            background: `${line.color}1A`,
            color: line.color,
          }}
        >
          {line.name}
        </div>

        {/* Pill bottle */}
        <div className="flex items-end justify-center" style={{ height: 100, marginTop: 8 }}>
          <div
            className="relative"
            style={{
              width: pkgW,
              height: pkgH,
              borderRadius: '3px 3px 2px 2px',
              border: '0.5px solid rgba(0,0,0,0.09)',
            }}
          >
            {/* Silver cap */}
            <div
              className="absolute top-0"
              style={{
                width: pkgW,
                height: 13,
                borderRadius: '2px 2px 0 0',
                background:
                  'linear-gradient(90deg,#888 0%,#ccc 22%,#e8e8e2 50%,#bbb 74%,#999 100%)',
                border: '0.5px solid rgba(0,0,0,0.07)',
              }}
            />
            {/* Colored body */}
            <div
              className="absolute left-0 right-0 bottom-0"
              style={{
                top: 13,
                borderRadius: '0 0 2px 2px',
                background: `linear-gradient(180deg, ${line.color}D9 0%, ${line.color}E6 100%)`,
              }}
            />
            {/* Line label */}
            <div
              className="absolute left-0 right-0 text-center"
              style={{
                bottom: 18,
                fontSize: 5.5,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {line.slug.toUpperCase()}
            </div>
            {/* "08" script */}
            <div
              className="absolute left-0 right-0 text-center"
              style={{
                bottom: 8,
                fontSize: 9,
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              08
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col" style={{ padding: '24px 26px 28px' }}>
        {/* Accent stripe */}
        <div
          style={{ height: 2, background: line.color, margin: '-24px -26px 16px', opacity: 0.15 }}
        />

        {/* Name */}
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 22,
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.25,
            marginBottom: 10,
          }}
        >
          {name}
        </div>

        {/* Short description */}
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 300,
            color: 'var(--ink-3)',
            lineHeight: 1.85,
            marginBottom: 16,
          }}
        >
          {shortDescription}
        </div>

        {/* Ingredient pills */}
        <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 18 }}>
          {ingredients.slice(0, ingrCount).map((ing) => (
            <span
              key={ing.name}
              style={{
                fontSize: 9.5,
                fontWeight: 300,
                padding: '4px 8px',
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
          style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}
        >
          <span style={{ fontSize: 9.5, fontWeight: 300, color: 'var(--ink-4)' }}>
            {detailText}
          </span>
          <Link
            href={`/prodotti/${slug}`}
            className="flex shrink-0 items-center gap-1 transition-all duration-150 group-hover:gap-2"
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: line.color,
              marginLeft: 8,
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
