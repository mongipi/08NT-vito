import Link from 'next/link'

const FOOTER_LINKS = {
  Prodotti: [
    { label: 'Menopausa Complex',         href: '/prodotti/menopausa-complex' },
    { label: 'Capelli, Pelle & Unghie',   href: '/prodotti/capelli-pelle-unghie' },
    { label: 'Microcircolo Superior',     href: '/prodotti/microcircolo-superior' },
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
        padding: '52px 48px 24px',
      }}
    >
      {/* Grid principale: 2fr 1fr 1fr 1fr */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40,
          paddingBottom: 40,
          borderBottom: '0.5px solid rgba(184,144,60,0.15)',
          marginBottom: 22,
        }}
      >
        {/* Colonna brand */}
        <div>
          {/* Logo footer — silver */}
          <div style={{ marginBottom: 14 }}>
            <Link
              href="/"
              aria-label="08 Natural Technology"
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                border: '1.5px solid rgba(180,180,172,0.22)',
                color: 'rgba(180,180,172,0.35)',
                padding: '5px 10px 6px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: 'var(--silver-2)',
                  opacity: 0.5,
                }}
              >
                08
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-montserrat), system-ui, sans-serif',
                  fontSize: 6,
                  fontWeight: 300,
                  letterSpacing: '0.26em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  color: 'var(--silver)',
                  opacity: 0.4,
                }}
              >
                Natural Technology
              </span>
            </Link>
          </div>

          <p
            style={{
              fontSize: 11,
              fontWeight: 300,
              color: 'rgba(253,246,232,0.6)',
              lineHeight: 1.85,
            }}
          >
            VIPHARMA di Tatulli Vito & Co. S.A.S.<br />
            Via Don Luigi Sturzo 44/46/48 — Bitonto (BA) 70032<br />
            Tel. 080 303 1103 · 08naturaltechnology@gmail.com
          </p>
        </div>

        {/* Colonne link */}
        {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string }[]][]).map(
          ([section, links]) => (
            <div key={section}>
              <p
                style={{
                  fontSize: 8.5,
                  fontWeight: 500,
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
                    <Link href={href} className="footer-link" style={{ fontSize: 11.5, fontWeight: 400 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 300,
            color: 'rgba(253,246,232,0.5)',
            letterSpacing: '0.06em',
          }}
        >
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
