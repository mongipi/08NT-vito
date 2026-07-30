import type { ManagedLegalOverrideDocument } from '@/lib/legal-overrides'
import { normalizeManagedLegalOverride } from '@/lib/legal-overrides'
import {
  DEFAULT_METHOD_PAGE_CONTENT,
  normalizeMethodPageContent,
  type MethodPageContent,
} from '@/lib/method-page'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'

export type PublicSiteSettings = {
  companyDisplayName: string
  companyLegalName: string
  companyAddress: string
  companyPhone: string
  companyWhatsapp: string
  companyEmail: string
  whatsappMessage: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  headerNavLinks: ManagedLink[]
  footerSections: ManagedFooterSection[]
  footerPayments: string[]
  footerCouriers: ManagedFooterLogo[]
  footerMinistryLogo: ManagedFooterLogo
  footerCopyrightText: string
  footerMadeLabel: string
  productPageKickers: ManagedProductPageKicker[]
  productPageTexts: ProductPageTexts
  homeFeatures: ManagedHomeFeature[]
  homeFormulasEyebrow: string
  homeFormulasTitle: string
  homeFormulasBody: string
  homeFormulasCtaLabel: string
  homeFormulasCtaHref: string
  homeBlogEyebrow: string
  homeBlogTitle: string
  homeBlogBody: string
  newsletterKicker: string
  newsletterTitle: string
  newsletterBody: string
  newsletterButtonLabel: string
  newsletterEmailPlaceholder: string
  methodPageContent: MethodPageContent
  legalPrivacyOverride: ManagedLegalOverrideDocument | null
  legalCookieOverride: ManagedLegalOverrideDocument | null
  legalNotesOverride: ManagedLegalOverrideDocument | null
  legalTermsOverride: ManagedLegalOverrideDocument | null
}

export type ManagedLink = {
  id: string
  label: string
  href: string
  enabled: boolean
}

export type ManagedFooterSection = {
  id: string
  title: string
  links: ManagedLink[]
}

export type ManagedHomeFeature = {
  id: string
  icon: string
  title: string
  body: string
}

export type ManagedFooterLogo = {
  id: string
  label: string
  src: string
  width: number
  height: number
  enabled: boolean
}

export type ManagedProductPageKicker = {
  slug: string
  label: string
  enabled: boolean
}

export type ProductPageTexts = {
  breadcrumbBrandLabel: string
  allProductsLabel: string
  madeInItalyLabel: string
  defaultKickerTemplate: string
  galleryFrontLabel: string
  galleryInfographicLabel: string
  galleryCompositionLabel: string
  galleryBackLabel: string
  galleryLabelLabel: string
  sectionUsageTitle: string
  sectionTargetTitle: string
  sectionFormatTitle: string
  sectionIngredientsTitle: string
  fallbackUsageBody: string
  fallbackTargetBody: string
  fallbackIngredientsBody: string
  capsuleSuffix: string
  daysSuffix: string
}

