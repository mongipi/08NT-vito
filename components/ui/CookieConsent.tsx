'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type CookiePreferenceKey = 'analytics' | 'marketing' | 'newsletter'

type CookiePreferences = Record<CookiePreferenceKey, boolean> & {
  necessary: true
  updatedAt: string
}

const STORAGE_KEY = '08nt_cookie_preferences_v1'
const COOKIE_NAME = '08nt_cookie_preferences'

const COOKIE_OPTIONS: {
  key: CookiePreferenceKey
  title: string
  body: string
}[] = [
  {
    key: 'analytics',
    title: 'Statistiche',
    body: 'Misurazione delle visite e delle interazioni, solo se verranno attivati strumenti come Analytics.',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    body: 'Misurazione campagne e pubblicità personalizzata, solo se verranno attivati strumenti come Meta Pixel o Google Ads.',
  },
  {
    key: 'newsletter',
    title: 'Newsletter',
    body: 'Tracciamenti collegati a newsletter, automazioni o comunicazioni commerciali, solo se presenti.',
  },
]

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  newsletter: false,
  updatedAt: '',
}

export function CookieConsent() {
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
          <p className="v61-cookie-kicker">Preferenze privacy</p>
          <h2 id="cookie-title">Gestione cookie</h2>
          <p>
            Usiamo cookie tecnici necessari per far funzionare carrello, checkout, sicurezza e preferenze.
            Gli strumenti facoltativi per statistiche, marketing o newsletter saranno attivati solo dopo consenso.
          </p>
          <Link href="/cookie">Leggi la Cookie Policy</Link>
        </div>

        {customizing && (
          <div className="v61-cookie-options">
            <div className="v61-cookie-option locked">
              <div>
                <strong>Necessari</strong>
                <span>Richiesti per il funzionamento del sito. Sempre attivi.</span>
              </div>
              <span className="v61-cookie-pill">Sempre attivi</span>
            </div>
            {COOKIE_OPTIONS.map((option) => (
              <label className="v61-cookie-option" key={option.key}>
                <div>
                  <strong>{option.title}</strong>
                  <span>{option.body}</span>
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
                Rifiuta facoltativi
              </button>
              <button type="button" className="v61-cookie-primary" onClick={() => save(preferences)}>
                Salva preferenze
              </button>
            </>
          ) : (
            <>
              <button type="button" className="v61-cookie-secondary" onClick={rejectOptional}>
                Rifiuta
              </button>
              <button type="button" className="v61-cookie-secondary" onClick={() => setCustomizing(true)}>
                Personalizza
              </button>
              <button type="button" className="v61-cookie-primary" onClick={acceptAll}>
                Accetta
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="v61-footer-cookie-button"
      onClick={() => window.dispatchEvent(new Event('08nt:open-cookie-preferences'))}
    >
      Preferenze cookie
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
