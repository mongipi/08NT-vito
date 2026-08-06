import type { DictionaryKey } from '@/lib/i18n/data'

export type NewsletterEsito =
  | 'confermata'
  | 'confermata-senza-email'
  | 'scaduta'
  | 'non-valida'
  | 'disiscritto'
  | 'disiscrizione-non-valida'

interface OutcomeConfig {
  titleKey: DictionaryKey
  bodyKey: DictionaryKey
  tone: 'positivo' | 'attenzione'
  cta?: { labelKey: DictionaryKey; href: string }
}

export const OUTCOMES: Record<NewsletterEsito, OutcomeConfig> = {
  confermata: {
    titleKey: 'newsletter_outcome_confirmed_title',
    bodyKey: 'newsletter_outcome_confirmed_body',
    tone: 'positivo',
    cta: { labelKey: 'home_formulas_cta', href: '/prodotti' },
  },
  'confermata-senza-email': {
    titleKey: 'newsletter_outcome_confirmed_title',
    bodyKey: 'newsletter_outcome_confirmed_no_email_body',
    tone: 'attenzione',
    cta: { labelKey: 'method_vision_cta2', href: '/contatti' },
  },
  scaduta: {
    titleKey: 'newsletter_outcome_expired_title',
    bodyKey: 'newsletter_outcome_expired_body',
    tone: 'attenzione',
    cta: { labelKey: 'common_back_home', href: '/' },
  },
  'non-valida': {
    titleKey: 'newsletter_outcome_invalid_title',
    bodyKey: 'newsletter_outcome_invalid_body',
    tone: 'attenzione',
    cta: { labelKey: 'common_back_home', href: '/' },
  },
  disiscritto: {
    titleKey: 'newsletter_outcome_unsubscribed_title',
    bodyKey: 'newsletter_outcome_unsubscribed_body',
    tone: 'positivo',
    cta: { labelKey: 'common_back_home', href: '/' },
  },
  'disiscrizione-non-valida': {
    titleKey: 'newsletter_outcome_invalid_title',
    bodyKey: 'newsletter_outcome_unsub_invalid_body',
    tone: 'attenzione',
    cta: { labelKey: 'common_back_home', href: '/' },
  },
}

export function getOutcome(esito?: string): OutcomeConfig {
  return OUTCOMES[esito as NewsletterEsito] ?? OUTCOMES['non-valida']
}
