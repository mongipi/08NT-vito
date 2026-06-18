import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getProductSlugs } from '@/services/products'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return { title: product.name }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const { line, name, longDescription, ingredients, usage, target, capsules, days, dosage, notificationMs, format } =
    product

  return (
    <main>
      {/* ── CAT HEADER STRIP ── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '11px 48px',
          borderBottom: '1px solid var(--amber)',
          background: 'var(--white)',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--green)',
          }}
        >
          08 Natural Technology &nbsp;|&nbsp; {line.name}
        </span>
        <Link
          href="/prodotti"
          className="flex items-center gap-1.5"
          style={{
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Tutti i prodotti
        </Link>
      </div>

      {/* ── PRODUCT HERO (dark) ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ background: 'var(--forest)' }}
      >
        {/* Left */}
        <div
          className="flex flex-col justify-center section"
          style={{ borderRight: '0.5px solid rgba(252, 174, 7, 0.15)' }}
        >
          <div
            className="mb-3.5 flex items-center gap-2.5"
            style={{
              fontSize: 9,
              fontWeight: 300,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(184,144,60,0.6)',
            }}
          >
            <span style={{ display: 'block', width: 16, height: '0.5px', background: 'var(--amber)', opacity: 0.5, flexShrink: 0 }} />
            {line.name}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(34px, 5vw, 46px)',
              fontWeight: 300,
              color: '#f0ede8',
              lineHeight: 1.1,
              marginBottom: 18,
            }}
          >
            {name}
          </div>

          <p
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: 'rgba(253,246,232,0.5)',
              lineHeight: 1.85,
              marginBottom: 28,
            }}
          >
            {longDescription}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {[
              `${capsules} capsule`,
              `${days} giorni`,
              dosage,
              ...(notificationMs ? [notificationMs] : []),
              'Made in Italy',
            ].map((chip) => (
              <span
                key={chip}
                style={{
                  fontSize: 9,
                  fontWeight: 300,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(184,144,60,0.55)',
                  padding: '5px 11px',
                  border: '0.5px solid rgba(184,144,60,0.2)',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right: visual */}
        <div className="flex items-center justify-center section">
          <div className="flex flex-col items-center gap-5">
            <div
              style={{
                position: 'relative',
                width: 170,
                height: 170,
                border: '0.5px solid rgba(184,144,60,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 70,
                  height: 150,
                  borderRadius: '4px 4px 3px 3px',
                  border: '0.5px solid rgba(0,0,0,0.09)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: 70,
                    height: 16,
                    borderRadius: '3px 3px 0 0',
                    background: 'linear-gradient(90deg,#888 0%,#ccc 22%,#e8e8e2 50%,#bbb 74%,#999 100%)',
                    border: '0.5px solid rgba(0,0,0,0.07)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '0 0 3px 3px',
                    background: `linear-gradient(180deg, ${line.color}D9 0%, ${line.color}E6 100%)`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: 7,
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {line.slug.toUpperCase()}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: 11,
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  08
                </div>
              </div>
            </div>

            <div
              className="inline-flex flex-col items-center justify-center gap-[1px]"
              style={{ border: '1.5px solid rgba(184,144,60,0.3)', padding: '6px 12px 7px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 18,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'rgba(253,246,232,0.4)',
                }}
              >
                08
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                  fontSize: 6,
                  fontWeight: 300,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  color: 'rgba(253,246,232,0.25)',
                }}
              >
                Natural Technology
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT BODY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] section" style={{ gap: 0 }}>
        {/* Ingredients */}
        <div className="pb-10 lg:pb-0 lg:pr-10">
          <SectionLabel>Ingredienti</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map((ing) => (
              <span
                key={ing.name}
                style={{
                  fontSize: 10,
                  fontWeight: 300,
                  padding: '5px 10px',
                  background: 'var(--green-ll)',
                  color: 'var(--green)',
                  border: '0.5px solid rgba(26,74,46,0.2)',
                }}
              >
                {ing.name}
                {ing.dosage ? ` — ${ing.dosage}` : ''}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <SectionLabel>Formato</SectionLabel>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9 }}>
              {format}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block" style={{ background: 'var(--border)', margin: '0 52px' }} />

        {/* Usage + Target */}
        <div className="border-t border-[var(--border)] pt-10 lg:border-0 lg:pl-10 lg:pt-0">
          <div className="mb-8">
            <SectionLabel>Modo d&apos;uso</SectionLabel>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9 }}>
              {usage}
            </p>
          </div>
          <div>
            <SectionLabel>A chi è rivolto</SectionLabel>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9 }}>
              {target}
            </p>
          </div>
        </div>
      </div>

      {/* ── NOTICE ── */}
      <div
        className="mx-6 mb-12 flex items-start gap-3 sm:mx-12"
        style={{
          padding: '16px 20px',
          border: '0.5px solid rgba(26,74,46,0.2)',
          background: 'var(--green-ll)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--green-2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: 1 }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <p style={{ fontSize: 11, fontWeight: 300, color: 'var(--green-2)', lineHeight: 1.7, margin: 0 }}>
          Integratore alimentare notificato al Ministero della Salute della Repubblica Italiana.
          Prodotto e confezionato in Italia. Qualità italiana, ricerca e attenzione ai dettagli per
          integratori affidabili e di eccellenza.
        </p>
      </div>
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--ink-4)',
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: '1px solid var(--border)',
      }}
    >
      {children}
    </div>
  )
}
