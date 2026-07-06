'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Logo } from './Logo'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { useCart } from '@/contexts/CartContext'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { useLocale, type Locale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

const NAV_LINKS = [
  { href: '/', key: 'nav_home' },
  { href: '/prodotti', key: 'nav_products' },
  { href: '/metodo', key: 'nav_quality' },
  { href: '/blog', key: 'nav_blog' },
  { href: '/lavora-con-noi', key: 'nav_careers' },
  { href: '/contatti', key: 'nav_contact' },
] as const

// Solo IT/EN sono attive: hanno contenuti tradotti. Le altre restano visibili
// ma disabilitate ("Prossimamente"), pronte per quando avranno traduzioni.
const LANG_FLAGS = [
  { code: 'it', label: 'Italiano', src: '/v61/flags/it.png', enabled: true },
  { code: 'en', label: 'English', src: '/v61/flags/gb.png', enabled: true },
  { code: 'es', label: 'Espanol', src: '/v61/flags/es.png', enabled: false },
  { code: 'fr', label: 'Francais', src: '/v61/flags/fr.png', enabled: false },
  { code: 'de', label: 'Deutsch', src: '/v61/flags/de.png', enabled: false },
  { code: 'pt', label: 'Portugues', src: '/v61/flags/pt.png', enabled: false },
] as const

function CartButton({ size = 18, onOpen }: { size?: number; onOpen: () => void }) {
  const cart = useCart()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  return (
    <button onClick={onOpen} aria-label={t('nav_cart')} className="v61-icon-button">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="20" r="1.35" />
        <circle cx="18" cy="20" r="1.35" />
        <path d="M3 4h2.2l2.15 10.25a2 2 0 0 0 1.95 1.58h7.7a2 2 0 0 0 1.9-1.38L21 8H6.1" />
        <path d="M8 11h10.8" />
      </svg>
      {cart.itemCount > 0 && <span className="v61-cart-count">{cart.itemCount}</span>}
    </button>
  )
}

function UserMenu() {
  const { data: session, status } = useSession()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (status === 'loading') return <div className="v61-user-skeleton" />

  if (!session) {
    return (
      <Link href="/login" className="v61-login-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {t('nav_login')}
      </Link>
    )
  }

  const initials = (session.user.name ?? session.user.email ?? '?').slice(0, 1).toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} aria-label={t('nav_account')} className="v61-user-button">
        {initials}
      </button>
      {open && (
        <div className="v61-user-menu">
          <div className="v61-user-menu-head">
            <p>{session.user.name ?? 'Utente'}</p>
            <span>{session.user.email}</span>
          </div>
          <Link href="/account" onClick={() => setOpen(false)}>{t('nav_account')}</Link>
          {session.user.role === 'admin' && <Link href="/admin" onClick={() => setOpen(false)}>{t('nav_admin')}</Link>}
          <button onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}>{t('nav_logout')}</button>
        </div>
      )}
    </div>
  )
}

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale()
  const t = useTranslation(locale)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = LANG_FLAGS.find((flag) => flag.code === locale) ?? LANG_FLAGS[0]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={cn('v61-language-switcher', compact && 'compact')} aria-label={t('lang_selector')}>
      <button
        type="button"
        className="v61-language-current"
        aria-label={`${t('lang_selector')}: ${selected.label}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Image src={selected.src} alt={selected.label} width={22} height={16} />
        <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="v61-language-options" role="listbox" aria-label={t('lang_selector')}>
          {LANG_FLAGS.map((flag) => (
            <button
              key={flag.code}
              type="button"
              disabled={!flag.enabled}
              className={cn(flag.code === locale && 'active', !flag.enabled && 'disabled')}
              aria-label={flag.enabled ? flag.label : `${flag.label} — ${t('lang_coming_soon')}`}
              aria-selected={flag.code === locale}
              title={flag.enabled ? flag.label : `${flag.label} — ${t('lang_coming_soon')}`}
              role="option"
              onClick={() => {
                if (!flag.enabled) return
                setLocale(flag.code as Locale)
                setOpen(false)
              }}
            >
              <Image src={flag.src} alt={flag.label} width={22} height={16} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileAuth({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  if (status === 'loading') return null

  if (!session) return (
    <div className="v61-mobile-auth">
      <Link href="/login" onClick={onClose}>{t('nav_login')}</Link>
      <Link href="/registrati" onClick={onClose}>{t('nav_register')}</Link>
    </div>
  )

  return (
    <div className="v61-mobile-auth">
      <Link href="/account" onClick={onClose}>{t('nav_account')}</Link>
      {session.user.role === 'admin' && <Link href="/admin" onClick={onClose}>{t('nav_admin')}</Link>}
      <button onClick={() => { onClose(); signOut({ callbackUrl: '/' }) }}>{t('nav_logout')}</button>
    </div>
  )
}

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

  const { locale } = useLocale()
  const t = useTranslation(locale)
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header className={cn('v61-site-header', scrolled && 'v61-site-header-scrolled')}>
        <nav className="v61-nav" aria-label="Navigazione principale">
          <Logo variant="dark" height={70} className="v61-header-logo" />

          <ul className="v61-menu" role="list">
            {NAV_LINKS.map(({ href, key }) => (
              <li key={href}>
                <Link href={href} className={cn(isActive(href) && 'active')} aria-current={isActive(href) ? 'page' : undefined}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="v61-nav-actions">
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="v61-social-link">
                <Image src={`/v61/icons/${label.toLowerCase()}.svg`} alt="" width={17} height={17} />
              </a>
            ))}
            <LanguageSwitcher />
            <CartButton onOpen={() => setCartOpen(true)} />
            <UserMenu />
          </div>

          <div className="v61-mobile-actions">
            <LanguageSwitcher compact />
            <CartButton size={20} onOpen={() => { setMobileOpen(false); setCartOpen(true) }} />
            <button
              className="v61-mobile-toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-drawer"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && <div className="v61-mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside
        id="mobile-menu-drawer"
        className={cn('v61-mobile-drawer', mobileOpen && 'open')}
        aria-hidden={!mobileOpen}
        aria-label="Menu mobile"
      >
        <div className="v61-mobile-drawer-head">
          <span>{t('nav_menu')}</span>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Chiudi menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="v61-mobile-drawer-body">
          <div className="v61-mobile-drawer-nav">
            {NAV_LINKS.map(({ href, key }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={cn(isActive(href) && 'active')}>
                {t(key)}
              </Link>
            ))}
          </div>
          <MobileAuth onClose={() => setMobileOpen(false)} />
        </div>
      </aside>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
