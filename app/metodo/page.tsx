import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Il Metodo 08 — Qualità Formulativa' }

const STEPS = [
  {
    n: 'I',
    title: 'Esigenza reale',
    body: 'Si parte da bisogni chiari: energia, microcircolo, menopausa, capelli, pelle e unghie.',
  },
  {
    n: 'II',
    title: 'Attivi selezionati',
    body: 'Ingredienti scelti per funzione, qualità e ruolo nella formula.',
  },
  {
    n: 'III',
    title: 'Formula leggibile',
    body: 'Una scheda deve far capire perché ogni ingrediente è presente.',
  },
  {
    n: 'IV',
    title: 'Uso responsabile',
    body: 'Modo d\'uso e avvertenze visibili, senza promesse eccessive.',
  },
]

export default function MetodoPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section
        style={{
          background: 'radial-gradient(circle at 72% 28%, rgba(184,144,60,0.13), transparent 28%), linear-gradient(135deg, var(--forest) 0%, #092212 100%)',
          borderBottom: '1px solid var(--gold-border, rgba(184,144,60,0.25))',
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ minHeight: 520 }}
        >
          <div
            className="hero-col hero-col-l flex flex-col justify-center"
            style={{ borderRight: '0.5px solid rgba(184,144,60,0.18)' }}
          >
            <Eyebrow>Metodo 08</Eyebrow>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 300,
                lineHeight: 1.03,
                letterSpacing: '-0.02em',
                color: 'var(--silver-3)',
                marginBottom: 24,
              }}
            >
              La qualità<br />
              <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>non è un dettaglio.</em>
            </h1>
            <p
              style={{
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(253,246,232,0.66)',
                lineHeight: 1.9,
                maxWidth: 520,
                marginBottom: 34,
              }}
            >
              Una pagina dedicata al processo formulativo: aiuta il cliente a capire che dietro
              ogni prodotto non c&apos;è improvvisazione, ma una logica di funzione, ingredienti
              e trasparenza.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/prodotti"
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '13px 26px',
                  background: 'var(--amber)',
                  color: 'var(--forest)',
                  border: '1px solid var(--amber)',
                }}
              >
                Scopri le formule
              </Link>
              <Link
                href="/trasparenza"
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '13px 26px',
                  background: 'transparent',
                  color: 'rgba(253,246,232,0.78)',
                  border: '1px solid rgba(253,246,232,0.22)',
                }}
              >
                Qualità &amp; Trasparenza
              </Link>
            </div>
          </div>

          {/* Right: 08 mark */}
          <div className="flex items-center justify-center hero-col">
            <div style={{ textAlign: 'center', color: 'rgba(232,232,226,0.3)' }}>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(80px, 12vw, 120px)',
                  lineHeight: 1,
                  fontWeight: 300,
                }}
              >
                08
              </div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '0.34em',
                  textTransform: 'uppercase',
                }}
              >
                Metodo Formulativo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHOD STEPS ── */}
      <section className="section" style={{ background: 'var(--forest)' }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ border: '0.5px solid rgba(184,144,60,0.22)' }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              style={{
                padding: '34px 26px',
                background: 'rgba(255,255,255,0.04)',
                borderRight: i < STEPS.length - 1 ? '0.5px solid rgba(184,144,60,0.14)' : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 48,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'rgba(184,144,60,0.28)',
                  lineHeight: 1,
                  marginBottom: 18,
                }}
              >
                {step.n}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)',
                  marginBottom: 10,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 11.2,
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(253,246,232,0.46)',
                }}
              >
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRINCIPLES ── */}
      <section className="section">
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 24, marginTop: 0 }}>
          {[
            {
              title: 'Funzione prima di tutto',
              body: 'Ogni prodotto nasce da un\'esigenza reale. Non aggiungiamo ingredienti per riempire una formula, ma per rispondere a una necessità specifica.',
            },
            {
              title: 'Trasparenza totale',
              body: 'Ingredienti, dosaggi e avvertenze sono sempre visibili nella scheda prodotto. Non nascondiamo nulla di ciò che il cliente ha il diritto di sapere.',
            },
            {
              title: 'Qualità Made in Italy',
              body: 'Il progetto nasce e si sviluppa in Italia. La qualità non è una promessa vuota, è il risultato di scelte precise in ogni fase del processo.',
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                padding: '28px 24px',
                background: 'var(--green-ll)',
                border: '1px solid var(--border-2)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                  marginBottom: 10,
                }}
              >
                {card.title}
              </div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: 'var(--ink-3)',
                  lineHeight: 1.85,
                }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2.5"
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'var(--amber)',
        marginBottom: 18,
      }}
    >
      <span style={{ display: 'block', width: 24, height: '0.5px', background: 'var(--amber)', opacity: 0.75, flexShrink: 0 }} />
      {children}
    </div>
  )
}
