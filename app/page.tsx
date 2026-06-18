import Link from 'next/link'
import { getProducts } from '@/services/products'
import { getArticles } from '@/services/articles'
import { ProductCard } from '@/components/ui/ProductCard'
import { formatDate } from '@/lib/utils'

export default async function HomePage() {
  const [products, articles] = await Promise.all([getProducts(), getArticles()])

  return (
    <main>
      {/* ════ HERO ════
          Mockup: left  padding 72px 56px 72px 48px
                  right padding 64px 48px
          → CSS classes hero-col, hero-col-l, hero-col-r in globals.css */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ background: 'var(--forest)', minHeight: 420 }}
      >
        {/* Left */}
        <div
          className="hero-col hero-col-l flex flex-col justify-center"
          style={{ borderRight: '0.5px solid rgba(184,144,60,0.2)' }}
        >
          {/* Eyebrow */}
          <div
            className="flex items-center gap-2.5"
            style={{
              fontSize: 9,
              fontWeight: 300,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(253,246,232,0.45)',
              marginBottom: 28,
            }}
          >
            <span
              style={{
                display: 'block',
                width: 24,
                height: '0.5px',
                background: 'var(--amber)',
                opacity: 0.6,
                flexShrink: 0,
              }}
            />
            Integratori alimentari · Bitonto, Puglia · Made in Italy
          </div>

          {/* Display heading */}
          <div
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(34px, 5vw, 50px)',
              fontWeight: 300,
              color: 'var(--silver-3)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              marginBottom: 16,
            }}
          >
            L&apos;<em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>Eccellenza</em>
            <br />
            come Standard.
          </div>

          {/* Script tagline */}
          <div
            style={{
              fontFamily: 'var(--font-great-vibes), cursive',
              fontSize: 26,
              color: 'rgba(253,246,232,0.5)',
              marginBottom: 28,
            }}
          >
            L&apos;Eccellenza come Standard
          </div>

          {/* Body */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 300,
              color: 'rgba(253,246,232,0.6)',
              lineHeight: 1.9,
              maxWidth: 400,
              marginBottom: 32,
            }}
          >
            Non volevamo semplicemente realizzare degli integratori, ma dare vita a prodotti
            sviluppati con passione, attenzione e rispetto per le persone che ogni giorno ripongono
            la loro fiducia in noi.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/prodotti"
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 26px',
                background: 'var(--amber)',
                color: 'var(--forest)',
              }}
            >
              Scopri i prodotti
            </Link>
            <Link
              href="/brand"
              style={{
                fontSize: 9,
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '12px 26px',
                background: 'none',
                color: 'rgba(253,246,232,0.75)',
                border: '1px solid rgba(253,246,232,0.2)',
              }}
            >
              La nostra storia
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="hero-col hero-col-r flex flex-col justify-center">
          {/* Ghost logo — 28px 40px 32px internal, 32px bottom margin */}
          <div
            className="inline-flex flex-col items-center justify-center self-start"
            style={{
              border: '1.5px solid rgba(180,180,172,0.3)',
              padding: '28px 40px 32px',
              gap: 8,
              marginBottom: 32,
              background: 'rgba(180,180,172,0.04)',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                fontSize: 10,
                color: 'var(--silver)',
                opacity: 0.5,
              }}
            >
              ®
            </span>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 80,
                fontWeight: 300,
                color: 'var(--silver-2)',
                lineHeight: 1,
                opacity: 0.45,
              }}
            >
              08
            </div>
            <div
              style={{
                fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                fontSize: 10,
                fontWeight: 200,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'var(--silver)',
                opacity: 0.35,
              }}
            >
              Natural Technology
            </div>
          </div>

          {/* Stats list */}
          <div style={{ borderTop: '0.5px solid rgba(184,144,60,0.15)' }}>
            {STATS.map(({ icon, value, sub }) => (
              <div
                key={value}
                className="flex items-center gap-3.5"
                style={{ padding: '13px 0', borderBottom: '0.5px solid rgba(184,144,60,0.12)' }}
              >
                <span style={{ color: 'var(--silver-2)', opacity: 0.7, flexShrink: 0 }}>
                  {icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 400,
                      color: 'rgba(240,237,232,0.88)',
                      marginBottom: 1,
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 200,
                      color: 'rgba(253,246,232,0.38)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ AMBER BAR — padding: 10px 48px (mockup) ════ */}
      <div
        className="strip flex items-center justify-between"
        style={{
          background: 'var(--forest)',
          borderTop: '0.5px solid rgba(184,144,60,0.25)',
          borderBottom: '0.5px solid rgba(184,144,60,0.25)',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(253,246,232,0.35)',
          }}
        >
          08 Natural Technology &nbsp;|&nbsp; Integratori Alimentari
        </span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(184,144,60,0.6)"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M12 22C12 22 4 16 4 9a8 8 0 0 1 16 0c0 7-8 13-8 13z" />
          <path d="M12 9v13" />
        </svg>
      </div>

      {/* ════ TICKER ════ */}
      <div
        style={{
          background: 'var(--forest)',
          borderBottom: '1px solid var(--amber)',
          overflow: 'hidden',
          padding: '10px 0',
        }}
      >
        <div className="ticker-track" aria-hidden="true">
          {TICKER_ITEMS.concat(TICKER_ITEMS).map((text, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2.5"
              style={{
                padding: '0 30px',
                fontSize: 9,
                fontWeight: 300,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(253,246,232,0.35)',
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'var(--silver-2)',
                  opacity: 0.6,
                  flexShrink: 0,
                  display: 'inline-block',
                }}
              />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ════ CHI SIAMO / MANIFESTO — padding: 80px 48px (mockup .s) ════ */}
      <section className="section">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-2.5"
          style={{
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            marginBottom: 14,
          }}
        >
          <span
            style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }}
          />
          Chi siamo
        </div>

        {/* Script */}
        <span
          style={{
            fontFamily: 'var(--font-great-vibes), cursive',
            fontSize: 32,
            color: 'var(--green-2)',
            display: 'block',
            marginBottom: 4,
          }}
        >
          Lettera del Fondatore
        </span>

        {/* Section heading */}
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(26px, 3.5vw, 40px)',
            fontWeight: 300,
            color: 'var(--ink)',
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
          }}
        >
          Un sogno diventato{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>promessa quotidiana.</em>
        </div>

        {/* 2-col grid — mockup: gap 64px, margin-top 56px */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]"
          style={{ gap: 64, marginTop: 56 }}
        >
          {/* Letter */}
          <div>
            <blockquote
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 21,
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--green)',
                lineHeight: 1.65,
                marginBottom: 24,
                borderLeft: '2px solid var(--amber)',
                paddingLeft: 20,
              }}
            >
              &ldquo;Per noi il benessere non è una semplice parola: è{' '}
              <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>energia</strong>,{' '}
              <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>equilibrio</strong>,{' '}
              <strong style={{ fontWeight: 600, fontStyle: 'normal' }}>serenità</strong> e qualità
              della vita.&rdquo;
            </blockquote>

            <div
              style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.95 }}
            >
              <p style={{ marginBottom: 14 }}>
                <strong>08 Natural Technology</strong> nasce da un sogno: creare qualcosa di cui
                poter essere veramente <strong>orgogliosi</strong>. Non volevamo semplicemente
                realizzare degli integratori, ma dare vita a prodotti sviluppati con{' '}
                <strong>passione</strong>, <strong>attenzione</strong> e <strong>rispetto</strong>{' '}
                per le persone che ogni giorno ripongono la loro <strong>fiducia</strong> in noi.
              </p>
              <p style={{ marginBottom: 14 }}>
                Dietro ogni formula ci sono ricerca, impegno e una scelta accurata degli ingredienti,
                perché crediamo che la <strong>qualità</strong> non sia un dettaglio, ma un{' '}
                <strong>valore fondamentale</strong>.
              </p>
              <p>
                <strong>08 Natural Technology</strong> è più di un marchio. È una promessa di{' '}
                <strong>impegno</strong>, <strong>qualità</strong> e <strong>rispetto</strong> verso
                chi ci sceglie.
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-great-vibes), cursive',
                fontSize: 28,
                color: 'var(--green-2)',
                marginTop: 20,
              }}
            >
              Vito Tatulli
            </div>

            <Link
              href="/brand"
              style={{
                display: 'inline-block',
                marginTop: 24,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '11px 24px',
                background: 'var(--green)',
                color: '#fff',
              }}
            >
              Il nostro manifesto
            </Link>
          </div>

          {/* 1px vertical divider */}
          <div className="hidden lg:block" style={{ background: 'var(--border)' }} />

          {/* Values */}
          <div className="flex flex-col">
            {VALUES.map(({ n, title, body }, idx) => (
              <div
                key={n}
                className="flex items-start gap-[18px]"
                style={{
                  padding: '20px 0',
                  borderTop: idx === 0 ? '0.5px solid var(--border)' : undefined,
                  borderBottom: '0.5px solid var(--border)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 13,
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'var(--amber)',
                    minWidth: 18,
                    paddingTop: 1,
                  }}
                >
                  {n}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color: 'var(--ink)',
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 300,
                      color: 'var(--ink-3)',
                      lineHeight: 1.7,
                    }}
                  >
                    {body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CATALOG STRIP — padding: 11px 48px (mockup .cat-header) ════ */}
      <div
        className="strip flex items-center justify-between"
        style={{
          borderBottom: '1px solid var(--amber)',
          background: 'var(--white)',
          paddingTop: 11,
          paddingBottom: 11,
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
          08 Natural Technology &nbsp;|&nbsp; Linea Prodotti
        </span>
        <div
          className="flex items-center gap-2"
          style={{
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            <path d="M12 22C12 22 4 16 4 9a8 8 0 0 1 16 0c0 7-8 13-8 13z" />
            <path d="M12 9v13" />
          </svg>
          Catalogo 2026
        </div>
      </div>

      {/* ════ PRODUCTS — padding: 80px 48px, margin-top grid 52px ════ */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        {/* Eyebrow */}
        <div
          className="flex items-center gap-2.5"
          style={{
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            marginBottom: 14,
          }}
        >
          <span
            style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }}
          />
          Le nostre formule
        </div>

        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(26px, 3.5vw, 40px)',
            fontWeight: 300,
            color: 'var(--ink)',
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
          }}
        >
          Prodotti pensati
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>per il tuo benessere.</em>
        </div>

        {/* Grid — mockup: margin-top 52px */}
        <div
          className="grid grid-cols-1 border border-[var(--border-2)] sm:grid-cols-2 lg:grid-cols-4"
          style={{ marginTop: 52 }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="home" />
          ))}
        </div>
      </section>

      {/* ════ BLOG PREVIEW — padding: 80px 48px, margin-top grid 52px ════ */}
      <section className="section" style={{ background: 'var(--forest)' }}>
        {/* Eyebrow */}
        <div
          className="flex items-center gap-2.5"
          style={{
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(184,144,60,0.7)',
            marginBottom: 14,
          }}
        >
          <span
            style={{
              display: 'block',
              width: 22,
              height: '0.5px',
              background: 'rgba(184,144,60,0.5)',
              flexShrink: 0,
            }}
          />
          Approfondimenti
        </div>

        <span
          style={{
            fontFamily: 'var(--font-great-vibes), cursive',
            fontSize: 28,
            color: 'rgba(184,144,60,0.5)',
            display: 'block',
            marginBottom: 4,
          }}
        >
          Dal blog
        </span>

        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(26px, 3.5vw, 40px)',
            fontWeight: 300,
            color: '#f0ede8',
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
            marginTop: 4,
          }}
        >
          Scienza e <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>benessere.</em>
        </div>

        {/* Blog grid — mockup: margin-top 52px, 2fr 1fr */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]"
          style={{ marginTop: 52, border: '1px solid rgba(184,144,60,0.12)' }}
        >
          {/* Featured */}
          {articles[0] && (
            <Link
              href={`/blog/${articles[0].slug}`}
              className="block transition-colors duration-200 hover:bg-white/5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRight: '1px solid rgba(184,144,60,0.12)',
                borderBottom: '1px solid rgba(184,144,60,0.12)',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  height: 180,
                  background: 'rgba(255,255,255,0.04)',
                  borderBottom: '1px solid rgba(184,144,60,0.12)',
                }}
              >
                <ArticleIcon size={42} />
              </div>
              <div style={{ padding: '22px 24px' }}>
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--amber)',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  {articles[0].tag}
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: 20,
                    fontWeight: 400,
                    color: '#f0ede8',
                    lineHeight: 1.4,
                    marginBottom: 8,
                  }}
                >
                  {articles[0].title}
                </div>
                <div style={{ fontSize: 10, fontWeight: 300, color: 'rgba(253,246,232,0.3)' }}>
                  {formatDate(articles[0].publishedAt)} · {articles[0].readingTime} min di lettura
                </div>
              </div>
            </Link>
          )}

          {/* Sidebar */}
          <div className="flex flex-col">
            {articles.slice(1, 4).map((article, i) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block flex-1 transition-colors duration-200 hover:bg-white/5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderBottom: i < 2 ? '0.5px solid rgba(184,144,60,0.12)' : undefined,
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: 72,
                    background: 'rgba(255,255,255,0.04)',
                    borderBottom: '1px solid rgba(184,144,60,0.12)',
                  }}
                >
                  <ArticleIcon size={26} />
                </div>
                <div style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      fontSize: 8.5,
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--amber)',
                      display: 'block',
                      marginBottom: 8,
                    }}
                  >
                    {article.tag}
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#f0ede8',
                      lineHeight: 1.4,
                    }}
                  >
                    {article.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 300,
                      color: 'rgba(253,246,232,0.3)',
                      marginTop: 8,
                    }}
                  >
                    {formatDate(article.publishedAt)} · {article.readingTime} min
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-block',
              fontSize: 9,
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '12px 26px',
              background: 'none',
              color: 'rgba(253,246,232,0.75)',
              border: '1px solid rgba(253,246,232,0.2)',
            }}
          >
            Tutti gli articoli
          </Link>
        </div>
      </section>
    </main>
  )
}

