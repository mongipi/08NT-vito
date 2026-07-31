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

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const settings = await getSettingsMap()

  return {
    companyLegalName: settings[SETTING_KEYS.COMPANY_LEGAL_NAME] ?? '',
    companyAddress: settings[SETTING_KEYS.COMPANY_ADDRESS] ?? '',
    companyPhone: settings[SETTING_KEYS.COMPANY_PHONE] ?? '',
    companyWhatsapp: settings[SETTING_KEYS.COMPANY_WHATSAPP] ?? '',
    companyEmail: settings[SETTING_KEYS.COMPANY_EMAIL] ?? '',
    whatsappMessage: settings[SETTING_KEYS.WHATSAPP_MESSAGE] ?? '',
    facebookUrl: settings[SETTING_KEYS.SOCIAL_FACEBOOK] ?? '',
    instagramUrl: settings[SETTING_KEYS.SOCIAL_INSTAGRAM] ?? '',
    tiktokUrl: settings[SETTING_KEYS.SOCIAL_TIKTOK] ?? '',
    newsletterKicker: settings[SETTING_KEYS.NEWSLETTER_KICKER] ?? '',
    newsletterTitle: settings[SETTING_KEYS.NEWSLETTER_TITLE] ?? '',
    newsletterBody: settings[SETTING_KEYS.NEWSLETTER_BODY] ?? '',
    newsletterButtonLabel: settings[SETTING_KEYS.NEWSLETTER_BUTTON_LABEL] ?? '',
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
