import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'

export const metadata: Metadata = {
  title: 'Newsletter — 08 Natural Technology',
  robots: { index: false },
}

type Esito =
  | 'confermata'
  | 'confermata-senza-email'
  | 'scaduta'
  | 'non-valida'
  | 'disiscritto'
  | 'disiscrizione-non-valida'

interface Messaggio {
  eyebrow: string
  title: string
  body: string
  tone: 'positivo' | 'attenzione'
  cta?: { label: string; href: string }
}

/**
 * Esiti dei link contenuti nelle email: conferma iscrizione e disiscrizione.
 * Prima le due route reindirizzavano alla home con un parametro che nessuno
 * leggeva, quindi chi cliccava non riceveva alcuna risposta.
 */
const MESSAGGI: Record<Esito, Messaggio> = {
  confermata: {
    eyebrow: 'Newsletter',
    title: 'Iscrizione confermata',
    body: 'Grazie. Ti abbiamo inviato una email con il tuo codice di extra sconto del 5%, da usare al checkout.',
    tone: 'positivo',
    cta: { label: 'Scopri i prodotti', href: '/prodotti' },
  },
  'confermata-senza-email': {
    eyebrow: 'Newsletter',
    title: 'Iscrizione confermata',
    body: "La tua iscrizione è attiva, ma non siamo riusciti a inviarti l'email con il codice sconto. Scrivici e te lo forniamo subito.",
    tone: 'attenzione',
    cta: { label: 'Contattaci', href: '/contatti' },
  },
  scaduta: {
    eyebrow: 'Newsletter',
    title: 'Link scaduto',
    body: 'Il link di conferma resta valido 24 ore. Iscriviti di nuovo per riceverne uno nuovo.',
    tone: 'attenzione',
    cta: { label: 'Torna alla home', href: '/' },
  },
  'non-valida': {
    eyebrow: 'Newsletter',
    title: 'Link non valido',
    body: 'Questo link di conferma non è più utilizzabile: potrebbe essere già stato usato.',
    tone: 'attenzione',
    cta: { label: 'Torna alla home', href: '/' },
  },
  disiscritto: {
    eyebrow: 'Newsletter',
    title: 'Iscrizione annullata',
    body: 'Non riceverai più le nostre comunicazioni. Se cambi idea puoi iscriverti di nuovo in qualsiasi momento.',
    tone: 'positivo',
    cta: { label: 'Torna alla home', href: '/' },
  },
  'disiscrizione-non-valida': {
    eyebrow: 'Newsletter',
    title: 'Link non valido',
    body: 'Non siamo riusciti a trovare l’iscrizione collegata a questo link. Potrebbe essere già stata annullata.',
    tone: 'attenzione',
    cta: { label: 'Torna alla home', href: '/' },
  },
}

export default async function NewsletterEsitoPage({
  searchParams,
}: {
  searchParams: Promise<{ esito?: string }>
}) {
  const { esito } = await searchParams
  const messaggio = MESSAGGI[esito as Esito] ?? MESSAGGI['non-valida']
  const accento = messaggio.tone === 'positivo' ? 'var(--forest)' : '#b45309'

  return (
    <main>
      <PageHeader eyebrow={messaggio.eyebrow} title={messaggio.title} />

      <section className="section">
        <div className="v61-inner v61-narrow">
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${accento}`,
              padding: '2rem 1.75rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                fontWeight: 300,
                color: 'var(--ink-2)',
              }}
            >
              {messaggio.body}
            </p>

            {messaggio.cta && (
              <Link
                href={messaggio.cta.href}
                style={{
                  display: 'inline-block',
                  marginTop: '1.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'var(--forest)',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {messaggio.cta.label}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
