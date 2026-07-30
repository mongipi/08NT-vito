'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Logo } from './Logo'
import { CookiePreferencesButton } from '@/components/ui/CookieConsent'
import { NewsletterSignup } from '@/components/ui/NewsletterSignup'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { formatWhatsappHref, getSocialLinks } from '@/lib/site-settings'

export function Footer() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const siteSettings = useSiteSettings()
  const socialLinks = getSocialLinks(siteSettings)
  const contacts = [
    {
      label: 'Telefono',
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
            {siteSettings.footerCouriers.filter((courier) => courier.enabled).map((courier) => (
              <span key={courier.label}>
                <Image src={courier.src} alt={courier.label} width={courier.width} height={courier.height} />
              </span>
            ))}
          </div>
          <div className="v61-footer-payments" aria-label="Pagamenti disponibili">
            {siteSettings.footerPayments.map((payment) => <span key={payment}>{payment}</span>)}
          </div>
        </div>

        {siteSettings.footerSections.map((section) => (
          <div key={section.id}>
            <p className="v61-footer-title">{section.title}</p>
            <ul>
              {section.links.filter((link) => link.enabled).map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="v61-footer-newsletter">
          <NewsletterSignup variant="footer" />
          {siteSettings.footerMinistryLogo.enabled ? (
            <div className="v61-footer-ministry-logo" aria-label={siteSettings.footerMinistryLogo.label}>
              <Image
                src={siteSettings.footerMinistryLogo.src}
                alt={siteSettings.footerMinistryLogo.label}
                width={siteSettings.footerMinistryLogo.width}
                height={siteSettings.footerMinistryLogo.height}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="v61-footer-bottom">
        <span>
          © {new Date().getFullYear()} 08 Natural Technology ·{' '}
          {siteSettings.footerCopyrightText || t('footer_rights')}
        </span>
        <div className="v61-footer-socials">
          {socialLinks.map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Image src={`/v61/icons/${label.toLowerCase()}.svg`} alt="" width={17} height={17} />
            </a>
          ))}
        </div>
        <CookiePreferencesButton />
        <span className="v61-made">{siteSettings.footerMadeLabel || t('footer_made_in_italy')}</span>
      </div>
    </footer>
  )
}