// ── Static data ────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "L'Eccellenza come Standard",
  'Made in Italy',
  'Ricerca Scientifica',
  'Ingredienti Naturali',
  'Notificato Ministero della Salute',
  'Formulazioni Avanzate',
  'Bitonto · Puglia',
  'Benessere Autentico',
]

const STATS = [
  {
    icon: <LeafIcon />,
    value: 'Ingredienti selezionati',
    sub: 'Ricerca accurata di ogni principio attivo',
  },
  {
    icon: <ShieldIcon />,
    value: 'Notificati al Min. della Salute',
    sub: 'Conformi alla normativa italiana vigente',
  },
  {
    icon: <FlaskIcon />,
    value: 'Formule evidence-based',
    sub: 'Dosaggi calibrati sulla letteratura scientifica',
  },
  {
    icon: <MedalIcon />,
    value: 'Prodotto e confezionato in Italia',
    sub: 'Qualità italiana certificata in ogni capsula',
  },
]

const VALUES = [
  {
    n: 'I',
    title: 'Ricerca scientifica',
    body: 'Ogni ingrediente selezionato sulla base di evidenze e letteratura aggiornata',
  },
  {
    n: 'II',
    title: 'Persona al centro',
    body: 'Le esigenze reali delle persone guidano ogni scelta formulativa e comunicativa',
  },
  {
    n: 'III',
    title: 'Trasparenza assoluta',
    body: 'Ingredienti, dosaggi e certificazioni sempre dichiarati con chiarezza',
  },
  {
    n: 'IV',
    title: 'Eccellenza italiana',
    body: "Prodotto e confezionato in Italia secondo i più alti standard qualitativi",
  },
]

// ── Icons ──────────────────────────────────────────────────────────────────

function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
function FlaskIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6M9 3v8L5 21h14L15 11V3" />
      <path d="M5 16h14" />
    </svg>
  )
}
function MedalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="15" r="5" />
      <path d="M12 10V3M8 6l-3 3M16 6l3 3" />
    </svg>
  )
}
function ArticleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(184,144,60,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}
