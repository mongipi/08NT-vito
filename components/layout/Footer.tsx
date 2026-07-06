import Link from 'next/link'
import Image from 'next/image'
import { Logo } from './Logo'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { CookiePreferencesButton } from '@/components/ui/CookieConsent'

const FOOTER_LINKS = {
  'PRODOTTI & SHOP': [
    { label: 'Menopausa Complex', href: '/prodotti/menopausa-complex' },
    { label: 'Capelli, Pelle & Unghie', href: '/prodotti/capelli-pelle-unghie' },
    { label: 'Microcircolo Superior', href: '/prodotti/microcircolo-superior' },
    { label: 'Multivitaminico & Minerali', href: '/prodotti/multivitaminico-minerali' },
  ],
  Azienda: [
    { label: 'Qualita 08', href: '/metodo' },
    { label: 'Blog', href: '/blog' },
    { label: 'Lavora con noi', href: '/lavora-con-noi' },
    { label: 'Resi e spedizioni', href: '/resi-e-spedizioni' },
    { label: 'Contatti', href: '/contatti' },
  ],
  Legale: [
    { label: 'Termini e condizioni', href: '/termini-condizioni-vendita' },
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Cookie policy', href: '/cookie' },
    { label: 'Note legali', href: '/note-legali' },
  ],
}

const CONTACTS = [
  { label: 'Telefono', href: 'tel:0803031103', text: '080 303 1103', icon: 'phone.svg' },
  { label: 'WhatsApp', href: 'https://wa.me/393515078701', text: '351 507 8701', icon: 'whatsapp.svg' },
  { label: 'Email', href: 'mailto:08naturaltechnology@gmail.com', text: '08naturaltechnology@gmail.com', icon: 'email.svg' },
]

const COURIERS = ['GLS', 'BRT', 'POSTE ITALIANE'] as const

export function Footer() {
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
          <div className="v61-footer-couriers" aria-label="Corrieri">
            {COURIERS.map((courier) => (
              <span key={courier}>{courier}</span>
            ))}
          </div>
        </div>

        {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string }[]][]).map(([section, links]) => (
          <div key={section}>
            <p className="v61-footer-title">{section}</p>
            <ul>
              {links.map(({ label, href }) => (
                <li key={href}><Link href={href}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="v61-footer-bottom">
        <span>© {new Date().getFullYear()} 08 Natural Technology · Tutti i diritti riservati</span>
        <div className="v61-footer-socials">
          {SOCIAL_LINKS.map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Image src={`/v61/icons/${label.toLowerCase()}.svg`} alt="" width={17} height={17} />
            </a>
          ))}
        </div>
        <CookiePreferencesButton />
        <span className="v61-made">Made in Italy</span>
      </div>
    </footer>
  )
}
