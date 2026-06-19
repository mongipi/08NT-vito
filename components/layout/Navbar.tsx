'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from './Logo'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',            label: 'Home' },
  { href: '/prodotti',    label: 'Prodotti' },
  { href: '/metodo',      label: 'Qualità 08' },
  { href: '/blog',        label: 'Blog' },
  { href: '/b2b',         label: 'Area Rivenditori' },
  { href: '/contatti',    label: 'Contatti' },
] as const

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com',
    label: 'Facebook',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com',
    label: 'Instagram',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
] as const

export function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-200',
        scrolled ? 'shadow-sm' : 'shadow-none'
      )}
      style={{ borderBottom: '1px solid var(--amber)' }}
    >
      <nav
        className="flex h-24 items-center justify-between"
        style={{ padding: '0 3rem' }}
        aria-label="Navigazione principale"
      >
        {/* Logo */}
        <Logo variant="dark" height={72} />

        {/* Desktop links */}
        <ul className="hidden md:flex items-center" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex h-24 items-center uppercase transition-colors duration-[180ms]',
                  isActive(href)
                    ? 'text-[var(--green)]'
                    : 'text-[var(--ink-3)] hover:text-[var(--green)]'
                )}
                style={{
                  padding: '0 0.875rem',
                  fontSize: '0.625rem',
                  fontWeight: isActive(href) ? 500 : 400,
                  letterSpacing: '0.14em',
                  borderBottom: isActive(href)
                    ? '2px solid var(--amber)'
                    : '2px solid transparent',
                }}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Social + lang switcher desktop */}
        <div className="hidden md:flex items-center gap-4" style={{ paddingLeft: '1rem' }}>
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-[var(--amber)] hover:opacity-70 transition-opacity duration-150"
            >
              {icon}
            </a>
          ))}

          {/* Language switcher */}
          <div
            className="flex items-center"
            style={{
              border: '0.5px solid var(--border-2)',
              marginLeft: 8,
              overflow: 'hidden',
            }}
          >
            {(['IT', 'EN'] as const).map((lang, i) => (
              <button
                key={lang}
                aria-label={`Lingua ${lang}`}
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: lang === 'IT' ? 600 : 400,
                  letterSpacing: '0.14em',
                  padding: '5px 9px',
                  background: lang === 'IT' ? 'var(--forest)' : 'transparent',
                  color: lang === 'IT' ? '#fff' : 'var(--ink-3)',
                  border: 'none',
                  borderLeft: i > 0 ? '0.5px solid var(--border-2)' : 'none',
                  cursor: 'pointer',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className={cn('block h-px w-5 bg-[var(--ink)] transition-transform duration-200', mobileOpen && 'translate-y-[6px] rotate-45')} />
          <span className={cn('block h-px w-5 bg-[var(--ink)] transition-opacity duration-200', mobileOpen && 'opacity-0')} />
          <span className={cn('block h-px w-5 bg-[var(--ink)] transition-transform duration-200', mobileOpen && '-translate-y-[6px] -rotate-45')} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn('md:hidden overflow-hidden transition-all duration-300', mobileOpen ? 'max-h-[500px]' : 'max-h-0')}
        style={{ borderTop: '0.5px solid var(--border)' }}
      >
        <ul className="flex flex-col px-6 py-4 gap-1" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block py-3 uppercase transition-colors duration-150',
                  isActive(href) ? 'text-[var(--green)]' : 'text-[var(--ink-3)] hover:text-[var(--green)]'
                )}
                style={{
                  fontSize: '0.625rem',
                  fontWeight: isActive(href) ? 500 : 400,
                  letterSpacing: '0.14em',
                  borderBottom: '0.5px solid var(--border)',
                }}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Social icons mobile */}
        <div className="flex items-center gap-5 px-6 pb-5 pt-1">
          {SOCIAL_LINKS.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-[var(--amber)] hover:opacity-70 transition-opacity duration-150"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
