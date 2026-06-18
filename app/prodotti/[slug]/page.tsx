import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getProductBySlug, getProductSlugs } from '@/services/products'
import { ProductGallery } from '@/components/ui/ProductGallery'
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
  return { title: `${product.name} — 08 Natural Technology` }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const {
    line, name, shortDescription, longDescription,
    ingredients, usage, target, capsules, days,
    dosage, notificationMs, format, images,
  } = product

  // Hero carousel: fronte first, then all detail shots
  const heroSlides = [
    images?.fronte    && { src: images.fronte,    label: 'Fronte',                   alt: name },
    images?.lato1     && { src: images.lato1,     label: 'Composizione — lato A',    alt: `${name} — composizione` },
    images?.lato2     && { src: images.lato2,     label: 'Informazioni — retro',     alt: `${name} — retro etichetta` },
    images?.etichetta && { src: images.etichetta, label: 'Etichetta — vista piatta', alt: `${name} — etichetta` },
  ].filter(Boolean) as { src: string; label: string; alt: string }[]

  // Split product name into main word + qualifier for display
  const words = name.split(' ')
  const qualifier = words.length > 1 ? words[words.length - 1] : ''
  const mainName   = words.length > 1 ? words.slice(0, -1).join(' ') : name

  return (
    <main style={{ background: '#fff', borderTop: '3px solid var(--forest)' }}>

      {/* ── BREADCRUMB ── */}
      <div
        className="flex items-center justify-between strip"
        style={{ borderBottom: `1px solid ${line.color}20`, background: line.colorLight }}
      >
        <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--green)' }}>08 Natural Technology</span>
          <span style={{ color: `${line.color}60`, margin: '0 6px' }}>/</span>
          <span style={{ color: `${line.color}90` }}>{line.name}</span>
        </span>
        <Link
          href="/prodotti"
          className="flex items-center gap-1.5"
          style={{
            fontSize: 9, fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: line.color,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Tutti i prodotti
        </Link>
      </div>

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ minHeight: 560, borderBottom: `1px solid var(--green-l)` }}
      >
        {/* Left: identity */}
        <div
          className="hero-col hero-col-l flex flex-col justify-center"
          style={{ borderRight: `0.5px solid ${line.color}18`, background: '#fff' }}
        >
          {/* Eyebrow */}
          <div
            className="flex items-center gap-2.5"
            style={{
              fontSize: 9, fontWeight: 500, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: line.color,
              marginBottom: 20,
            }}
          >
            <span style={{ display: 'block', width: 22, height: '1px', background: line.color, flexShrink: 0 }} />
            {line.name}
          </div>

          {/* Product name */}
          <h1
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontWeight: 300,
              color: line.color,
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              marginBottom: 20,
            }}
          >
            <span style={{ display: 'block', fontSize: 'clamp(46px, 5.5vw, 70px)' }}>
              {mainName}
            </span>
            {qualifier && (
              <span style={{ display: 'block', fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 200, color: `${line.color}65` }}>
                {qualifier}
              </span>
            )}
          </h1>

          {/* Short description */}
          <p
            style={{
              fontSize: 12, fontWeight: 300,
              color: 'var(--ink-3)', lineHeight: 1.85,
              maxWidth: 460, marginBottom: 28,
            }}
          >
            {shortDescription}
          </p>

          {/* Divider */}
          <div style={{ width: 36, height: '0.5px', background: line.color, opacity: 0.3, marginBottom: 28 }} />

          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              `${capsules} capsule vegetali`,
              `${days} giorni`,
              dosage,
              ...(notificationMs ? [notificationMs] : []),
              'Made in Italy',
            ].map((chip) => (
              <span
                key={chip}
                style={{
                  fontSize: 8.5,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: line.color,
                  padding: '5px 11px',
                  border: `0.5px solid ${line.color}38`,
                  background: `${line.color}07`,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right: image carousel */}
        <div style={{ background: `linear-gradient(150deg, ${line.colorLight} 0%, #fff 55%)`, display: 'flex', flexDirection: 'column' }}>
          {heroSlides.length > 0 ? (
            <ProductGallery slides={heroSlides} color={line.color} contained />
          ) : (
            <div className="flex items-center justify-center" style={{ flex: 1 }}>
              <BottleStub color={line.color} colorLight={line.colorLight} label={name} />
            </div>
          )}
        </div>
      </section>

      {/* ══ 2. INFOGRAFICA ════════════════════════════════════════════════════
      {images?.infografica && (
        <section style={{ background: '#f8f8f6', borderBottom: `1px solid var(--border)` }}>
          <Image
            src={images.infografica}
            alt={`${name} — infografica ingredienti e benefici`}
            width={1600}
            height={900}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            sizes="100vw"
          />
        </section>
      )} */}

      {/* ══ 3. INGREDIENT TABLE ═══════════════════════════════════════════════ */}
      <section className="section" style={{ background: '#fff', borderBottom: `1px solid var(--border)` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <SectionLabel color={line.color}>Contenuti medi · per dose giornaliera (2 capsule)</SectionLabel>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 4 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${line.color}28` }}>
                <th
                  style={{
                    textAlign: 'left', fontSize: 8.5, fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `${line.color}70`, padding: '0 0 12px',
                  }}
                >
                  Ingrediente
                </th>
                <th
                  style={{
                    textAlign: 'right', fontSize: 8.5, fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: `${line.color}70`, padding: '0 0 12px',
                  }}
                >
                  Per dose
                </th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr
                  key={ing.name}
                  style={{
                    borderBottom: `0.5px solid ${line.color}12`,
                    background: i % 2 === 0 ? `${line.color}04` : 'transparent',
                  }}
                >
                  <td style={{ padding: '11px 0', fontSize: 12, fontWeight: 400, color: 'var(--ink-2)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          display: 'inline-block', width: 5, height: 5,
                          borderRadius: '50%', background: line.color,
                          flexShrink: 0, opacity: 0.55,
                        }}
                      />
                      {ing.name}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '11px 0', fontSize: 12, fontWeight: 500,
                      color: line.color, textAlign: 'right',
                    }}
                  >
                    {ing.dosage ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* ══ 5. DETAILS: uso · target · formato ═══════════════════════════════ */}
      <section
        style={{
          background: 'var(--paper)',
          borderBottom: `1px solid var(--border)`,
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-3 section"
          style={{ gap: 48, maxWidth: 1200, margin: '0 auto' }}
        >
          <div>
            <SectionLabel color={line.color}>Modo d&apos;uso</SectionLabel>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9 }}>
              {usage}
            </p>
          </div>
          <div>
            <SectionLabel color={line.color}>A chi è rivolto</SectionLabel>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9 }}>
              {target}
            </p>
          </div>
          <div>
            <SectionLabel color={line.color}>Formato &amp; composizione</SectionLabel>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9 }}>
              {format}
            </p>
            {longDescription && (
              <p
                style={{
                  fontSize: 11, fontWeight: 300, color: 'var(--ink-4)',
                  lineHeight: 1.85, marginTop: 16,
                }}
              >
                {longDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══ 6. REGULATORY NOTICE ═════════════════════════════════════════════ */}
      <div
        className="strip"
        style={{ background: `${line.color}06`, borderBottom: `0.5px solid ${line.color}16` }}
      >
        <div
          className="flex items-start gap-3"
          style={{
            maxWidth: 860, margin: '0 auto',
            padding: '16px 20px',
            border: `0.5px solid ${line.color}20`,
            background: '#fff',
          }}
        >
          <svg
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke={line.color} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1, opacity: 0.6 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <p style={{ fontSize: 11, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.75, margin: 0 }}>
            Integratore alimentare notificato al Ministero della Salute della Repubblica Italiana
            {notificationMs ? ` (${notificationMs})` : ''}.{' '}
            Non superare la dose giornaliera consigliata. Gli integratori alimentari non sostituiscono
            una dieta varia ed equilibrata e uno stile di vita sano. Tenere fuori dalla portata dei
            bambini. In caso di gravidanza, allattamento o terapie farmacologiche, consultare il medico.
          </p>
        </div>
      </div>

    </main>
  )
}

// ── Shared components ─────────────────────────────────────────────────────

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{
        fontSize: 8.5,
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        opacity: 0.7,
        marginBottom: 18,
        paddingBottom: 12,
        borderBottom: `0.5px solid ${color}22`,
      }}
    >
      {children}
    </div>
  )
}

function BottleStub({ color, colorLight, label }: { color: string; colorLight: string; label: string }) {
  return (
    <div
      style={{
        width: 200, height: 280,
        background: `linear-gradient(150deg, ${colorLight} 0%, #fff 80%)`,
        border: `0.5px solid ${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 300, color: `${color}60`, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  )
}
