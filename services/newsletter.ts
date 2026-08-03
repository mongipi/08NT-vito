import { prisma } from '@/lib/prisma'

/** Iscritti alla newsletter. Unico punto di accesso a prisma.newsletterSubscriber. */
export async function subscribeToNewsletter(
  email: string,
  locale: string,
  source: string
): Promise<void> {
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, locale, source },
    update: { locale, source, status: 'active' },
  })
}
