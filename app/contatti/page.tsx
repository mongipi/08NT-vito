import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = { title: 'Contatti' }

const CONTACT_ROWS = [
  {
    icon: <MapPinIcon />,
    label: 'Indirizzo',
    value: 'Via Don Luigi Sturzo 44/46/48\nBitonto (BA) 70032',
  },
  { icon: <PhoneIcon />, label: 'Telefono', value: '080 303 1103' },
  { icon: <MailIcon />, label: 'Email', value: '08naturaltechnology@gmail.com' },
  { icon: <InstagramIcon />, label: 'Social', value: 'Seguici per aggiornamenti e contenuti' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
  fontSize: 12,
  fontWeight: 300,
  border: '1px solid var(--border-2)',
  background: '#fff',
  color: 'var(--ink)',
  padding: '11px 14px',
  outline: 'none',
}

export default function ContattiPage() {
  return (
    <main>
      <PageHeader eyebrow="Parliamo" script="Scrivici" title="Contatti." />

      <section className="section">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: contact info */}
          <div>
            <Eyebrow>Dove trovarci</Eyebrow>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(24px, 3vw, 30px)',
                fontWeight: 300,
                color: 'var(--ink)',
                lineHeight: 1.18,
                letterSpacing: '-0.01em',
                marginBottom: 32,
              }}
            >
              VIPHARMA di
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>
                Tatulli Vito &amp; Co.
              </em>
            </div>

            <div className="flex flex-col">
              {CONTACT_ROWS.map(({ icon, label, value }, i) => (
                <div
                  key={label}
                  className="flex items-start gap-4"
                  style={{
                    padding: '18px 0',
                    borderTop: i === 0 ? '0.5px solid var(--border)' : undefined,
                    borderBottom: '0.5px solid var(--border)',
                  }}
                >
                  <div
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      border: '1px solid var(--border-2)',
                      color: 'var(--green-2)',
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-4)',
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 300,
                        color: 'var(--ink)',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div>
            <Eyebrow>Scrivici</Eyebrow>
            <div
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(24px, 3vw, 30px)',
                fontWeight: 300,
                color: 'var(--ink)',
                lineHeight: 1.18,
                letterSpacing: '-0.01em',
                marginBottom: 32,
              }}
            >
              Mandaci un
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>messaggio.</em>
            </div>

            <form className="flex flex-col gap-3" action="#" method="post">
              <Field label="Nome e cognome">
                <input type="text" name="nome" placeholder="Mario Rossi" style={inputStyle} />
              </Field>
              <Field label="Email">
                <input type="email" name="email" placeholder="mario@email.com" style={inputStyle} />
              </Field>
              <Field label="Oggetto">
                <select name="oggetto" style={inputStyle}>
                  <option>Informazioni sui prodotti</option>
                  <option>Collaborazioni</option>
                  <option>Distribuzione</option>
                  <option>Altro</option>
                </select>
              </Field>
              <Field label="Messaggio">
                <textarea
                  name="messaggio"
                  placeholder="Scrivi qui il tuo messaggio..."
                  style={{ ...inputStyle, height: 96, resize: 'none' }}
                />
              </Field>
              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '12px 28px',
                  background: 'var(--green)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Invia messaggio
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-3.5 flex items-center gap-2.5"
      style={{
        fontSize: 9,
        fontWeight: 400,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: 'var(--amber)',
      }}
    >
      <span
        style={{ display: 'block', width: 22, height: '0.5px', background: 'var(--amber)', flexShrink: 0 }}
      />
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-4)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────

function MapPinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.29h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}