export const DEFAULT_PUBLIC_SITE_SETTINGS: PublicSiteSettings = {
  companyDisplayName: '08 Natural Technology',
  companyLegalName: 'VIPHARMA di Tatulli Vito & Co. S.A.S.',
  companyAddress: 'Via Don Luigi Sturzo 44/46/48 - Bitonto (BA) 70032',
  companyPhone: '080 303 1103',
  companyWhatsapp: '351 507 8701',
  companyEmail: '08naturaltechnology@gmail.com',
  whatsappMessage: 'Ciao, arrivo dal sito 08 Natural Technology e vorrei ricevere assistenza.',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61575360383639&locale=it_IT',
  instagramUrl: 'https://www.instagram.com/08naturaltechnology/',
  tiktokUrl: 'https://www.tiktok.com/@08naturaltechnology',
  headerNavLinks: [
    { id: 'nav-home', label: 'Home', href: '/', enabled: true },
    { id: 'nav-products', label: 'Prodotti & Shop', href: '/prodotti', enabled: true },
    { id: 'nav-quality', label: 'Qualit\u00E0 08', href: '/metodo', enabled: true },
    { id: 'nav-blog', label: 'Blog', href: '/blog', enabled: true },
    { id: 'nav-careers', label: 'Lavora con noi', href: '/lavora-con-noi', enabled: true },
    { id: 'nav-contact', label: 'Contatti', href: '/contatti', enabled: true },
  ],
  footerSections: [
    {
      id: 'footer-products',
      title: 'Prodotti & Shop',
      links: [
        {
          id: 'fp-1',
          label: 'Menopausa Complex',
          href: '/prodotti/menopausa-complex',
          enabled: true,
        },
        {
          id: 'fp-2',
          label: 'Capelli, Pelle & Unghie',
          href: '/prodotti/capelli-pelle-unghie',
          enabled: true,
        },
        {
          id: 'fp-3',
          label: 'Microcircolo Superior',
          href: '/prodotti/microcircolo-superior',
          enabled: true,
        },
        {
          id: 'fp-4',
          label: 'Multivitaminico & Minerali',
          href: '/prodotti/multivitaminico-minerali',
          enabled: true,
        },
      ],
    },
    {
      id: 'footer-company',
      title: 'Azienda',
      links: [
        { id: 'fc-1', label: 'Qualit\u00E0 08', href: '/metodo', enabled: true },
        { id: 'fc-2', label: 'Blog', href: '/blog', enabled: true },
        { id: 'fc-3', label: 'Lavora con noi', href: '/lavora-con-noi', enabled: true },
        { id: 'fc-4', label: 'Resi e spedizioni', href: '/resi-e-spedizioni', enabled: true },
        { id: 'fc-5', label: 'Contatti', href: '/contatti', enabled: true },
      ],
    },
    {
      id: 'footer-legal',
      title: 'Legale',
      links: [
        {
          id: 'fl-1',
          label: 'Termini e condizioni',
          href: '/termini-condizioni-vendita',
          enabled: true,
        },
        { id: 'fl-2', label: 'Privacy policy', href: '/privacy', enabled: true },
        { id: 'fl-3', label: 'Cookie policy', href: '/cookie', enabled: true },
        { id: 'fl-4', label: 'Note legali', href: '/note-legali', enabled: true },
      ],
    },
  ],
  footerPayments: [
    'Visa',
    'Mastercard',
    'PayPal',
    'Google Pay',
    'Apple Pay',
    'Contrassegno',
    'Bonifico',
  ],
  footerCouriers: [
    {
      id: 'courier-gls',
      label: 'GLS',
      src: '/v61/img/gls%20logo.png',
      width: 57,
      height: 20,
      enabled: true,
    },
    {
      id: 'courier-brt',
      label: 'BRT',
      src: '/v61/img/brt%20logo.png',
      width: 50,
      height: 24,
      enabled: true,
    },
    {
      id: 'courier-sda',
      label: 'SDA',
      src: '/v61/img/sda%20logo.png',
      width: 100,
      height: 20,
      enabled: true,
    },
  ],
  footerMinistryLogo: {
    id: 'ministry-logo',
    label: 'Ministero della Salute',
    src: '/v61/img/ministero.png',
    width: 190,
    height: 42,
    enabled: true,
  },
  footerCopyrightText: 'Tutti i diritti riservati',
  footerMadeLabel: 'Made in Italy',
  productPageKickers: [
    { slug: 'menopausa-complex', label: 'Linea Menopausa - Formula giorno e notte', enabled: true },
    { slug: 'capelli-pelle-unghie', label: 'Linea Beauty - Supporto mirato', enabled: true },
    { slug: 'microcircolo-superior', label: 'Linea Microcircolo - Complesso flavonoico', enabled: true },
    { slug: 'multivitaminico-minerali', label: 'Linea Energia - Formula quotidiana', enabled: true },
  ],
  productPageTexts: {
    breadcrumbBrandLabel: '08 Natural Technology',
    allProductsLabel: 'Tutti i prodotti',
    madeInItalyLabel: 'Made in Italy',
    defaultKickerTemplate: '{line} - Formula mirata',
    galleryFrontLabel: 'Fronte',
    galleryInfographicLabel: 'Infografica',
    galleryCompositionLabel: 'Composizione',
    galleryBackLabel: 'Retro etichetta',
    galleryLabelLabel: 'Etichetta',
    sectionUsageTitle: "Modo d'uso",
    sectionTargetTitle: 'A chi è rivolto',
    sectionFormatTitle: 'Formato e composizione',
    sectionIngredientsTitle: 'Ingredienti',
    fallbackUsageBody: 'Seguire le indicazioni riportate in etichetta.',
    fallbackTargetBody: 'Pensato per chi cerca un supporto nutrizionale mirato.',
    fallbackIngredientsBody: 'Ingredienti non ancora specificati.',
    capsuleSuffix: 'capsule vegetali',
    daysSuffix: 'giorni',
  },
  homeFeatures: [
    {
      id: 'home-feature-1',
      icon: 'IT',
      title: 'ECCELLENZA ITALIANA',
      body: 'Identit\u00E0 italiana, cura del dettaglio e standard elevati in ogni scelta.',
    },
    {
      id: 'home-feature-2',
      icon: '\uD83C\uDF3F',
      title: 'INGREDIENTI DI ALTA QUALIT\u00C0',
      body: 'Materie prime selezionate con attenzione e formule coerenti.',
    },
    {
      id: 'home-feature-3',
      icon: '\uD83D\uDD2C',
      title: 'RICERCA E INNOVAZIONE',
      body: 'Soluzioni nutrizionali moderne, ad alta biodisponibilit\u00E0.',
    },
    {
      id: 'home-feature-4',
      icon: '\u2728',
      title: 'BENESSERE E RISULTATI CONCRETI',
      body: 'Soluzioni concrete, pensate per esigenze mirate.',
    },
  ],
  homeFormulasEyebrow: 'Le nostre formule',
  homeFormulasTitle: 'Prodotti pensati\n**per esigenze reali.**',
  homeFormulasBody:
    'Dai prodotti per microcircolo e gambe leggere, fino al supporto vitaminico, alla bellezza di capelli, pelle e unghie e all\u2019equilibrio femminile in menopausa: 08 Natural Technology propone soluzioni nutrizionali pensate per esigenze concrete e quotidiane.',
  homeFormulasCtaLabel: 'Scopri i prodotti',
  homeFormulasCtaHref: '/prodotti',
  homeBlogEyebrow: 'Blog 08',
  homeBlogTitle: 'Approfondimenti e benessere quotidiano',
  homeBlogBody:
    'Scopri consigli, ingredienti e articoli utili per orientarti meglio tra formule, esigenze e scelte quotidiane.',
  newsletterKicker: 'Newsletter 08',
  newsletterTitle: 'Extra sconto 5%',
  newsletterBody:
    'Iscriviti per ricevere novit\u00E0, contenuti e formule 08 Natural Technology.',
  newsletterButtonLabel: 'Iscriviti',
  newsletterEmailPlaceholder: 'nome@email.it',
  methodPageContent: DEFAULT_METHOD_PAGE_CONTENT,
  legalPrivacyOverride: null,
  legalCookieOverride: null,
  legalNotesOverride: null,
  legalTermsOverride: null,
}

