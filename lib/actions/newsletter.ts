'use server'

import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth/guards'
import {
  NEWSLETTER_DISCOUNT_CODE,
  NEWSLETTER_DISCOUNT_DATA,
} from '@/lib/domain/newsletter-discount'
import { sendNewsletterConfirmation } from '@/lib/email'
import { ensureDiscountExists } from '@/services/discounts'
import { activateSubscription, unsubscribeByEmail } from '@/services/newsletter'

const PROFILE_PATH = '/account/profilo'

/**
 * Iscrizione e cancellazione dall'area riservata.
 *
 * Copre i casi che il form pubblico non raggiunge: chi accede con Google, dove
 * il redirect OAuth non lascia spazio a una spunta, e chi si e' registrato
 * prima che la newsletter esistesse.
 *
 * Non serve il doppio consenso: per accedere l'indirizzo dev'essere gia'
 * verificato, quindi la proprieta' e' dimostrata.
 */
export async function subscribeFromAccount() {
  const user = await requireUser()
  if (!user.email) return

  const subscriber = await activateSubscription(user.email, 'it', 'account')

  try {
    await ensureDiscountExists(NEWSLETTER_DISCOUNT_CODE, {
      code: NEWSLETTER_DISCOUNT_CODE,
      ...NEWSLETTER_DISCOUNT_DATA,
    })
    await sendNewsletterConfirmation(
      user.email,
      NEWSLETTER_DISCOUNT_CODE,
      subscriber.unsubscribeToken
    )
  } catch (error) {
    // L'iscrizione resta valida anche se l'email non parte.
    console.error('Invio codice sconto newsletter fallito per', user.email, error)
  }

  revalidatePath(PROFILE_PATH)
}

export async function unsubscribeFromAccount() {
  const user = await requireUser()
  if (!user.email) return

  await unsubscribeByEmail(user.email)
  revalidatePath(PROFILE_PATH)
}
