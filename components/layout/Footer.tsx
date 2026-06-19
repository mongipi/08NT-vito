import Link from 'next/link'
import { Logo } from './Logo'
import { SOCIAL_LINKS } from '@/lib/social-links'

const FOOTER_LINKS = {
  Prodotti: [
    { label: 'Menopausa Complex',          href: '/prodotti/menopausa-complex' },
    { label: 'Capelli, Pelle & Unghie',    href: '/prodotti/capelli-pelle-unghie' },
    { label: 'Microcircolo Superior',      href: '/prodotti/microcircolo-superior' },
    { label: 'Multivitaminico & Minerali', href: '/prodotti/multivitaminico-minerali' },
  ],
  Azienda: [
    { label: 'Qualità 08',       href: '/metodo' },
    { label: 'Blog',             href: '/blog' },
    { label: 'Area Rivenditori', href: '/b2b' },
    { label: 'Contatti',         href: '/contatti' },
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
        padding: '3.25rem 1.5rem 1.5rem',
      }}
    >
      {/* Grid: 1 col mobile → 2 col sm → 4 col lg (2fr 1fr 1fr 1fr) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-10"
        style={{
          borderBottom: '0.5px solid rgba(184,144,60,0.15)',
          marginBottom: '1.375rem',
        }}
      >
        {/* Colonna brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          {/* Logo footer */}
          <div style={{ marginBottom: '0.875rem' }}>
            <Logo variant="light" height={90} />
          </div>

          <p style={{ fontSize: '0.6875rem', fontWeight: 300, color: 'rgba(253,246,232,0.6)', lineHeight: 1.85, marginBottom: '1.25rem' }}>
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
                  fontSize: '0.53rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(184,144,60,0.85)',
                  marginBottom: '0.875rem',
                }}
              >
                {section}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map(({ label, href }) => (
                  <li key={href} style={{ marginBottom: '0.5625rem' }}>
                    <Link
                      href={href}
                      className="footer-link"
                      style={{ fontSize: '0.72rem', fontWeight: 400 }}
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
        <p style={{ fontSize: '0.625rem', fontWeight: 300, color: 'rgba(253,246,232,0.5)', letterSpacing: '0.06em' }}>
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
              style={{ color: 'rgba(184,144,60,0.9)'}}
            >
              {icon}
            </a>
          ))}
        </div>

        <span
          style={{
            fontSize: '0.625rem',
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(184,144,60,0.9)',
            border: '0.5px solid rgba(184,144,60,0.5)',
            padding: '0.3125rem 1rem',
          }}
        >
          Made in Italy
        </span>
      </div>
    </footer>
  )
}