function valueOrDefault(value: string | undefined, fallback: string) {
  const next = value?.trim()
  return next ? next : fallback
}

function normalizeLinks(raw: string | undefined, fallback: ManagedLink[]) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    const links = parsed
      .map((link, index) => ({
        id: typeof link?.id === 'string' && link.id.trim() ? link.id.trim() : `link-${index + 1}`,
        label: typeof link?.label === 'string' ? link.label.trim() : '',
        href: typeof link?.href === 'string' ? link.href.trim() : '',
        enabled: link?.enabled !== false,
      }))
      .filter((link) => link.label && link.href)

    return links.length > 0 ? links : fallback
  } catch {
    return fallback
  }
}

function normalizeFooterSections(raw: string | undefined, fallback: ManagedFooterSection[]) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    const sections = parsed
      .map((section, sectionIndex) => ({
        id:
          typeof section?.id === 'string' && section.id.trim()
            ? section.id.trim()
            : `section-${sectionIndex + 1}`,
        title: typeof section?.title === 'string' ? section.title.trim() : '',
        links: normalizeLinks(JSON.stringify(section?.links ?? []), []),
      }))
      .filter((section) => section.title && section.links.length > 0)

    return sections.length > 0 ? sections : fallback
  } catch {
    return fallback
  }
}

function normalizePayments(raw: string | undefined, fallback: string[]) {
  if (!raw?.trim()) return fallback

  const values = raw
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)

  return values.length > 0 ? values : fallback
}

