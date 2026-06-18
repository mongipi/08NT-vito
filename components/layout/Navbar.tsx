'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Logo } from './Logo'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/',         label: 'Home' },
  { href: '/prodotti', label: 'Prodotti' },
  { href: '/brand',    label: 'Brand' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contatti', label: 'Contatti' },
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
        className="flex h-16 items-center justify-between"
        style={{ padding: '0 48px' }}
        aria-label="Navigazione principale"
      >
        {/* Logo */}
        <Logo color="var(--green)" />

        {/* Desktop links */}
        <ul className="hidden md:flex items-center" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex h-16 items-center uppercase transition-colors duration-[180ms]',
                  isActive(href)
                    ? 'text-[var(--green)] font-medium'
                    : 'text-[var(--ink-3)] hover:text-[var(--green)]'
                )}
                style={{
                  padding: '0 14px',
                  fontSize: 10,
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

        {/* Desktop CTA */}
        <Link
          href="/contatti"
          className="hidden md:inline-flex items-center uppercase transition-colors duration-[180ms] hover:bg-[var(--green)] hover:text-white"
          style={{
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: '0.18em',
            padding: '8px 18px',
            border: '1px solid var(--green)',
            color: 'var(--green)',
            background: 'none',
          }}
        >
          Contattaci
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={cn(
              'block h-px w-5 bg-[var(--ink)] transition-transform duration-200',
              mobileOpen && 'translate-y-[6px] rotate-45'
            )}
          />
          <span
            className={cn(
              'block h-px w-5 bg-[var(--ink)] transition-opacity duration-200',
              mobileOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block h-px w-5 bg-[var(--ink)] transition-transform duration-200',
              mobileOpen && '-translate-y-[6px] -rotate-45'
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-96' : 'max-h-0'
        )}
        style={{ borderTop: '0.5px solid var(--border)' }}
      >
        <ul className="flex flex-col px-12 py-4 gap-1" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block py-3 uppercase transition-colors duration-150',
                  isActive(href)
                    ? 'text-[var(--green)]'
                    : 'text-[var(--ink-3)] hover:text-[var(--green)]'
                )}
                style={{
                  fontSize: 10,
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
          <li className="pt-3">
            <Link
              href="/contatti"
              onClick={() => setMobileOpen(false)}
              className="inline-flex uppercase transition-colors duration-150 hover:bg-[var(--green)] hover:text-white"
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.18em',
                padding: '8px 18px',
                border: '1px solid var(--green)',
                color: 'var(--green)',
              }}
            >
              Contattaci
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
