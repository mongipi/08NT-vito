'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Logo } from './Logo'
import { CookiePreferencesButton } from '@/components/ui/CookieConsent'
import { NewsletterSignup } from '@/components/ui/NewsletterSignup'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation, type DictionaryKey } from '@/lib/i18n/dictionary'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { formatWhatsappHref, getSocialLinks } from '@/lib/site-settings'

const FOOTER_PAGE_SECTIONS: {
  id: string
  titleKey: DictionaryKey
  links: { id: string; labelKey: DictionaryKey; href: string }[]
}[] = [
  {
    id: 'footer-company',
    titleKey: 'footer_company',
    links: [
      { id: 'fc-1', labelKey: 'nav_quality', href: '/metodo' },
      { id: 'fc-2', labelKey: 'nav_blog', href: '/blog' },
      { id: 'fc-3', labelKey: 'nav_careers', href: '/lavora-con-noi' },
      { id: 'fc-4', labelKey: 'footer_returns_shipping', href: '/resi-e-spedizioni' },
      { id: 'fc-5', labelKey: 'nav_contact', href: '/contatti' },
    ],
  },
  {
    id: 'footer-legal',
    titleKey: 'footer_legal',
    links: [
      { id: 'fl-1', labelKey: 'footer_terms', href: '/termini-condizioni-vendita' },
      { id: 'fl-2', labelKey: 'footer_privacy', href: '/privacy' },
      { id: 'fl-3', labelKey: 'footer_cookie_policy', href: '/cookie' },
      { id: 'fl-4', labelKey: 'footer_legal_notices', href: '/note-legali' },
    ],
  },
]

const FOOTER_PAYMENT_BRANDS = ['Visa', 'Mastercard', 'PayPal', 'Google Pay', 'Apple Pay']
const FOOTER_PAYMENT_KEYS: DictionaryKey[] = ['footer_payment_cod', 'footer_payment_bank_transfer']

const FOOTER_COURIERS = [
  { label: 'GLS', src: '/v61/img/gls%20logo.png', width: 57, height: 20 },
  { label: 'BRT', src: '/v61/img/brt%20logo.png', width: 50, height: 24 },
  { label: 'SDA', src: '/v61/img/sda%20logo.png', width: 100, height: 20 },
]

const FOOTER_MINISTRY_LOGO = {
  label: 'Ministero della Salute',
  src: '/v61/img/ministero.png',
  width: 190,
  height: 42,
}

export function Footer({ products }: { products: { name: string; slug: string }[] }) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const siteSettings = useSiteSettings()
  const socialLinks = getSocialLinks(siteSettings)
  const contacts = [
    {
      label: t('footer_contact_phone_label'),
      href: `tel:${siteSettings.companyPhone.replace(/\s+/g, '')}`,
      text: siteSettings.companyPhone,
      icon: 'phone.svg',
    },
    {
      label: 'WhatsApp',
      href: formatWhatsappHref(siteSettings.companyWhatsapp),
      text: siteSettings.companyWhatsapp,
      icon: 'whatsapp.svg',
    },
    {
      label: 'Email',
      href: `mailto:${siteSettings.companyEmail}`,
      text: siteSettings.companyEmail,
      icon: 'email.svg',
    },
  ]

  return (
    <footer id="footer" className="v61-footer">
      <div className="v61-footer-grid">
        <div className="v61-footer-brand">
          <Logo variant="light" height={90} />
          <p>
            {siteSettings.companyLegalName}<br />
            {siteSettings.companyAddress}
          </p>
          <div className="v61-footer-contacts">
            {contacts.map((contact) => (
              <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                <Image src={`/v61/icons/${contact.icon}`} alt={contact.label} width={16} height={16} />
                <span>{contact.text}</span>
              </a>
            ))}
          </div>
          <div className="v61-footer-couriers" aria-label={t('footer_couriers')}>
            {FOOTER_COURIERS.map((courier) => (
              <span key={courier.label}>
                <Image src={courier.src} alt={courier.label} width={courier.width} height={courier.height} />
              </span>
            ))}
          </div>
          <div className="v61-footer-payments" aria-label={t('footer_aria_payments')}>
            {FOOTER_PAYMENT_BRANDS.map((payment) => <span key={payment}>{payment}</span>)}
            {FOOTER_PAYMENT_KEYS.map((key) => <span key={key}>{t(key)}</span>)}
          </div>
        </div>

        {[
          {
            id: 'footer-products',
            title: t('nav_products'),
            links: products.map((product) => ({
              id: product.slug,
              label: product.name,
              href: `/prodotti/${product.slug}`,
            })),
          },
          ...FOOTER_PAGE_SECTIONS.map((section) => ({
            id: section.id,
            title: t(section.titleKey),
            links: section.links.map((link) => ({
              id: link.id,
              label: t(link.labelKey),
              href: link.href,
            })),
          })),
        ].map((section) => (
          <div key={section.id}>
            <p className="v61-footer-title">{section.title}</p>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="v61-footer-newsletter">
          <NewsletterSignup variant="footer" />
          <div className="v61-footer-ministry-logo" aria-label={FOOTER_MINISTRY_LOGO.label}>
            <Image
              src={FOOTER_MINISTRY_LOGO.src}
              alt={FOOTER_MINISTRY_LOGO.label}
              width={FOOTER_MINISTRY_LOGO.width}
              height={FOOTER_MINISTRY_LOGO.height}
            />
          </div>
        </div>
      </div>

      <div className="v61-footer-bottom">
        <span>
          © {new Date().getFullYear()} 08 Natural Technology · {t('footer_rights')}
        </span>
        <div className="v61-footer-socials">
          {socialLinks.map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Image src={`/v61/icons/${label.toLowerCase()}.svg`} alt="" width={17} height={17} />
            </a>
          ))}
        </div>
        <CookiePreferencesButton />
        <span className="v61-made">{t('footer_made_in_italy')}</span>
      </div>
    </footer>
  )
}