function normalizeFooterLogos(raw: string | undefined, fallback: ManagedFooterLogo[]) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    const logos = parsed
      .map((logo, index) => ({
        id: typeof logo?.id === 'string' && logo.id.trim() ? logo.id.trim() : `logo-${index + 1}`,
        label: typeof logo?.label === 'string' ? logo.label.trim() : '',
        src: typeof logo?.src === 'string' ? logo.src.trim() : '',
        width: Number.isFinite(Number(logo?.width)) ? Number(logo.width) : 80,
        height: Number.isFinite(Number(logo?.height)) ? Number(logo.height) : 24,
        enabled: logo?.enabled !== false,
      }))
      .filter((logo) => logo.label && logo.src)

    return logos.length > 0 ? logos : fallback
  } catch {
    return fallback
  }
}

function normalizeFooterLogo(raw: string | undefined, fallback: ManagedFooterLogo) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    return {
      id: typeof parsed?.id === 'string' && parsed.id.trim() ? parsed.id.trim() : fallback.id,
      label:
        typeof parsed?.label === 'string' && parsed.label.trim()
          ? parsed.label.trim()
          : fallback.label,
      src: typeof parsed?.src === 'string' && parsed.src.trim() ? parsed.src.trim() : fallback.src,
      width: Number.isFinite(Number(parsed?.width)) ? Number(parsed.width) : fallback.width,
      height: Number.isFinite(Number(parsed?.height)) ? Number(parsed.height) : fallback.height,
      enabled: parsed?.enabled !== false,
    }
  } catch {
    return fallback
  }
}

function normalizeHomeFeatures(raw: string | undefined, fallback: ManagedHomeFeature[]) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    const features = parsed
      .map((feature, index) => ({
        id:
          typeof feature?.id === 'string' && feature.id.trim()
            ? feature.id.trim()
            : `feature-${index + 1}`,
        icon: typeof feature?.icon === 'string' ? feature.icon.trim() : '',
        title: typeof feature?.title === 'string' ? feature.title.trim() : '',
        body: typeof feature?.body === 'string' ? feature.body.trim() : '',
      }))
      .filter((feature) => feature.title && feature.body)

    return features.length > 0 ? features : fallback
  } catch {
    return fallback
  }
}

function normalizeProductPageKickers(
  raw: string | undefined,
  fallback: ManagedProductPageKicker[]
) {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback

    const items = parsed
      .map((item) => ({
        slug: typeof item?.slug === 'string' ? item.slug.trim() : '',
        label: typeof item?.label === 'string' ? item.label.trim() : '',
        enabled: item?.enabled !== false,
      }))
      .filter((item) => item.slug && item.label)

    return items.length > 0 ? items : fallback
  } catch {
    return fallback
  }
}

