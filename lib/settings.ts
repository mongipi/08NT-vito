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
  HOME_HERO_CAROUSEL: 'HOME_HERO_CAROUSEL',
  COMPANY_DISPLAY_NAME: 'COMPANY_DISPLAY_NAME',
  COMPANY_LEGAL_NAME: 'COMPANY_LEGAL_NAME',
  COMPANY_ADDRESS: 'COMPANY_ADDRESS',
  COMPANY_PHONE: 'COMPANY_PHONE',
  COMPANY_WHATSAPP: 'COMPANY_WHATSAPP',
  COMPANY_EMAIL: 'COMPANY_EMAIL',
  WHATSAPP_MESSAGE: 'WHATSAPP_MESSAGE',
  SOCIAL_FACEBOOK: 'SOCIAL_FACEBOOK',
  SOCIAL_INSTAGRAM: 'SOCIAL_INSTAGRAM',
  SOCIAL_TIKTOK: 'SOCIAL_TIKTOK',
  HEADER_NAV_LINKS: 'HEADER_NAV_LINKS',
  FOOTER_SECTIONS: 'FOOTER_SECTIONS',
  FOOTER_PAYMENTS: 'FOOTER_PAYMENTS',
  FOOTER_COURIERS: 'FOOTER_COURIERS',
  FOOTER_MINISTRY_LOGO: 'FOOTER_MINISTRY_LOGO',
  FOOTER_COPYRIGHT_TEXT: 'FOOTER_COPYRIGHT_TEXT',
  FOOTER_MADE_LABEL: 'FOOTER_MADE_LABEL',
  PRODUCT_PAGE_KICKERS: 'PRODUCT_PAGE_KICKERS',
  PRODUCT_PAGE_TEXTS: 'PRODUCT_PAGE_TEXTS',
  HOME_FEATURES: 'HOME_FEATURES',
  HOME_FORMULAS_EYEBROW: 'HOME_FORMULAS_EYEBROW',
  HOME_FORMULAS_TITLE: 'HOME_FORMULAS_TITLE',
  HOME_FORMULAS_BODY: 'HOME_FORMULAS_BODY',
  HOME_FORMULAS_CTA_LABEL: 'HOME_FORMULAS_CTA_LABEL',
  HOME_FORMULAS_CTA_HREF: 'HOME_FORMULAS_CTA_HREF',
  HOME_BLOG_EYEBROW: 'HOME_BLOG_EYEBROW',
  HOME_BLOG_TITLE: 'HOME_BLOG_TITLE',
  HOME_BLOG_BODY: 'HOME_BLOG_BODY',
  NEWSLETTER_KICKER: 'NEWSLETTER_KICKER',
  NEWSLETTER_TITLE: 'NEWSLETTER_TITLE',
  NEWSLETTER_BODY: 'NEWSLETTER_BODY',
  NEWSLETTER_BUTTON_LABEL: 'NEWSLETTER_BUTTON_LABEL',
  NEWSLETTER_EMAIL_PLACEHOLDER: 'NEWSLETTER_EMAIL_PLACEHOLDER',
  METHOD_PAGE_CONTENT: 'METHOD_PAGE_CONTENT',
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
  HOME_HERO_CAROUSEL: '',
  COMPANY_DISPLAY_NAME: '08 Natural Technology',
  COMPANY_LEGAL_NAME: 'VIPHARMA di Tatulli Vito & Co. S.A.S.',
  COMPANY_ADDRESS: 'Via Don Luigi Sturzo 44/46/48 - Bitonto (BA) 70032',
  COMPANY_PHONE: '080 303 1103',
  COMPANY_WHATSAPP: '351 507 8701',
  COMPANY_EMAIL: '08naturaltechnology@gmail.com',
  WHATSAPP_MESSAGE: 'Ciao, arrivo dal sito 08 Natural Technology e vorrei ricevere assistenza.',
  SOCIAL_FACEBOOK: 'https://www.facebook.com/profile.php?id=61575360383639&locale=it_IT',
  SOCIAL_INSTAGRAM: 'https://www.instagram.com/08naturaltechnology/',
  SOCIAL_TIKTOK: 'https://www.tiktok.com/@08naturaltechnology',
  HEADER_NAV_LINKS: '',
  FOOTER_SECTIONS: '',
  FOOTER_PAYMENTS: 'Visa\nMastercard\nPayPal\nGoogle Pay\nApple Pay\nContrassegno\nBonifico',
  FOOTER_COURIERS: '',
  FOOTER_MINISTRY_LOGO: '',
  FOOTER_COPYRIGHT_TEXT: 'Tutti i diritti riservati',
  FOOTER_MADE_LABEL: 'Made in Italy',
  PRODUCT_PAGE_KICKERS: '',
  PRODUCT_PAGE_TEXTS: '',
  HOME_FEATURES: '',
  HOME_FORMULAS_EYEBROW: 'Le nostre formule',
  HOME_FORMULAS_TITLE: 'Prodotti pensati\n**per esigenze reali.**',
  HOME_FORMULAS_BODY:
    'Dai prodotti per microcircolo e gambe leggere, fino al supporto vitaminico, alla bellezza di capelli, pelle e unghie e all’equilibrio femminile in menopausa: 08 Natural Technology propone soluzioni nutrizionali pensate per esigenze concrete e quotidiane.',
  HOME_FORMULAS_CTA_LABEL: 'Scopri i prodotti',
  HOME_FORMULAS_CTA_HREF: '/prodotti',
  HOME_BLOG_EYEBROW: 'Blog 08',
  HOME_BLOG_TITLE: 'Approfondimenti e benessere quotidiano',
  HOME_BLOG_BODY:
    'Scopri consigli, ingredienti e articoli utili per orientarti meglio tra formule, esigenze e scelte quotidiane.',
  NEWSLETTER_KICKER: 'Newsletter 08',
  NEWSLETTER_TITLE: 'Extra sconto 5%',
  NEWSLETTER_BODY: 'Iscriviti per ricevere novità, contenuti e formule 08 Natural Technology.',
  NEWSLETTER_BUTTON_LABEL: 'Iscriviti',
  NEWSLETTER_EMAIL_PLACEHOLDER: 'nome@email.it',
  METHOD_PAGE_CONTENT: '',
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
