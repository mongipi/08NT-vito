import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/services/products'
import { getArticles } from '@/services/articles'
import { ProductCard } from '@/components/ui/ProductCard'
import { formatDate } from '@/lib/utils'

export default async function HomePage() {
  const [products, articles] = await Promise.all([getProducts(), getArticles()])

  return (
    <main>
      {/* ════ HERO ════ */}
      <section
        style={{
          background: 'radial-gradient(circle at 72% 28%, rgba(184,144,60,0.13), transparent 28%), linear-gradient(135deg, var(--forest) 0%, #092212 100%)',
          borderBottom: '1px solid rgba(184,144,60,0.25)',
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ minHeight: 620 }}
        >
          {/* Left */}
          <div
            className="hero-col hero-col-l flex flex-col justify-center"
            style={{ borderRight: '0.5px solid rgba(184,144,60,0.18)' }}
          >
            <div
              className="flex items-center gap-2.5"
              style={{
                fontSize: '0.5625rem',
                fontWeight: 500,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--amber)',
                marginBottom: '1.125rem',
              }}
            >
              <span style={{ display: 'block', width: 24, height: '0.5px', background: 'var(--amber)', opacity: 0.75, flexShrink: 0 }} />
              Integratori alimentari
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 300,
                lineHeight: 1.03,
                letterSpacing: '-0.02em',
                color: 'var(--silver-3)',
                marginBottom: '1.5rem',
              }}
            >
              L&apos;<em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>Eccellenza</em>
              <br />
              come Standard.
            </h1>

            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 300,
                color: 'rgba(253,246,232,0.66)',
                lineHeight: 1.9,
                maxWidth: 520,
                marginBottom: '2.125rem',
              }}
            >
              Integratori alimentari italiani formulati con ingredienti selezionati, ricerca e
              attenzione ai dettagli. 08 Natural Technology nasce per trasformare qualità,
              trasparenza e cura formulativa in una promessa quotidiana di benessere.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/prodotti"
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '0.8125rem 1.625rem',
                  background: 'var(--amber)',
                  color: 'var(--forest)',
                  border: '1px solid var(--amber)',
                }}
              >
                Scopri i prodotti
              </Link>
              <Link
                href="/metodo"
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '0.8125rem 1.625rem',
                  background: 'transparent',
                  color: 'rgba(253,246,232,0.78)',
                  border: '1px solid rgba(253,246,232,0.22)',
                }}
              >
                Il metodo 08
              </Link>
            </div>

            <div
              style={{
                marginTop: '2.125rem',
                borderLeft: '1px solid rgba(184,144,60,0.42)',
                paddingLeft: '1.125rem',
                color: 'rgba(253,246,232,0.43)',
                fontSize: '0.66rem',
                fontWeight: 300,
                lineHeight: 1.8,
              }}
            >
              Ogni informazione regolatoria e ogni claim devono essere verificati sulla singola
              scheda prodotto prima della pubblicazione definitiva.
            </div>
          </div>

          {/* Right: logo */}
          <div className="hero-col hero-col-r flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="08 Natural Technology"
              width={340}
              height={340}
              style={{
                width: 'clamp(200px, 28vw, 340px)',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1) opacity(0.55)',
              }}
              priority
            />
          </div>
        </div>
      </section>

      {/* ════ TRUST BAR ════ */}
      <div
        style={{
          background: 'var(--forest)',
          borderTop: '0.5px solid rgba(184,144,60,0.25)',
          borderBottom: '1px solid var(--amber)',
          padding: '0.9375rem 3rem',
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderLeft: '0.5px solid rgba(184,144,60,0.16)' }}
        >
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex gap-3 items-start"
              style={{
                padding: '0 1.125rem',
                borderRight: '0.5px solid rgba(184,144,60,0.16)',
              }}
            >
              <div style={{ color: 'var(--amber)', fontSize: '1rem', marginTop: 2 }}>{item.icon}</div>
              <div>
                <div
                  style={{
                    fontSize: '0.625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.76)',
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: '0.64rem',
                    color: 'rgba(253,246,232,0.42)',
                    lineHeight: 1.55,
                    fontWeight: 300,
                  }}
                >
                  {item.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════ CHI SIAMO / FOUNDER ════ */}
      <section className="section">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:items-center">
          {/* Left: dark card con bottiglie */}
          <div
            style={{
              background: 'linear-gradient(160deg, var(--forest), #092212)',
              minHeight: 390,
              border: '1px solid rgba(184,144,60,0.25)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: '0 1.5rem',
            }}
          >
            {/* Stage light */}
            <div
              style={{
                position: 'absolute',
                width: 320, height: 320,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(184,144,60,0.14), transparent 62%)',
                top: '10%', left: '50%', transform: 'translateX(-50%)',
              }}
            />
            {/* Stage ring */}
            <div
              style={{
                position: 'absolute',
                inset: 40,
                border: '1px solid rgba(184,144,60,0.12)',
                borderRadius: '50%',
              }}
            />
            <div
              className="flex items-end justify-center gap-3"
              style={{ position: 'relative', zIndex: 2, paddingBottom: '1.75rem' }}
            >
              {BOTTLES.map((b) => (
                <Bottle key={b.name} {...b} />
              ))}
            </div>
          </div>

          {/* Right: text */}
          <div>
            <div
              className="flex items-center gap-2.5"
              style={{
                fontSize: '0.5625rem',
                fontWeight: 500,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: 'var(--amber)',
                marginBottom: '0.875rem',
              }}
            >
              <span style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }} />
              Chi siamo
            </div>

            <span
              style={{
                fontFamily: 'var(--font-great-vibes), cursive',
                fontSize: '2rem',
                color: 'var(--green-2)',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Lettera del Fondatore
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: '1.5rem',
              }}
            >
              Un sogno diventato{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>promessa quotidiana.</em>
            </h2>

            <blockquote
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.5625rem',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.55,
                color: 'var(--green)',
                borderLeft: '2px solid var(--amber)',
                paddingLeft: '1.375rem',
                margin: '0 0 1.5rem',
              }}
            >
              &ldquo;Per noi il benessere non è una semplice parola: è energia, equilibrio,
              serenità e qualità della vita.&rdquo;
            </blockquote>

            <div style={{ fontSize: '0.76rem', fontWeight: 300, lineHeight: 1.95, color: 'var(--ink-3)' }}>
              <p style={{ marginBottom: '0.875rem' }}>
                <strong>08 Natural Technology</strong> nasce dal desiderio di creare integratori
                alimentari curati nei dettagli, con formule comprensibili, ingredienti selezionati
                e un&apos;identità italiana riconoscibile.
              </p>
              <p>
                Non volevamo realizzare semplicemente prodotti, ma costruire un marchio capace
                di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di
                prendersi cura di sé.
              </p>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-great-vibes), cursive',
                fontSize: '2.125rem',
                color: 'var(--green-2)',
                marginTop: '1.125rem',
              }}
            >
              Vito Tatulli
            </div>
          </div>
        </div>
      </section>

      {/* ════ CATALOG STRIP ════ */}
      <div
        className="strip flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--amber)', background: '#fff', paddingTop: '0.6875rem', paddingBottom: '0.6875rem' }}
      >
        <span style={{ fontSize: '0.5625rem', fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)' }}>
          08 Natural Technology &nbsp;|&nbsp; Linea Prodotti
        </span>
        <div className="flex items-center gap-2" style={{ fontSize: '0.5625rem', fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--amber)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path d="M12 22C12 22 4 16 4 9a8 8 0 0 1 16 0c0 7-8 13-8 13z" /><path d="M12 9v13" />
          </svg>
          Catalogo 2026
        </div>
      </div>

      {/* ════ PRODUCTS ════ */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10" style={{ marginBottom: '2.875rem' }}>
          <div>
            <div className="flex items-center gap-2.5" style={{ fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '0.875rem' }}>
              <span style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }} />
              Le nostre formule
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
              }}
            >
              Prodotti pensati<br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>per esigenze reali.</em>
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9, maxWidth: 480 }}>
            Ogni linea aiuta l&apos;utente a riconoscersi subito: donna, beauty, microcircolo,
            energia quotidiana. Meno parole generiche, più chiarezza d&apos;uso.
          </p>
        </div>
        <div className="grid grid-cols-1 border border-[var(--border-2)] sm:grid-cols-2 lg:grid-cols-4" style={{ background: '#fff' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="home" />
          ))}
        </div>
      </section>

      {/* ════ IL METODO ════ */}
      <section className="section" style={{ background: 'var(--forest)' }}>
        <div className="flex items-center gap-2.5" style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(184,144,60,0.72)', marginBottom: '0.875rem' }}>
          <span style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', opacity: 0.75, flexShrink: 0 }} />
          Il metodo 08
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(22px, 3vw, 44px)',
            fontWeight: 300,
            lineHeight: 1.13,
            letterSpacing: '-0.01em',
            color: '#f0ede8',
            marginBottom: '0.75rem',
          }}
        >
          Dalla funzione alla <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>formula.</em>
        </h2>
        <p style={{ fontSize: '0.78rem', fontWeight: 300, color: 'rgba(253,246,232,0.52)', lineHeight: 1.9, maxWidth: 680, marginBottom: '3rem' }}>
          Una sezione pensata per aumentare fiducia: non solo cosa contiene il prodotto, ma
          perché è stato formulato in quel modo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ border: '0.5px solid rgba(184,144,60,0.22)' }}>
          {METHOD_STEPS.map((step, i) => (
            <div
              key={step.n}
              style={{
                padding: '2.125rem 1.625rem',
                background: 'rgba(255,255,255,0.04)',
                borderRight: i < 3 ? '0.5px solid rgba(184,144,60,0.14)' : undefined,
              }}
            >
              <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '3rem', fontStyle: 'italic', fontWeight: 300, color: 'rgba(184,144,60,0.28)', lineHeight: 1, marginBottom: '1.125rem' }}>
                {step.n}
              </div>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: '0.625rem' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(253,246,232,0.46)' }}>
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ TRASPARENZA ════ */}
      <section className="section">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="flex items-center gap-2.5" style={{ fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '0.875rem' }}>
              <span style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }} />
              Trasparenza
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: '0.75rem',
              }}
            >
              Cosa deve vedere<br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>chi acquista.</em>
            </h2>
            <p style={{ fontSize: '0.78rem', fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9, maxWidth: 680, marginBottom: '2.125rem' }}>
              Questa parte è stata inserita per rendere il sito più affidabile e meno &ldquo;solo
              estetico&rdquo;. È qui che il brand dimostra serietà.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '0.875rem' }}>
              {PROOF_CARDS.map((card) => (
                <div key={card.title} style={{ background: '#fff', border: '1px solid var(--border-2)', padding: '1.375rem', minHeight: 160 }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '0.5rem' }}>
                    {card.title}
                  </div>
                  <p style={{ fontSize: '0.71rem', fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.75 }}>{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reg box */}
          <div style={{ background: 'var(--forest)', padding: '2.125rem', border: '1px solid rgba(184,144,60,0.25)' }}>
            <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '2.125rem', fontWeight: 300, color: '#f0ede8', marginBottom: '1.125rem', lineHeight: 1.1 }}>
              Nota di conformità.
            </div>
            <p style={{ fontSize: '0.74rem', fontWeight: 300, lineHeight: 1.85, color: 'rgba(253,246,232,0.52)', marginBottom: '1rem' }}>
              Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno
              stile di vita sano. Le indicazioni devono restare entro i claim ammessi e verificabili.
            </p>
            <ul style={{ listStyle: 'none', marginTop: '1.125rem' }}>
              {['Niente promesse di cura o guarigione.', 'Niente "clinicamente provato" senza prove specifiche.', 'Claim Ministero/EFSA solo se corretti.', 'Ogni scheda prodotto deve avere avvertenze complete.'].map((item) => (
                <li key={item} style={{ fontSize: '0.65rem', color: 'rgba(253,246,232,0.64)', lineHeight: 1.75, borderTop: '0.5px solid rgba(184,144,60,0.15)', padding: '0.5625rem 0' }}>
                  <span style={{ color: 'var(--amber)', marginRight: '0.5625rem' }}>•</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ════ BLOG ════ */}
      <section className="section" style={{ background: 'var(--forest)' }}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10" style={{ marginBottom: '2.875rem' }}>
          <div>
            <div className="flex items-center gap-2.5" style={{ fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(184,144,60,0.72)', marginBottom: '0.875rem' }}>
              <span style={{ display: 'block', width: 22, height: '0.5px', background: 'rgba(184,144,60,0.5)', flexShrink: 0 }} />
              Approfondimenti
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: '#f0ede8',
              }}
            >
              Scienza, ingredienti<br />
              <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>e benessere.</em>
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', fontWeight: 300, color: 'rgba(253,246,232,0.52)', lineHeight: 1.9, maxWidth: 480 }}>
            Il blog diventa uno strumento SEO e di autorevolezza: articoli sugli ingredienti,
            guide d&apos;uso, consigli e spiegazioni semplici.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ border: '1px solid rgba(184,144,60,0.18)' }}>
          {articles.slice(0, 3).map((article, i) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="block transition-colors duration-200 hover:bg-white/5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRight: i < 2 ? '0.5px solid rgba(184,144,60,0.14)' : undefined,
              }}
            >
              <div className="flex items-center justify-center" style={{ height: 160, borderBottom: '0.5px solid rgba(184,144,60,0.14)', background: 'rgba(255,255,255,0.035)' }}>
                <ArticleIcon size={42} />
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.53rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--amber)', display: 'block', marginBottom: '0.625rem' }}>
                  {article.tag}
                </span>
                <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', color: '#f0ede8', fontSize: '1.3125rem', lineHeight: 1.35, fontWeight: 400, marginBottom: '0.625rem' }}>
                  {article.title}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'rgba(253,246,232,0.34)' }}>
                  {formatDate(article.publishedAt)} · {article.readingTime} min di lettura
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" style={{ marginTop: '1.625rem' }}>
          {BLOG_TOPICS.map((topic) => (
            <span key={topic} style={{ fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(253,246,232,0.58)', border: '0.5px solid rgba(184,144,60,0.22)', padding: '0.4375rem 0.75rem' }}>
              {topic}
            </span>
          ))}
        </div>
      </section>

      {/* ════ B2B ════ */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-2">
          <div style={{ background: '#fff', border: '1px solid var(--border-2)', padding: '2rem' }}>
            <div className="flex items-center gap-2.5" style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--amber)', marginBottom: '0.875rem' }}>
              <span style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }} />
              Retail &amp; Farmacie
            </div>
            <h3 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.875rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.875rem', lineHeight: 1.2 }}>
              Diventa rivenditore 08 Natural Technology.
            </h3>
            <p style={{ fontSize: '0.75rem', fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.85, marginBottom: '1.125rem' }}>
              Una sezione dedicata a farmacie, parafarmacie, erboristerie e partner commerciali.
              Qui il sito diventa anche uno strumento B2B, non solo una vetrina.
            </p>
            <Link
              href="/b2b"
              style={{ display: 'inline-block', fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.75rem 1.5rem', background: 'var(--green)', color: '#fff', border: '1px solid var(--green)' }}
            >
              Richiedi catalogo
            </Link>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-2)', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.875rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Materiali utili per il punto vendita.
            </h3>
            <div className="grid grid-cols-2" style={{ gap: '0.5rem' }}>
              {B2B_ITEMS.map((item) => (
                <div key={item} style={{ fontSize: '0.625rem', color: 'var(--ink-3)', borderTop: '1px solid var(--border)', padding: '0.625rem 0' }}>
                  <span style={{ color: 'var(--green-2)', fontWeight: 700, marginRight: '0.5rem' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── Static data ────────────────────────────────────────────────────────────

const BOTTLES = [
  { name: 'MenoPausa Complex', label: 'MenoPausa\nComplex', color: '#c94478', small: true },
  { name: 'Capelli Pelle & Unghie', label: 'Capelli Pelle\n& Unghie', color: '#1a6b30', tall: true },
  { name: 'Microcircolo Superior', label: 'Microcircolo\nSuperior', color: '#126b52' },
  { name: 'Multivitaminico & Minerali', label: 'Multivitaminico\n& Minerali', color: '#a86010', small: true },
]

const TRUST_ITEMS = [
  { icon: '🌿', title: 'Ingredienti selezionati', body: 'Attivi scelti per funzione, qualità e coerenza formulativa.' },
  { icon: '⚗', title: 'Metodo formulativo', body: 'Sinergie, dosaggi e razionalità d\'uso spiegati con chiarezza.' },
  { icon: '🛡', title: 'Trasparenza', body: 'Informazioni regolatorie riportate nella scheda di ciascun prodotto.' },
  { icon: '📍', title: 'Identità italiana', body: 'Un progetto nato in Puglia, pensato per farmacia, e-commerce e retail.' },
]

const METHOD_STEPS = [
  { n: 'I', title: 'Studio della funzione', body: 'Analisi dell\'esigenza: capelli, menopausa, microcircolo, energia e supporto quotidiano.' },
  { n: 'II', title: 'Selezione degli attivi', body: 'Ingredienti scelti per qualità, standardizzazione e coerenza con la funzione dichiarata.' },
  { n: 'III', title: 'Sinergie e dosaggi', body: 'Ogni formula viene costruita per lavorare in modo ordinato e comprensibile.' },
  { n: 'IV', title: 'Trasparenza finale', body: 'Modo d\'uso, ingredienti, avvertenze e note regolatorie sempre visibili in scheda.' },
]

const PROOF_CARDS = [
  { title: 'Ingredienti dichiarati', body: 'Attivi principali, forma dell\'ingrediente e, quando disponibile, titolo dell\'estratto.' },
  { title: 'Dosaggi chiari', body: 'Tabelle con quantità per dose giornaliera, senza nascondere le informazioni utili.' },
  { title: 'Regolatorio', body: 'Numero di notifica o stato regolatorio mostrato solo se realmente confermato.' },
  { title: 'Avvertenze', body: 'Uso corretto, limiti d\'età, gravidanza/allattamento e consulto medico quando necessario.' },
]

const BLOG_TOPICS = ['Ingredienti', 'Benessere femminile', 'Microcircolo', 'Capelli Pelle Unghie', 'Energia', 'Ricerca nutraceutica']

const B2B_ITEMS = ['Catalogo prodotti', 'Schede tecniche', 'Espositori', 'Materiale social', 'Formazione prodotto', 'Supporto commerciale']

// ── Components ────────────────────────────────────────────────────────────

function Bottle({ name, label, color, small, tall }: { name: string; label: string; color: string; small?: boolean; tall?: boolean }) {
  const w = small ? 72 : 86
  const h = tall ? 248 : small ? 194 : 228
  const lines = label.split('\n')

  return (
    <div
      aria-label={name}
      style={{
        width: w,
        height: h,
        borderRadius: '7px 7px 5px 5px',
        position: 'relative',
        background: 'linear-gradient(90deg, #0c0f0d, #1d2b22 28%, #355241 50%, #172218 76%, #070907)',
        boxShadow: '0 28px 46px rgba(0,0,0,0.28)',
        border: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Cap */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 29, background: 'linear-gradient(90deg, #7f7f78, #dadad1 38%, #a4a49d 72%, #696964)', borderBottom: '1px solid rgba(0,0,0,0.25)' }} />
      {/* Label */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          right: 8,
          top: 55,
          bottom: 22,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,245,0.92))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0.625rem 0.375rem',
          border: '1px solid rgba(184,144,60,0.23)',
        }}
      >
        <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.75rem', color: 'var(--green)', lineHeight: 1 }}>08</div>
        <div style={{ fontSize: '0.4375rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)', lineHeight: 1.35, marginTop: '0.4375rem' }}>
          {lines.map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
        </div>
        <div style={{ height: 3, width: 38, marginTop: '0.5625rem', background: color }} />
      </div>
    </div>
  )
}

function ArticleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(184,144,60,0.32)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
