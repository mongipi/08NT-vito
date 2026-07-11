'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/contexts/LocaleContext'

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          id: string
        ) => unknown
      }
    }
    googleTranslateElementInit08NT?: () => void
  }
}

const SCRIPT_ID = 'google-translate-08nt'
const ELEMENT_ID = 'google_translate_element_08nt'

export function TranslationBridge() {
  const { locale } = useLocale()
  const readyRef = useRef(false)

  useEffect(() => {
    if (document.getElementById(ELEMENT_ID)) return
    const mount = document.createElement('div')
    mount.id = ELEMENT_ID
    mount.style.display = 'none'
    document.body.appendChild(mount)
  }, [])

  useEffect(() => {
    window.googleTranslateElementInit08NT = () => {
      if (!window.google?.translate || readyRef.current) return
      readyRef.current = true
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'it',
          includedLanguages: 'en,es,fr,de,pt',
          autoDisplay: false,
        },
        ELEMENT_ID
      )
      setTimeout(() => applyGoogleTranslate(locale), 350)
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit08NT'
      script.async = true
      document.body.appendChild(script)
    } else if (readyRef.current) {
      applyGoogleTranslate(locale)
    }
  }, [locale])

  useEffect(() => {
    if (!readyRef.current) return
    applyGoogleTranslate(locale)
  }, [locale])

  return null
}

function applyGoogleTranslate(locale: string) {
  if (locale === 'it') {
    resetToItalian()
    return
  }

  const target = locale === 'it' ? '' : locale
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  setTranslateCookie(target)

  if (!select) return
  if (select.value === target) return
  select.value = target
  select.dispatchEvent(new Event('change'))
}

function setTranslateCookie(target: string) {
  const value = target ? `/it/${target}` : '/it/it'
  document.cookie = `googtrans=${value}; path=/; max-age=31536000; SameSite=Lax`

  const host = window.location.hostname
  if (host.includes('.')) {
    document.cookie = `googtrans=${value}; path=/; domain=.${host}; max-age=31536000; SameSite=Lax`
  }
}

function resetToItalian() {
  const hadTranslation = hasActiveTranslation()
  clearTranslateCookies()

  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (select && select.value) {
    select.value = ''
    select.dispatchEvent(new Event('change'))
  }

  if (hadTranslation) {
    window.setTimeout(() => window.location.reload(), 80)
  }
}

function hasActiveTranslation() {
  const cookie = readCookie('googtrans')
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  const translatedClass = document.documentElement.className.includes('translated-')
  return Boolean(
    (cookie && cookie !== '/it/it') ||
    (select && select.value) ||
    translatedClass
  )
}

function clearTranslateCookies() {
  const host = window.location.hostname
  const domains = new Set(['', host, `.${host}`])
  const parts = host.split('.')

  if (parts.length > 2) {
    domains.add(`.${parts.slice(-2).join('.')}`)
  }

  domains.forEach((domain) => {
    const domainPart = domain ? `; domain=${domain}` : ''
    document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainPart}`
    document.cookie = `googtrans=; path=/; max-age=0${domainPart}`
  })
}

function readCookie(name: string) {
  const prefix = `${name}=`
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length)
}
