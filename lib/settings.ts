import {
  DEFAULT_COOKIE_OVERRIDE_JSON,
  DEFAULT_LEGAL_NOTES_OVERRIDE_JSON,
  DEFAULT_PRIVACY_OVERRIDE_JSON,
  DEFAULT_TERMS_OVERRIDE_JSON,
} from '@/lib/legal-overrides'
import { prisma } from '@/lib/prisma'
import { isPrismaInitError, logPrismaInitError } from '@/lib/prisma-errors'

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
  COD_SURCHARGE: '5',
  SPEDIZIONE_GRATUITA: '39.90',
  PREZZO_SPEDIZIONE: '5.90',
  SUPPLEMENTO_ESTERO: '10',
  COMPANY_LEGAL_NAME: 'VIPHARMA di Tatulli Vito & Co. S.A.S.',
  COMPANY_ADDRESS: 'Via Don Luigi Sturzo 44/46/48 - Bitonto (BA) 70032',
  COMPANY_PHONE: '080 303 1103',
  COMPANY_WHATSAPP: '351 507 8701',
  COMPANY_EMAIL: '08naturaltechnology@gmail.com',
  WHATSAPP_MESSAGE: 'Ciao, arrivo dal sito 08 Natural Technology e vorrei ricevere assistenza.',
  SOCIAL_FACEBOOK: 'https://www.facebook.com/profile.php?id=61575360383639&locale=it_IT',
  SOCIAL_INSTAGRAM: 'https://www.instagram.com/08naturaltechnology/',
  SOCIAL_TIKTOK: 'https://www.tiktok.com/@08naturaltechnology',
  NEWSLETTER_KICKER: 'Newsletter 08',
  NEWSLETTER_TITLE: 'Extra sconto 5%',
  NEWSLETTER_BODY: 'Iscriviti per ricevere novità, contenuti e formule 08 Natural Technology.',
  NEWSLETTER_BUTTON_LABEL: 'Iscriviti',
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
    const rows = await prisma.setting.findMany()
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
