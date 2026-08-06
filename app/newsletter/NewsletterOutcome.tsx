'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { getOutcome } from './outcomes'

/** Contenuto della pagina /newsletter (esito conferma/disiscrizione), client per poter tradurre. */
export function NewsletterOutcome({ esito }: { esito?: string }) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const outcome = getOutcome(esito)
  const accento = outcome.tone === 'positivo' ? 'var(--forest)' : '#b45309'

  return (
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
        {t(outcome.bodyKey)}
      </p>

      {outcome.cta && (
        <Link
          href={outcome.cta.href}
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
          {t(outcome.cta.labelKey)}
        </Link>
      )}
    </div>
  )
}
