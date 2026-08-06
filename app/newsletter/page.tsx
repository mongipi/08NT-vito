import type { Metadata } from 'next'
import { PageHeader } from '@/components/ui/PageHeader'
import { T } from '@/components/ui/T'
import { NewsletterOutcome } from './NewsletterOutcome'
import { getOutcome } from './outcomes'

export const metadata: Metadata = {
  title: 'Newsletter — 08 Natural Technology',
  robots: { index: false },
}

/**
 * Esiti dei link contenuti nelle email: conferma iscrizione e disiscrizione.
 * Prima le due route reindirizzavano alla home con un parametro che nessuno
 * leggeva, quindi chi cliccava non riceveva alcuna risposta.
 */
export default async function NewsletterEsitoPage({
  searchParams,
}: {
  searchParams: Promise<{ esito?: string }>
}) {
  const { esito } = await searchParams

  return (
    <main>
      <PageHeader eyebrow={<T k="newsletter_outcome_eyebrow" />} title={<T k={getOutcome(esito).titleKey} />} />

      <section className="section">
        <div className="v61-inner v61-narrow">
          <NewsletterOutcome esito={esito} />
        </div>
      </section>
    </main>
  )
}
