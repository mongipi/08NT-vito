import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'B2B — Diventa Rivenditore' }

const OFFERINGS = [
  'Catalogo prodotti',
  'Schede tecniche PDF',
  'Listino commerciale',
  'Materiale vetrina',
  'Contenuti social',
  'Supporto formazione',
  'Assistenza commerciale',
  'Materiali promozionali',
]

export default function B2BPage() {
  return (
    <main>
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-2">
          {/* Left: main pitch */}
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--border-2)',
              padding: 32,
            }}
          >
            <Eyebrow>B2B</Eyebrow>
            <h1
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: 18,
              }}
            >
              Diventa rivenditore<br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>08 Natural Technology.</em>
            </h1>
            <p
              style={{
                fontSize: 12,
                fontWeight: 300,
                color: 'var(--ink-3)',
                lineHeight: 1.85,
                marginBottom: 28,
              }}
            >
              Pagina dedicata a farmacie, parafarmacie, erboristerie e operatori del settore.
              Qui il sito raccoglie contatti qualificati e richieste catalogo da partner
              commerciali interessati alla linea 08 Natural Technology.
            </p>

            <div
              style={{
                marginBottom: 28,
                padding: '16px 20px',
                background: 'var(--green-ll)',
                border: '1px solid rgba(26,74,46,0.2)',
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--green-2)', lineHeight: 1.75 }}>
                Siamo presenti in farmacia, parafarmacia ed erboristeria. Se sei un operatore
                del settore e vuoi portare 08 nel tuo punto vendita, contattaci per ricevere
                il catalogo commerciale e le condizioni di fornitura.
              </p>
            </div>

            <Link
              href="/contatti"
              style={{
                display: 'inline-block',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '13px 26px',
                background: 'var(--green)',
                color: '#fff',
                border: '1px solid var(--green)',
              }}
            >
              Richiedi informazioni
            </Link>
          </div>

          {/* Right: offerings grid */}
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--border-2)',
              padding: 32,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 30,
                fontWeight: 400,
                color: 'var(--ink)',
                marginBottom: 20,
              }}
            >
              Cosa offriamo al rivenditore.
            </h2>
            <div className="grid grid-cols-2" style={{ gap: 8 }}>
              {OFFERINGS.map((item) => (
                <div
                  key={item}
                  style={{
                    fontSize: 10,
                    color: 'var(--ink-3)',
                    borderTop: '1px solid var(--border)',
                    padding: '10px 0',
                  }}
                >
                  <span style={{ color: 'var(--green-2)', fontWeight: 700, marginRight: 8 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-4)',
                  marginBottom: 8,
                }}
              >
                Zona di distribuzione
              </div>
              <p style={{ fontSize: 11.5, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.7 }}>
                VIPHARMA di Tatulli Vito &amp; Co. S.A.S.<br />
                Via Don Luigi Sturzo 44/46/48 — 70032 Bitonto (BA)<br />
                Tel. 080 303 1103 · 08naturaltechnology@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY 08 ── */}
      <section className="section" style={{ background: 'var(--forest)' }}>
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
          Perché 08
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(22px, 3vw, 34px)',
            fontWeight: 300,
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
            color: '#f0ede8',
            marginBottom: 48,
          }}
        >
          Un marchio che costruisce fiducia<br />
          <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>nel punto vendita.</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 1, background: 'rgba(184,144,60,0.12)' }}>
          {[
            { label: 'Prodotti notificati', body: 'Integratori alimentari notificati al Ministero della Salute della Repubblica Italiana.' },
            { label: 'Made in Italy', body: 'Progetto nato a Bitonto, in Puglia. Identità italiana chiara e riconoscibile.' },
            { label: 'Formule curate', body: 'Ingredienti selezionati, dosaggi dichiarati, comunicazione responsabile e trasparente.' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '28px 24px',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
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
                {item.label}
              </div>
              <p style={{ fontSize: 11.2, fontWeight: 300, lineHeight: 1.8, color: 'rgba(253,246,232,0.46)' }}>
                {item.body}
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
      className="mb-4 flex items-center gap-2.5"
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
