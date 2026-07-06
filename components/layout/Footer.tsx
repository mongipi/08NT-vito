'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Logo } from './Logo'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { CookiePreferencesButton } from '@/components/ui/CookieConsent'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

const FOOTER_SECTIONS = [
  {
    titleKey: 'nav_products' as const,
    links: [
      { label: 'Menopausa Complex', href: '/prodotti/menopausa-complex' },
      { label: 'Capelli, Pelle & Unghie', href: '/prodotti/capelli-pelle-unghie' },
      { label: 'Microcircolo Superior', href: '/prodotti/microcircolo-superior' },
      { label: 'Multivitaminico & Minerali', href: '/prodotti/multivitaminico-minerali' },
    ],
  },
  {
    titleKey: 'footer_company' as const,
    links: [
      { labelKey: 'nav_quality' as const, href: '/metodo' },
      { labelKey: 'nav_blog' as const, href: '/blog' },
      { labelKey: 'nav_careers' as const, href: '/lavora-con-noi' },
      { labelKey: 'footer_returns_shipping' as const, href: '/resi-e-spedizioni' },
      { labelKey: 'nav_contact' as const, href: '/contatti' },
    ],
  },
  {
    titleKey: 'footer_legal' as const,
    links: [
      { labelKey: 'footer_terms' as const, href: '/termini-condizioni-vendita' },
      { labelKey: 'footer_privacy' as const, href: '/privacy' },
      { labelKey: 'footer_cookie_policy' as const, href: '/cookie' },
      { labelKey: 'footer_legal_notices' as const, href: '/note-legali' },
    ],
  },
]

const CONTACTS = [
  { label: 'Telefono', href: 'tel:0803031103', text: '080 303 1103', icon: 'phone.svg' },
  { label: 'WhatsApp', href: 'https://wa.me/393515078701', text: '351 507 8701', icon: 'whatsapp.svg' },
  { label: 'Email', href: 'mailto:08naturaltechnology@gmail.com', text: '08naturaltechnology@gmail.com', icon: 'email.svg' },
]

const COURIERS = ['GLS', 'BRT', 'POSTE ITALIANE'] as const

export function Footer() {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  return (
    <footer className="v61-footer">
      <div className="v61-footer-grid">
        <div className="v61-footer-brand">
          <Logo variant="light" height={90} />
          <p>
            VIPHARMA di Tatulli Vito & Co. S.A.S.<br />
            Via Don Luigi Sturzo 44/46/48 - Bitonto (BA) 70032
          </p>
          <div className="v61-footer-contacts">
            {CONTACTS.map((contact) => (
              <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                <Image src={`/v61/icons/${contact.icon}`} alt={contact.label} width={16} height={16} />
                <span>{contact.text}</span>
              </a>
            ))}
          </div>
          <div className="v61-footer-couriers" aria-label={t('footer_couriers')}>
            {COURIERS.map((courier) => (
              <span key={courier}>{courier}</span>
            ))}
          </div>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <div key={section.titleKey}>
            <p className="v61-footer-title">{t(section.titleKey)}</p>
            <ul>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{'labelKey' in link ? t(link.labelKey) : link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="v61-footer-bottom">
        <span>© {new Date().getFullYear()} 08 Natural Technology · {t('footer_rights')}</span>
        <div className="v61-footer-socials">
          {SOCIAL_LINKS.map(({ href, label }) => (
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
