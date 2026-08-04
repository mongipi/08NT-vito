import { prisma } from '@/lib/prisma'
import { normalizeEmail } from '@/lib/domain/email'
import { NEWSLETTER_STATUS } from '@/lib/domain/newsletter'
import type { NewsletterSubscriber } from '@prisma/client'

/** Iscritti alla newsletter. Unico punto di accesso a prisma.newsletterSubscriber. */

/**
 * Registra l'indirizzo in attesa di conferma.
 *
 * Un indirizzo già iscritto torna in "pending": è il caso di chi si reiscrive
 * dopo essersi cancellato, e di chi non ha mai confermato e richiede il link.
 * La riga non viene mai eliminata, così resta traccia di quando il consenso è
 * stato dato e revocato.
 */
export async function subscribeToNewsletter(
  email: string,
  locale: string,
  source: string
): Promise<NewsletterSubscriber> {
  const normalized = normalizeEmail(email)
  return prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    create: { email: normalized, locale, source, status: NEWSLETTER_STATUS.pending },
    update: { locale, source, status: NEWSLETTER_STATUS.pending, unsubscribedAt: null },
  })
}

export async function getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  return prisma.newsletterSubscriber.findUnique({ where: { email: normalizeEmail(email) } })
}

/** Conferma l'iscrizione. Restituisce null se l'indirizzo non è più in elenco. */
export async function confirmSubscription(email: string): Promise<NewsletterSubscriber | null> {
  const normalized = normalizeEmail(email)
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: normalized } })
  if (!existing) return null

  return prisma.newsletterSubscriber.update({
    where: { email: normalized },
    data: {
      status: NEWSLETTER_STATUS.active,
      confirmedAt: existing.confirmedAt ?? new Date(),
      unsubscribedAt: null,
    },
  })
}

/**
 * Revoca il consenso a partire dal token presente nelle email.
 * Restituisce null se il token non corrisponde a nessun iscritto.
 */
export async function unsubscribeByToken(token: string): Promise<NewsletterSubscriber | null> {
  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { unsubscribeToken: token },
  })
  if (!existing) return null

  return prisma.newsletterSubscriber.update({
    where: { id: existing.id },
    data: { status: NEWSLETTER_STATUS.unsubscribed, unsubscribedAt: new Date() },
  })
}

/**
 * Conferma un'iscrizione solo se era in attesa.
 * Usata quando l'utente verifica l'email dell'account: quella verifica dimostra
 * gia' la proprieta' dell'indirizzo, quindi non serve una seconda conferma.
 */
export async function confirmPendingSubscription(
  email: string
): Promise<NewsletterSubscriber | null> {
  const existing = await getSubscriberByEmail(email)
  if (existing?.status !== NEWSLETTER_STATUS.pending) return null
  return confirmSubscription(email)
}

/**
 * Iscrive direttamente un utente autenticato, senza passare da "pending".
 * Chi ha effettuato l'accesso ha gia' un indirizzo verificato, quindi il
 * doppio consenso sarebbe una conferma di qualcosa di gia' dimostrato.
 */
export async function activateSubscription(
  email: string,
  locale: string,
  source: string
): Promise<NewsletterSubscriber> {
  const normalized = normalizeEmail(email)
  const now = new Date()
  return prisma.newsletterSubscriber.upsert({
    where: { email: normalized },
    create: {
      email: normalized,
      locale,
      source,
      status: NEWSLETTER_STATUS.active,
      confirmedAt: now,
    },
    update: {
      locale,
      source,
      status: NEWSLETTER_STATUS.active,
      confirmedAt: now,
      unsubscribedAt: null,
    },
  })
}

export async function unsubscribeByEmail(email: string): Promise<NewsletterSubscriber | null> {
  const existing = await getSubscriberByEmail(email)
  if (!existing) return null
  return prisma.newsletterSubscriber.update({
    where: { id: existing.id },
    data: { status: NEWSLETTER_STATUS.unsubscribed, unsubscribedAt: new Date() },
  })
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } })
}

export interface NewsletterCounts {
  total: number
  active: number
  pending: number
  unsubscribed: number
}

export async function getSubscriberCounts(): Promise<NewsletterCounts> {
  const grouped = await prisma.newsletterSubscriber.groupBy({
    by: ['status'],
    _count: { _all: true },
  })
  const byStatus = Object.fromEntries(grouped.map((row) => [row.status, row._count._all]))
  return {
    total: grouped.reduce((sum, row) => sum + row._count._all, 0),
    active: byStatus[NEWSLETTER_STATUS.active] ?? 0,
    pending: byStatus[NEWSLETTER_STATUS.pending] ?? 0,
    unsubscribed: byStatus[NEWSLETTER_STATUS.unsubscribed] ?? 0,
  }
}
