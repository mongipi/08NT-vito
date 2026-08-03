import { z } from 'zod'
import { SETTING_KEYS } from '@/lib/settings'
import { optionalString } from '@/lib/validation/form'

/**
 * Validazione delle impostazioni salvate da /admin/impostazioni.
 *
 * I quattro importi non possono essere vuoti: sono l'unica fonte dei prezzi di
 * spedizione e sovrapprezzi, e un campo vuoto vale zero. Salvarlo per errore
 * significherebbe vendere con spedizione gratuita senza accorgersene.
 */

/** Importo obbligatorio: numero valido, maggiore o uguale a zero. */
const requiredAmount = (campo: string) =>
  z.unknown().transform((value, ctx) => {
    const raw = String(value ?? '')
      .trim()
      .replace(',', '.')

    if (!raw) {
      ctx.addIssue({ code: 'custom', message: `${campo}: il campo non può restare vuoto` })
      return z.NEVER
    }

    const parsed = Number.parseFloat(raw)
    if (!Number.isFinite(parsed)) {
      ctx.addIssue({ code: 'custom', message: `${campo}: "${raw}" non è un importo valido` })
      return z.NEVER
    }
    if (parsed < 0) {
      ctx.addIssue({ code: 'custom', message: `${campo}: non può essere negativo` })
      return z.NEVER
    }

    return String(parsed)
  })

/** Chiavi testuali: salvate così come sono, vuoto ammesso. */
const TEXT_KEYS = [
  SETTING_KEYS.IBAN,
  SETTING_KEYS.INTESTATARIO,
  SETTING_KEYS.COMPANY_LEGAL_NAME,
  SETTING_KEYS.COMPANY_ADDRESS,
  SETTING_KEYS.COMPANY_PHONE,
  SETTING_KEYS.COMPANY_WHATSAPP,
  SETTING_KEYS.COMPANY_EMAIL,
  SETTING_KEYS.WHATSAPP_MESSAGE,
  SETTING_KEYS.SOCIAL_FACEBOOK,
  SETTING_KEYS.SOCIAL_INSTAGRAM,
  SETTING_KEYS.SOCIAL_TIKTOK,
  SETTING_KEYS.NEWSLETTER_KICKER,
  SETTING_KEYS.NEWSLETTER_TITLE,
  SETTING_KEYS.NEWSLETTER_BODY,
  SETTING_KEYS.NEWSLETTER_BUTTON_LABEL,
  SETTING_KEYS.LEGAL_PRIVACY_OVERRIDE,
  SETTING_KEYS.LEGAL_COOKIE_OVERRIDE,
  SETTING_KEYS.LEGAL_NOTES_OVERRIDE,
  SETTING_KEYS.LEGAL_TERMS_OVERRIDE,
] as const

/** Ogni chiave testuale usa lo stesso schema: vuoto ammesso, salvato come "". */
const textField = optionalString.transform((value) => value ?? '')

const textShape = Object.fromEntries(TEXT_KEYS.map((key) => [key, textField])) as Record<
  (typeof TEXT_KEYS)[number],
  typeof textField
>

export const settingsSchema = z.object({
  ...textShape,
  [SETTING_KEYS.COD_SURCHARGE]: requiredAmount('Supplemento contrassegno'),
  [SETTING_KEYS.SPEDIZIONE_GRATUITA]: requiredAmount('Soglia spedizione gratuita'),
  [SETTING_KEYS.PREZZO_SPEDIZIONE]: requiredAmount('Prezzo spedizione standard'),
  [SETTING_KEYS.SUPPLEMENTO_ESTERO]: requiredAmount('Supplemento spedizione estera'),
})

export type SettingsInput = z.infer<typeof settingsSchema>
