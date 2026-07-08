'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'it' | 'en'
export const AVAILABLE_LOCALES: Locale[] = ['it', 'en']

const STORAGE_KEY = '08nt-locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('it')

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'it' || stored === 'en') setLocaleState(stored)
    } catch {}
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}

/** Sceglie il campo tradotto se presente e la lingua è EN, altrimenti l'originale italiano. */
export function pickLocalized(locale: Locale, original: string, translated?: string | null): string {
  if (locale === 'en' && translated) return translated
  return original
}
