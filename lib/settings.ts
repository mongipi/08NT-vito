import {
  DEFAULT_COOKIE_OVERRIDE_JSON,
  DEFAULT_LEGAL_NOTES_OVERRIDE_JSON,
  DEFAULT_PRIVACY_OVERRIDE_JSON,
  DEFAULT_TERMS_OVERRIDE_JSON,
} from '@/lib/legal-overrides'
import { isPrismaInitError, logPrismaInitError } from '@/lib/prisma-errors'
import { getAllSettings } from '@/services/settings'

export const SETTING_KEYS = {
  IBAN: 'IBAN_BONIFICO',
  INTESTATARIO: 'INTESTATARIO_BONIFICO',
  COD_SURCHARGE: 'COD_SURCHARGE',
  SPEDIZIONE_GRATUITA: 'SPEDIZIONE_GRATUITA',
  PREZZO_SPEDIZIONE: 'PREZZO_SPEDIZIONE',
  SUPPLEMENTO_ESTERO: 'SUPPLEMENTO_ESTERO',
  COMPANY_LEGAL_NAME: 'COMPANY_LEGAL_NAME',
  COMPANY_ADDRESS: 'COMPANY_ADDRESS',
  COMPANY_PHONE: 'COMPANY_PHONE',
  COMPANY_WHATSAPP: 'COMPANY_WHATSAPP',
  COMPANY_EMAIL: 'COMPANY_EMAIL',
  WHATSAPP_MESSAGE: 'WHATSAPP_MESSAGE',
  SOCIAL_FACEBOOK: 'SOCIAL_FACEBOOK',
  SOCIAL_INSTAGRAM: 'SOCIAL_INSTAGRAM',
  SOCIAL_TIKTOK: 'SOCIAL_TIKTOK',
  NEWSLETTER_KICKER: 'NEWSLETTER_KICKER',
  NEWSLETTER_TITLE: 'NEWSLETTER_TITLE',
  NEWSLETTER_BODY: 'NEWSLETTER_BODY',
  NEWSLETTER_BUTTON_LABEL: 'NEWSLETTER_BUTTON_LABEL',
  LEGAL_PRIVACY_OVERRIDE: 'LEGAL_PRIVACY_OVERRIDE',
  LEGAL_COOKIE_OVERRIDE: 'LEGAL_COOKIE_OVERRIDE',
  LEGAL_NOTES_OVERRIDE: 'LEGAL_NOTES_OVERRIDE',
  LEGAL_TERMS_OVERRIDE: 'LEGAL_TERMS_OVERRIDE',
} as const

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS]

const DEFAULTS: Record<string, string> = {
  IBAN_BONIFICO: 'IT00 X000 0000 0000 0000 0000 000',
  INTESTATARIO_BONIFICO: 'VIPHARMA di Tatulli Vito & Co. S.A.S.',
  // Importi gestiti da /admin/impostazioni: nessuna copia nel codice.
  // Vuoto significa zero (vedi lib/domain/pricing-config.ts).
  COD_SURCHARGE: '',
  SPEDIZIONE_GRATUITA: '',
  PREZZO_SPEDIZIONE: '',
  SUPPLEMENTO_ESTERO: '',
  COMPANY_LEGAL_NAME: '',
  COMPANY_ADDRESS: '',
  COMPANY_PHONE: '',
  COMPANY_WHATSAPP: '',
  COMPANY_EMAIL: '',
  WHATSAPP_MESSAGE: '',
  SOCIAL_FACEBOOK: '',
  SOCIAL_INSTAGRAM: '',
  SOCIAL_TIKTOK: '',
  NEWSLETTER_KICKER: '',
  NEWSLETTER_TITLE: '',
  NEWSLETTER_BODY: '',
  NEWSLETTER_BUTTON_LABEL: '',
  LEGAL_PRIVACY_OVERRIDE: DEFAULT_PRIVACY_OVERRIDE_JSON,
  LEGAL_COOKIE_OVERRIDE: DEFAULT_COOKIE_OVERRIDE_JSON,
  LEGAL_NOTES_OVERRIDE: DEFAULT_LEGAL_NOTES_OVERRIDE_JSON,
  LEGAL_TERMS_OVERRIDE: DEFAULT_TERMS_OVERRIDE_JSON,
}

let cache: Record<string, string> | null = null
let cacheAt = 0
const TTL = 60_000

export async function getSettingsMap(): Promise<Record<string, string>> {
  if (cache && Date.now() - cacheAt < TTL) return cache
  try {
    const rows = await getAllSettings()
    cache = { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) }
    cacheAt = Date.now()
    return cache
  } catch (error) {
    logPrismaInitError('settings:map', error)
    if (isPrismaInitError(error)) {
      cache = { ...DEFAULTS }
      cacheAt = Date.now()
      return cache
    }
    throw error
  }
}

export function invalidateSettingsCache() {
  cache = null
}
