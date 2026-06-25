'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Logo } from './Logo'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { useCart } from '@/contexts/CartContext'
import { CartDrawer } from '@/components/ui/CartDrawer'

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/prodotti', label: 'Prodotti' },
  { href: '/metodo',   label: 'Qualità 08' },
  { href: '/blog',     label: 'Blog' },
  { href: '/b2b',      label: 'Area Rivenditori' },
  { href: '/contatti', label: 'Contatti' },
] as const

/* ── Cart icon button (riutilizzabile) ──────────────────────── */
function CartButton({ size = 18, onOpen }: { size?: number; onOpen: () => void }) {
  const cart = useCart()
  return (
    <button
      onClick={onOpen}
      aria-label="Carrello"
      style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', padding: 4, display: 'flex', alignItems: 'center' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {cart.itemCount > 0 && (
        <span style={{
          position: 'absolute', top: -2, right: -2,
          minWidth: 16, height: 16, borderRadius: 99,
          background: 'var(--forest)', color: 'white',
          fontSize: '0.5rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
        }}>
          {cart.itemCount}
        </span>
      )}
    </button>
  )
}

/* ── User menu desktop ──────────────────────────────────────── */
function UserMenu() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (status === 'loading') return <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6' }} />

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 transition-colors duration-150 hover:text-[var(--green)]"
        style={{ fontSize: '0.625rem', letterSpacing: '0.14em', fontWeight: 500, color: 'var(--ink-3)', textTransform: 'uppercase' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        Accedi
      </Link>
    )
  }

  const initials = (session.user.name ?? session.user.email ?? '?').slice(0, 1).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Menu utente"
        style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--forest)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {initials}
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: '#fff', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 180, zIndex: 100, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111', margin: 0 }}>{session.user.name ?? 'Utente'}</p>
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0, marginTop: 2 }}>{session.user.email}</p>
          </div>
          <div style={{ padding: '4px 0' }}>
            <Link href="/account" onClick={() => setOpen(false)} style={menuItem}>Il mio account</Link>
            {session.user.role === 'admin' && (
              <Link href="/admin" onClick={() => setOpen(false)} style={{ ...menuItem, color: 'var(--green)', fontWeight: 500 }}>Pannello admin</Link>
            )}
            <button onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }} style={{ ...menuItem, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
              Esci
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const menuItem: React.CSSProperties = {
  display: 'block', padding: '8px 14px', fontSize: 12, color: '#374151', textDecoration: 'none',
}

/* ── Auth links nel menu mobile ─────────────────────────────── */
function MobileAuth({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession()
  if (status === 'loading') return null

  const link: React.CSSProperties = {
    display: 'block', padding: '12px 24px', fontSize: '0.625rem', letterSpacing: '0.14em',
    fontWeight: 500, textTransform: 'uppercase', borderBottom: '0.5px solid var(--border)', textDecoration: 'none',
  }

  if (!session) return (
    <div style={{ borderTop: '0.5px solid var(--border)' }}>
      <Link href="/login" onClick={onClose} style={{ ...link, color: 'var(--green)' }}>Accedi</Link>
      <Link href="/registrati" onClick={onClose} style={{ ...link, color: 'var(--ink-3)' }}>Registrati</Link>
    </div>
  )

  return (
    <div style={{ borderTop: '0.5px solid var(--border)' }}>
      <Link href="/account" onClick={onClose} style={{ ...link, color: 'var(--ink-3)' }}>Il mio account</Link>
      {session.user.role === 'admin' && (
        <Link href="/admin" onClick={onClose} style={{ ...link, color: 'var(--green)' }}>Pannello admin</Link>
      )}
      <button
        onClick={() => { onClose(); signOut({ callbackUrl: '/' }) }}
        style={{ ...link, width: '100%', textAlign: 'left', background: 'none', border: 'none', borderBottom: '0.5px solid var(--border)', cursor: 'pointer', color: '#dc2626' }}
      >
        Esci
      </button>
    </div>
  )
}

/* ── Navbar principale ──────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener('cart:open', open)
    return () => window.removeEventListener('cart:open', open)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className={cn('sticky top-0 z-50 bg-white transition-shadow duration-200', scrolled ? 'shadow-sm' : 'shadow-none')}
        style={{ borderBottom: '1px solid var(--amber)' }}
      >
        <nav
          className="flex h-24 items-center justify-between"
          style={{ padding: '0 1.5rem' }}
          aria-label="Navigazione principale"
        >
          {/* Logo */}
          <Logo variant="dark" height={72} />

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn('flex h-24 items-center uppercase transition-colors duration-[180ms]', isActive(href) ? 'text-[var(--green)]' : 'text-[var(--ink-3)] hover:text-[var(--green)]')}
                  style={{ padding: '0 0.875rem', fontSize: '0.625rem', fontWeight: isActive(href) ? 500 : 400, letterSpacing: '0.14em', borderBottom: isActive(href) ? '2px solid var(--amber)' : '2px solid transparent' }}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right: social + lang + cart + user */}
          <div className="hidden md:flex items-center gap-4">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-[var(--amber)] hover:opacity-70 transition-opacity duration-150" style={{ fontSize: 16 }}>
                {icon}
              </a>
            ))}

            <div className="flex items-center" style={{ border: '0.5px solid var(--border-2)', marginLeft: 8, overflow: 'hidden' }}>
              {(['IT', 'EN'] as const).map((lang, i) => (
                <button key={lang} aria-label={`Lingua ${lang}`} style={{ fontSize: '0.5625rem', fontWeight: lang === 'IT' ? 600 : 400, letterSpacing: '0.14em', padding: '5px 9px', background: lang === 'IT' ? 'var(--forest)' : 'transparent', color: lang === 'IT' ? '#fff' : 'var(--ink-3)', border: 'none', borderLeft: i > 0 ? '0.5px solid var(--border-2)' : 'none', cursor: 'pointer' }}>
                  {lang}
                </button>
              ))}
            </div>

            <CartButton onOpen={() => setCartOpen(true)} />
            <UserMenu />
          </div>

          {/* Mobile right: cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <CartButton size={20} onOpen={() => setCartOpen(true)} />
            <button
              className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className={cn('block h-px w-5 bg-[var(--ink)] transition-transform duration-200', mobileOpen && 'translate-y-[6px] rotate-45')} />
              <span className={cn('block h-px w-5 bg-[var(--ink)] transition-opacity duration-200', mobileOpen && 'opacity-0')} />
              <span className={cn('block h-px w-5 bg-[var(--ink)] transition-transform duration-200', mobileOpen && '-translate-y-[6px] -rotate-45')} />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        <div
          id="mobile-menu"
          className={cn('md:hidden overflow-hidden transition-all duration-300', mobileOpen ? 'max-h-[600px]' : 'max-h-0')}
          style={{ borderTop: '0.5px solid var(--border)' }}
        >
          <ul className="flex flex-col px-6 py-4 gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn('block py-3 uppercase transition-colors duration-150', isActive(href) ? 'text-[var(--green)]' : 'text-[var(--ink-3)] hover:text-[var(--green)]')}
                  style={{ fontSize: '0.625rem', fontWeight: isActive(href) ? 500 : 400, letterSpacing: '0.14em', borderBottom: '0.5px solid var(--border)' }}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5 px-6 pb-4 pt-1">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="text-[var(--amber)] hover:opacity-70 transition-opacity duration-150" style={{ fontSize: 16 }}>
                {icon}
              </a>
            ))}
          </div>

          <MobileAuth onClose={() => setMobileOpen(false)} />
        </div>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
