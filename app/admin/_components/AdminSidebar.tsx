'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  {
    label: 'Generale',
    items: [{ href: '/admin', label: 'Dashboard', icon: IconGrid }],
  },
  {
    label: 'Catalogo',
    items: [
      { href: '/admin/prodotti', label: 'Prodotti', icon: IconBox },
      { href: '/admin/linee',    label: 'Linee',    icon: IconPalette },
      { href: '/admin/articoli', label: 'Articoli', icon: IconFile },
    ],
  },
  {
    label: 'Vendite',
    items: [{ href: '/admin/ordini', label: 'Ordini', icon: IconCart }],
  },
  {
    label: 'Clienti',
    items: [{ href: '/admin/utenti', label: 'Utenti', icon: IconUsers }],
  },
  {
    label: 'Marketing',
    items: [{ href: '/admin/sconti', label: 'Sconti & Coupon', icon: IconTag }],
  },
  {
    label: 'Sistema',
    items: [{ href: '/admin/impostazioni', label: 'Impostazioni', icon: IconSettings }],
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      <aside className={`admin-sidebar${open ? ' admin-sidebar--open' : ''}`}>
        {/* Logo */}
        <div style={{ height: '3.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '0.6875rem', fontWeight: 700 }}>08</span>
          </div>
          <span style={{ color: 'white', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.01em' }}>NT Admin</span>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            aria-label="Chiudi menu"
            className="md:hidden"
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '0.25rem', display: 'flex' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
          {nav.map((section) => (
            <div key={section.label} style={{ marginBottom: '1.25rem' }}>
              <p style={{
                fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', padding: '0 1.25rem', marginBottom: '0.25rem',
                marginTop: 0,
              }}>
                {section.label}
              </p>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.5rem 1.25rem', fontSize: '0.8125rem', textDecoration: 'none',
                      color: active ? 'white' : 'rgba(255,255,255,0.55)',
                      background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                      fontWeight: active ? 500 : 400,
                      transition: 'all 0.15s',
                      borderLeft: active ? '0.125rem solid rgba(255,255,255,0.6)' : '0.125rem solid transparent',
                    }}
                  >
                    <Icon />
                    {label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <Link href="/" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
          }}>
            <IconExternal />
            Vai al sito
          </Link>
        </div>
      </aside>

      <style>{`
        .admin-sidebar {
          width: 16rem;
          background: #0b1e12;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: fixed;
          top: 0;
          left: -16rem;
          height: 100dvh;
          z-index: 50;
          transition: left 0.25s ease;
        }
        .admin-sidebar--open {
          left: 0;
        }
        @media (min-width: 48rem) {
          .admin-sidebar {
            position: static;
            height: auto;
            left: 0;
          }
        }
      `}</style>
    </>
  )
}

function IconGrid() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
}
function IconBox() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}
function IconFile() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
}
function IconCart() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
}
function IconUsers() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function IconPalette() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.28 0 .5-.22.5-.5v-1c0-.28-.1-.53-.28-.72-.17-.18-.27-.43-.27-.68 0-.55.45-1 1-1h1.5c2.49 0 4.5-2.01 4.5-4.5 0-4.97-4.03-9-9-9z"/></svg>
}
function IconTag() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
}
function IconSettings() {
  return <svg width="0.9375rem" height="0.9375rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
function IconExternal() {
  return <svg width="0.6875rem" height="0.6875rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
}
