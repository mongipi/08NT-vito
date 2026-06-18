import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = { title: 'Brand' }

const PROCESS_STEPS = [
  {
    n: '01',
    title: 'Ascolto',
    body: 'Identifichiamo le esigenze reali di benessere attraverso ricerca e confronto con le persone',
  },
  {
    n: '02',
    title: 'Ingredienti',
    body: 'Selezioniamo ogni principio attivo per qualità, origine, forma chimica e biodisponibilità',
  },
  {
    n: '03',
    title: 'Formulazione',
    body: 'Costruiamo sinergie efficaci tra i componenti, calibrando i dosaggi con precisione scientifica',
  },
  {
    n: '04',
    title: 'Certificazione',
    body: 'Ogni prodotto è notificato al Ministero della Salute italiano secondo normativa vigente',
  },
]

export default function BrandPage() {
  return (
    <main>
      <PageHeader
        eyebrow="La nostra identità"
        script="Chi siamo"
        title={
          <>
            Una promessa
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>mantenuta ogni giorno.</em>
          </>
        }
      />

      {/* ── LETTERA ── */}
      <section className="section">
        <div style={{ maxWidth: 540, margin: '0 auto' }}>
          <div style={{ background: 'var(--green)', padding: '16px 32px', marginBottom: 32 }}>
            <span
              style={{
                fontFamily: 'var(--font-great-vibes), cursive',
                fontSize: 34,
                color: '#fff',
              }}
            >
              Lettera del Fondatore
            </span>
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: 'var(--ink-2)',
              lineHeight: 2,
              textAlign: 'justify',
            }}
          >
            <p style={{ marginBottom: 18 }}>
              <strong>08 Natural Technology</strong> nasce da un sogno: creare qualcosa di cui
              poter essere veramente <strong>orgogliosi</strong>.
            </p>
            <p style={{ marginBottom: 18 }}>
              Non volevamo semplicemente realizzare degli integratori, ma dare vita a prodotti
              sviluppati con <strong>passione</strong>, <strong>attenzione</strong> e{' '}
              <strong>rispetto</strong> per le persone che ogni giorno ripongono la loro{' '}
              <strong>fiducia</strong> in noi.
            </p>
            <p style={{ marginBottom: 18 }}>
              Dietro ogni formula ci sono ricerca, impegno e una scelta accurata degli ingredienti,
              perché crediamo che la <strong>qualità</strong> non sia un dettaglio, ma un{' '}
              <strong>valore fondamentale</strong>.
            </p>
            <p style={{ marginBottom: 18 }}>
              Per noi il benessere non è una semplice parola: è <strong>energia</strong>,{' '}
              <strong>equilibrio</strong>, <strong>serenità</strong> e{' '}
              <strong>qualità della vita</strong>. È qualcosa di prezioso che merita{' '}
              <strong>attenzione e cura</strong>.
            </p>
            <p style={{ marginBottom: 18 }}>
              Per questo lavoriamo ogni giorno con lo stesso obiettivo: offrire prodotti che
              uniscano <strong>qualità</strong>, <strong>innovazione</strong> e{' '}
              <strong>fiducia</strong>, mettendo sempre la persona al centro di ogni scelta.
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
              fontSize: 30,
              color: 'var(--green-2)',
              textAlign: 'right',
              marginTop: 8,
            }}
          >
            Vito Tatulli
          </div>
        </div>
      </section>

      {/* ── PROCESS (dark) ── */}
      <section className="section" style={{ background: 'var(--forest)' }}>
        <div
          className="mb-3.5 flex items-center gap-2.5"
          style={{
            fontSize: 9,
            fontWeight: 400,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(184,144,60,0.7)',
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
          Il nostro metodo
        </div>
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(26px, 3.5vw, 40px)',
            fontWeight: 300,
            color: '#f0ede8',
            lineHeight: 1.18,
            letterSpacing: '-0.01em',
          }}
        >
          Dal sogno <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>alla capsula.</em>
        </div>

        <div
          className="mt-[52px] grid grid-cols-1 border border-[rgba(184,144,60,0.2)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.n}
              style={{
                padding: '30px 24px',
                background: 'rgba(255,255,255,0.04)',
                borderRight:
                  i < PROCESS_STEPS.length - 1
                    ? '0.5px solid rgba(184,144,60,0.12)'
                    : undefined,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 44,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'rgba(184,144,60,0.25)',
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {step.n}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,237,232,0.7)',
                  marginBottom: 8,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 300,
                  color: 'rgba(240,237,232,0.4)',
                  lineHeight: 1.75,
                }}
              >
                {step.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
