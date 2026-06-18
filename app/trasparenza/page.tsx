import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Trasparenza — Ingredienti e Qualità' }

const PROOF_CARDS = [
  {
    title: 'Ingredienti',
    body: 'Attivi principali e ingredienti di supporto distinguibili. Forma dell\'ingrediente e, quando disponibile, titolo dell\'estratto.',
  },
  {
    title: 'Schede tecniche',
    body: 'Informazioni complete su ciascun prodotto, disponibili in scheda per clienti e rivenditori.',
  },
  {
    title: 'Controlli',
    body: 'Standard produttivi e controlli comunicati con serietà, solo se documentati e verificabili.',
  },
  {
    title: 'Uso corretto',
    body: 'Indicazioni pratiche per un utilizzo consapevole. Avvertenze sempre visibili, senza eccezioni.',
  },
]

const COMPLIANCE_ITEMS = [
  'Claim ammessi e non terapeutici.',
  'Numeri di notifica solo dove confermati.',
  'Avvertenze complete in ogni scheda prodotto.',
  'Privacy, cookie, note legali e contatti visibili.',
]

export default function TrasparenzaPage() {
  return (
    <main>
      <section className="section">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:items-start">
          {/* Left */}
          <div>
            <Eyebrow>Trasparenza</Eyebrow>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: 16,
              }}
            >
              Ingredienti, dosaggi<br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>e informazioni chiare.</em>
            </h1>
            <p
              style={{
                fontSize: 12.5,
                fontWeight: 300,
                color: 'var(--ink-3)',
                lineHeight: 1.9,
                maxWidth: 680,
                marginBottom: 34,
              }}
            >
              Questa pagina deve diventare una garanzia di serietà: il cliente deve poter
              leggere cosa assume, perché e con quali limiti d&apos;uso.
            </p>

            {/* Proof cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
              {PROOF_CARDS.map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--border-2)',
                    padding: '22px',
                    minHeight: 140,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      color: 'var(--ink)',
                      marginBottom: 8,
                    }}
                  >
                    {card.title}
                  </div>
                  <p
                    style={{
                      fontSize: 11.4,
                      fontWeight: 300,
                      color: 'var(--ink-3)',
                      lineHeight: 1.75,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: compliance box */}
          <div
            style={{
              background: 'var(--forest)',
              padding: 34,
              border: '1px solid rgba(184,144,60,0.25)',
              position: 'sticky',
              top: 80,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 34,
                fontWeight: 300,
                color: '#f0ede8',
                marginBottom: 18,
                lineHeight: 1.1,
              }}
            >
              Pubblicazione sicura.
            </div>
            <p
              style={{
                fontSize: 11.8,
                fontWeight: 300,
                lineHeight: 1.85,
                color: 'rgba(253,246,232,0.52)',
                marginBottom: 16,
              }}
            >
              Prima della messa online definitiva bisogna verificare claim, notifiche, avvertenze,
              etichette e testi di ogni singolo prodotto.
            </p>
            <ul style={{ listStyle: 'none', marginTop: 18 }}>
              {COMPLIANCE_ITEMS.map((item) => (
                <li
                  key={item}
                  style={{
                    fontSize: 10.4,
                    color: 'rgba(253,246,232,0.64)',
                    lineHeight: 1.75,
                    borderTop: '0.5px solid rgba(184,144,60,0.15)',
                    padding: '9px 0',
                  }}
                >
                  <span style={{ color: 'var(--amber)', marginRight: 9 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 28 }}>
              <Link
                href="/prodotti"
                style={{
                  display: 'inline-block',
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  background: 'var(--amber)',
                  color: 'var(--forest)',
                }}
              >
                Scopri le formule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section
        className="section"
        style={{ background: 'var(--paper-2)', borderTop: '1px solid var(--border)' }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-4)',
              marginBottom: 12,
            }}
          >
            Nota legale
          </div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 300,
              color: 'var(--ink-3)',
              lineHeight: 1.8,
            }}
          >
            Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno
            stile di vita sano. Tenere fuori dalla portata dei bambini al di sotto dei 3 anni.
            In caso di gravidanza, allattamento, patologie o terapie farmacologiche consultare
            il medico. Le informazioni contenute nel sito sono da verificare sulla singola scheda
            prodotto prima della pubblicazione definitiva.
          </p>
        </div>
      </section>
    </main>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-3.5 flex items-center gap-2.5"
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: 'var(--amber)',
      }}
    >
      <span style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }} />
      {children}
    </div>
  )
}
