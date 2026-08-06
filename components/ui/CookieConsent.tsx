'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation, type DictionaryKey } from '@/lib/i18n/dictionary'

type CookiePreferenceKey = 'analytics' | 'marketing' | 'newsletter'

type CookiePreferences = Record<CookiePreferenceKey, boolean> & {
  necessary: true
  updatedAt: string
}

const STORAGE_KEY = '08nt_cookie_preferences_v1'
const COOKIE_NAME = '08nt_cookie_preferences'

const COOKIE_OPTIONS: {
  key: CookiePreferenceKey
  titleKey: DictionaryKey
  bodyKey: DictionaryKey
}[] = [
  { key: 'analytics', titleKey: 'cookie_option_analytics_title', bodyKey: 'cookie_option_analytics_body' },
  { key: 'marketing', titleKey: 'cookie_option_marketing_title', bodyKey: 'cookie_option_marketing_body' },
  { key: 'newsletter', titleKey: 'cookie_option_newsletter_title', bodyKey: 'cookie_option_newsletter_body' },
]

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  newsletter: false,
  updatedAt: '',
}

export function CookieConsent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    setMounted(true)
    const saved = readSavedPreferences()
    if (saved) setPreferences(saved)
    else setOpen(true)

    const openPanel = () => {
      const current = readSavedPreferences()
      if (current) setPreferences(current)
      setCustomizing(true)
      setOpen(true)
    }

    window.addEventListener('08nt:open-cookie-preferences', openPanel)
    return () => window.removeEventListener('08nt:open-cookie-preferences', openPanel)
  }, [])

  if (!mounted || !open) return null

  const save = (next: CookiePreferences) => {
    const value = { ...next, necessary: true as const, updatedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=15552000; Path=/; SameSite=Lax`
    window.dispatchEvent(new CustomEvent('08nt:cookie-consent', { detail: value }))
    setPreferences(value)
    setCustomizing(false)
    setOpen(false)
  }

  const rejectOptional = () => save(defaultPreferences)
  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true, newsletter: true, updatedAt: '' })

  return (
    <div className="v61-cookie-layer" role="presentation">
      <section
        className="v61-cookie-panel"
        role={customizing ? 'dialog' : 'region'}
        aria-modal={customizing || undefined}
        aria-labelledby="cookie-title"
      >
        <div className="v61-cookie-copy">
          <p className="v61-cookie-kicker">{t('cookie_kicker')}</p>
          <h2 id="cookie-title">{t('cookie_title')}</h2>
          <p>{t('cookie_intro')}</p>
          <Link href="/cookie">{t('cookie_read_policy')}</Link>
        </div>

        {customizing && (
          <div className="v61-cookie-options">
            <div className="v61-cookie-option locked">
              <div>
                <strong>{t('cookie_necessary_title')}</strong>
                <span>{t('cookie_necessary_body')}</span>
              </div>
              <span className="v61-cookie-pill">{t('cookie_always_active')}</span>
            </div>
            {COOKIE_OPTIONS.map((option) => (
              <label className="v61-cookie-option" key={option.key}>
                <div>
                  <strong>{t(option.titleKey)}</strong>
                  <span>{t(option.bodyKey)}</span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences[option.key]}
                  onChange={(event) => setPreferences((current) => ({ ...current, [option.key]: event.target.checked }))}
                />
              </label>
            ))}
          </div>
        )}

        <div className="v61-cookie-actions">
          {customizing ? (
            <>
              <button type="button" className="v61-cookie-secondary" onClick={rejectOptional}>
                {t('cookie_reject_optional')}
              </button>
              <button type="button" className="v61-cookie-primary" onClick={() => save(preferences)}>
                {t('cookie_save_preferences')}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="v61-cookie-secondary" onClick={rejectOptional}>
                {t('cookie_reject')}
              </button>
              <button type="button" className="v61-cookie-secondary" onClick={() => setCustomizing(true)}>
                {t('cookie_customize')}
              </button>
              <button type="button" className="v61-cookie-primary" onClick={acceptAll}>
                {t('cookie_accept')}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export function CookiePreferencesButton() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  return (
    <button
      type="button"
      className="v61-footer-cookie-button"
      onClick={() => window.dispatchEvent(new Event('08nt:open-cookie-preferences'))}
    >
      {t('footer_cookie_preferences')}
    </button>
  )
}

function readSavedPreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookiePreferences
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      newsletter: Boolean(parsed.newsletter),
      updatedAt: parsed.updatedAt || '',
    }
  } catch {
    return null
  }
}