function normalizeProductPageTexts(
  raw: string | undefined,
  fallback: ProductPageTexts
): ProductPageTexts {
  if (!raw?.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    const pick = (key: keyof ProductPageTexts) =>
      typeof parsed?.[key] === 'string' && parsed[key].trim() ? parsed[key].trim() : fallback[key]

    return {
      breadcrumbBrandLabel: pick('breadcrumbBrandLabel'),
      allProductsLabel: pick('allProductsLabel'),
      madeInItalyLabel: pick('madeInItalyLabel'),
      defaultKickerTemplate: pick('defaultKickerTemplate'),
      galleryFrontLabel: pick('galleryFrontLabel'),
      galleryInfographicLabel: pick('galleryInfographicLabel'),
      galleryCompositionLabel: pick('galleryCompositionLabel'),
      galleryBackLabel: pick('galleryBackLabel'),
      galleryLabelLabel: pick('galleryLabelLabel'),
      sectionUsageTitle: pick('sectionUsageTitle'),
      sectionTargetTitle: pick('sectionTargetTitle'),
      sectionFormatTitle: pick('sectionFormatTitle'),
      sectionIngredientsTitle: pick('sectionIngredientsTitle'),
      fallbackUsageBody: pick('fallbackUsageBody'),
      fallbackTargetBody: pick('fallbackTargetBody'),
      fallbackIngredientsBody: pick('fallbackIngredientsBody'),
      capsuleSuffix: pick('capsuleSuffix'),
      daysSuffix: pick('daysSuffix'),
    }
  } catch {
    return fallback
  }
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const settings = await getSettingsMap()

  return {
    companyDisplayName: valueOrDefault(
      settings[SETTING_KEYS.COMPANY_DISPLAY_NAME],
      DEFAULT_PUBLIC_SITE_SETTINGS.companyDisplayName
    ),
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
    headerNavLinks: normalizeLinks(
      settings[SETTING_KEYS.HEADER_NAV_LINKS],
      DEFAULT_PUBLIC_SITE_SETTINGS.headerNavLinks
    ),
    footerSections: normalizeFooterSections(
      settings[SETTING_KEYS.FOOTER_SECTIONS],
      DEFAULT_PUBLIC_SITE_SETTINGS.footerSections
    ),
    footerPayments: normalizePayments(
      settings[SETTING_KEYS.FOOTER_PAYMENTS],
      DEFAULT_PUBLIC_SITE_SETTINGS.footerPayments
    ),
    footerCouriers: normalizeFooterLogos(
      settings[SETTING_KEYS.FOOTER_COURIERS],
      DEFAULT_PUBLIC_SITE_SETTINGS.footerCouriers
    ),
    footerMinistryLogo: normalizeFooterLogo(
      settings[SETTING_KEYS.FOOTER_MINISTRY_LOGO],
      DEFAULT_PUBLIC_SITE_SETTINGS.footerMinistryLogo
    ),
    footerCopyrightText: valueOrDefault(
      settings[SETTING_KEYS.FOOTER_COPYRIGHT_TEXT],
      DEFAULT_PUBLIC_SITE_SETTINGS.footerCopyrightText
    ),
    footerMadeLabel: valueOrDefault(
      settings[SETTING_KEYS.FOOTER_MADE_LABEL],
      DEFAULT_PUBLIC_SITE_SETTINGS.footerMadeLabel
    ),
    productPageKickers: normalizeProductPageKickers(
      settings[SETTING_KEYS.PRODUCT_PAGE_KICKERS],
      DEFAULT_PUBLIC_SITE_SETTINGS.productPageKickers
    ),
    productPageTexts: normalizeProductPageTexts(
      settings[SETTING_KEYS.PRODUCT_PAGE_TEXTS],
      DEFAULT_PUBLIC_SITE_SETTINGS.productPageTexts
    ),
    homeFeatures: normalizeHomeFeatures(
      settings[SETTING_KEYS.HOME_FEATURES],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeFeatures
    ),
    homeFormulasEyebrow: valueOrDefault(
      settings[SETTING_KEYS.HOME_FORMULAS_EYEBROW],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasEyebrow
    ),
    homeFormulasTitle: valueOrDefault(
      settings[SETTING_KEYS.HOME_FORMULAS_TITLE],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasTitle
    ),
    homeFormulasBody: valueOrDefault(
      settings[SETTING_KEYS.HOME_FORMULAS_BODY],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasBody
    ),
    homeFormulasCtaLabel: valueOrDefault(
      settings[SETTING_KEYS.HOME_FORMULAS_CTA_LABEL],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasCtaLabel
    ),
    homeFormulasCtaHref: valueOrDefault(
      settings[SETTING_KEYS.HOME_FORMULAS_CTA_HREF],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeFormulasCtaHref
    ),
    homeBlogEyebrow: valueOrDefault(
      settings[SETTING_KEYS.HOME_BLOG_EYEBROW],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeBlogEyebrow
    ),
    homeBlogTitle: valueOrDefault(
      settings[SETTING_KEYS.HOME_BLOG_TITLE],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeBlogTitle
    ),
    homeBlogBody: valueOrDefault(
      settings[SETTING_KEYS.HOME_BLOG_BODY],
      DEFAULT_PUBLIC_SITE_SETTINGS.homeBlogBody
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
    newsletterEmailPlaceholder: valueOrDefault(
      settings[SETTING_KEYS.NEWSLETTER_EMAIL_PLACEHOLDER],
      DEFAULT_PUBLIC_SITE_SETTINGS.newsletterEmailPlaceholder
    ),
    methodPageContent: normalizeMethodPageContent(
      settings[SETTING_KEYS.METHOD_PAGE_CONTENT],
      DEFAULT_PUBLIC_SITE_SETTINGS.methodPageContent
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
