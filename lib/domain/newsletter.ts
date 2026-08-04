/**
 * Stati dell'iscrizione alla newsletter.
 *
 * L'iscrizione segue il doppio consenso: chi lascia l'indirizzo resta in
 * "pending" finché non clicca il link ricevuto per posta. Solo allora diventa
 * "active" e riceve il codice sconto. Serve a impedire che qualcuno iscriva
 * l'indirizzo di un'altra persona.
 */
export const NEWSLETTER_STATUS = {
  pending: 'pending',
  active: 'active',
  unsubscribed: 'unsubscribed',
} as const

export type NewsletterStatus = (typeof NEWSLETTER_STATUS)[keyof typeof NEWSLETTER_STATUS]

export const NEWSLETTER_STATUS_LABELS: Record<NewsletterStatus, string> = {
  pending: 'In attesa di conferma',
  active: 'Iscritto',
  unsubscribed: 'Disiscritto',
}

export function isNewsletterStatus(value: unknown): value is NewsletterStatus {
  return typeof value === 'string' && value in NEWSLETTER_STATUS_LABELS
}

/** Prefisso usato sui token di conferma, sulla tabella VerificationToken. */
export const NEWSLETTER_TOKEN_PREFIX = 'newsletter:'
