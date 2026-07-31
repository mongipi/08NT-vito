import type { ManagedLegalOverrideDocument } from '@/lib/legal-overrides'
import { normalizeManagedLegalOverride } from '@/lib/legal-overrides'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'

export type PublicSiteSettings = {
  companyLegalName: string
  companyAddress: string
  companyPhone: string
  companyWhatsapp: string
  companyEmail: string
  whatsappMessage: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  newsletterKicker: string
  newsletterTitle: string
  newsletterBody: string
  newsletterButtonLabel: string
  legalPrivacyOverride: ManagedLegalOverrideDocument | null
  legalCookieOverride: ManagedLegalOverrideDocument | null
  legalNotesOverride: ManagedLegalOverrideDocument | null
  legalTermsOverride: ManagedLegalOverrideDocument | null
}

export const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings = {
  companyLegalName: 'VIPHARMA di Tatulli Vito & Co. S.A.S.',
  companyAddress: 'Via Don Luigi Sturzo 44/46/48 - Bitonto (BA) 70032',
  companyPhone: '080 303 1103',
  companyWhatsapp: '351 507 8701',
  companyEmail: '08naturaltechnology@gmail.com',
  whatsappMessage: 'Ciao, arrivo dal sito 08 Natural Technology e vorrei ricevere assistenza.',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61575360383639&locale=it_IT',
  instagramUrl: 'https://www.instagram.com/08naturaltechnology/',
  tiktokUrl: 'https://www.tiktok.com/@08naturaltechnology',
  newsletterKicker: 'Newsletter 08',
  newsletterTitle: 'Extra sconto 5%',
  newsletterBody:
    'Iscriviti per ricevere novità, contenuti e formule 08 Natural Technology.',
  newsletterButtonLabel: 'Iscriviti',
  legalPrivacyOverride: null,
  legalCookieOverride: null,
  legalNotesOverride: null,
  legalTermsOverride: null,
}

function valueOrDefault(value: string | undefined, fallback: string) {
  const next = value?.trim()
  return next ? next : fallback
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const settings = await getSettingsMap()

  return {
    companyLegalName: valueOrDefault(
      settings[SETTING_KEYS.COMPANY_LEGAL_NAME],
      DEFAULT_PUBLIC_SITE_SETTINGS.companyLegalName
    ),
    companyAddress: valueOrDefault(
      settings[SETTING_KEYS.COMPANY_ADDRESS],
      DEFAULT_PUBLIC_SITE_SETTINGS.companyAddress
    ),
    companyPhone: valueOrDefault(
      settings[SETTING_KEYS.COMPANY_PHONE],
      DEFAULT_PUBLIC_SITE_SETTINGS.companyPhone
    ),
    companyWhatsapp: valueOrDefault(
      settings[SETTING_KEYS.COMPANY_WHATSAPP],
      DEFAULT_PUBLIC_SITE_SETTINGS.companyWhatsapp
    ),
    companyEmail: valueOrDefault(
      settings[SETTING_KEYS.COMPANY_EMAIL],
      DEFAULT_PUBLIC_SITE_SETTINGS.companyEmail
    ),
    whatsappMessage: valueOrDefault(
      settings[SETTING_KEYS.WHATSAPP_MESSAGE],
      DEFAULT_PUBLIC_SITE_SETTINGS.whatsappMessage
    ),
    facebookUrl: valueOrDefault(
      settings[SETTING_KEYS.SOCIAL_FACEBOOK],
      DEFAULT_PUBLIC_SITE_SETTINGS.facebookUrl
    ),
    instagramUrl: valueOrDefault(
      settings[SETTING_KEYS.SOCIAL_INSTAGRAM],
      DEFAULT_PUBLIC_SITE_SETTINGS.instagramUrl
    ),
    tiktokUrl: valueOrDefault(
      settings[SETTING_KEYS.SOCIAL_TIKTOK],
      DEFAULT_PUBLIC_SITE_SETTINGS.tiktokUrl
    ),
    newsletterKicker: valueOrDefault(
      settings[SETTING_KEYS.NEWSLETTER_KICKER],
      DEFAULT_PUBLIC_SITE_SETTINGS.newsletterKicker
    ),
    newsletterTitle: valueOrDefault(
      settings[SETTING_KEYS.NEWSLETTER_TITLE],
      DEFAULT_PUBLIC_SITE_SETTINGS.newsletterTitle
    ),
    newsletterBody: valueOrDefault(
      settings[SETTING_KEYS.NEWSLETTER_BODY],
      DEFAULT_PUBLIC_SITE_SETTINGS.newsletterBody
    ),
    newsletterButtonLabel: valueOrDefault(
      settings[SETTING_KEYS.NEWSLETTER_BUTTON_LABEL],
      DEFAULT_PUBLIC_SITE_SETTINGS.newsletterButtonLabel
    ),
    legalPrivacyOverride: normalizeManagedLegalOverride(
      settings[SETTING_KEYS.LEGAL_PRIVACY_OVERRIDE]
    ),
    legalCookieOverride: normalizeManagedLegalOverride(
      settings[SETTING_KEYS.LEGAL_COOKIE_OVERRIDE]
    ),
    legalNotesOverride: normalizeManagedLegalOverride(
      settings[SETTING_KEYS.LEGAL_NOTES_OVERRIDE]
    ),
    legalTermsOverride: normalizeManagedLegalOverride(
      settings[SETTING_KEYS.LEGAL_TERMS_OVERRIDE]
    ),
  }
}

export function formatWhatsappHref(number: string, message?: string) {
  const digits = number.replace(/\D/g, '')
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/'
  return message?.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base
}

export function getSocialLinks(settings: PublicSiteSettings) {
  return [
    { href: settings.facebookUrl, label: 'Facebook' },
    { href: settings.instagramUrl, label: 'Instagram' },
    { href: settings.tiktokUrl, label: 'TikTok' },
    { href: formatWhatsappHref(settings.companyWhatsapp), label: 'WhatsApp' },
  ]
}
