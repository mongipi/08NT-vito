import Link from 'next/link'
import { Logo } from './Logo'

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com',
    label: 'Facebook',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com',
    label: 'Instagram',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: 'https://wa.me/390803031103',
    label: 'WhatsApp',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
]

const FOOTER_LINKS = {
  Prodotti: [
    { label: 'Menopausa Complex',          href: '/prodotti/menopausa-complex' },
    { label: 'Capelli, Pelle & Unghie',    href: '/prodotti/capelli-pelle-unghie' },
    { label: 'Microcircolo Superior',      href: '/prodotti/microcircolo-superior' },
    { label: 'Multivitaminico & Minerali', href: '/prodotti/multivitaminico-minerali' },
  ],
  Brand: [
    { label: 'Chi siamo',  href: '/brand' },
    { label: 'Blog',       href: '/blog' },
    { label: 'Contatti',   href: '/contatti' },
  ],
  Legale: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Cookie policy',  href: '/cookie' },
    { label: 'Note legali',    href: '/note-legali' },
  ],
}

/** Footer — Server Component. */
export function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        background: 'var(--forest)',
        borderTop: '1px solid var(--amber)',
        padding: '52px 24px 24px',
      }}
    >
      {/* Grid: 1 col mobile → 2 col sm → 4 col lg (2fr 1fr 1fr 1fr) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-10"
        style={{
          borderBottom: '0.5px solid rgba(184,144,60,0.15)',
          marginBottom: 22,
        }}
      >
        {/* Colonna brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          {/* Logo footer */}
          <div style={{ marginBottom: 14 }}>
            <Logo variant="light" height={90} />
          </div>

          <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(253,246,232,0.6)', lineHeight: 1.85, marginBottom: 20 }}>
            VIPHARMA di Tatulli Vito & Co. S.A.S.<br />
            Via Don Luigi Sturzo 44/46/48 — Bitonto (BA) 70032<br />
            Tel. 080 303 1103<br />
            08naturaltechnology@gmail.com
          </p>

        </div>

        {/* Colonne link */}
        {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string }[]][]).map(
          ([section, links]) => (
            <div key={section}>
              <p
                style={{
                  fontSize: 8.5,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(184,144,60,0.85)',
                  marginBottom: 14,
                }}
              >
                {section}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(({ label, href }) => (
                  <li key={href} style={{ marginBottom: 9 }}>
                    <Link
                      href={href}
                      className="footer-link"
                      style={{ fontSize: 11.5, fontWeight: 400 }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p style={{ fontSize: 10, fontWeight: 300, color: 'rgba(253,246,232,0.5)', letterSpacing: '0.06em' }}>
          © {new Date().getFullYear()} 08 Natural Technology · Tutti i diritti riservati
        </p>

        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="footer-link"
              style={{ color: 'rgba(184,144,60,0.9)' }}
            >
              {icon}
            </a>
          ))}
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(184,144,60,0.9)',
            border: '0.5px solid rgba(184,144,60,0.5)',
            padding: '5px 16px',
          }}
        >
          Made in Italy
        </span>
      </div>
    </footer>
  )
}
