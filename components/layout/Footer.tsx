import Link from 'next/link'
import { Logo } from './Logo'

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

          <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(253,246,232,0.6)', lineHeight: 1.85 }}>
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p style={{ fontSize: 10, fontWeight: 300, color: 'rgba(253,246,232,0.5)', letterSpacing: '0.06em' }}>
          © {new Date().getFullYear()} 08 Natural Technology · Tutti i diritti riservati
        </p>
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 300,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(184,144,60,0.9)',
            border: '0.5px solid rgba(184,144,60,0.5)',
            padding: '4px 14px',
          }}
        >
          Made in Italy
        </span>
      </div>
    </footer>
  )
}
