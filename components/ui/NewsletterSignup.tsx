'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { postJson } from '@/lib/api-client'

interface NewsletterSignupProps {
  variant?: 'section' | 'footer' | 'popup'
  onDone?: () => void
}

const POPUP_KEY = '08nt_newsletter_popup_seen_v1'

export function NewsletterSignup({ variant = 'section', onDone }: NewsletterSignupProps) {
  const { locale } = useLocale()
  // I testi del blocco sono microcopy tradotta, non dati gestiti da admin:
  // a database sarebbero una stringa sola e resterebbero in una sola lingua.
  const t = useTranslation(locale)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  // Consenso esplicito: senza, l'iscrizione viene rifiutata anche dal server.
  const [consent, setConsent] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')

    try {
      const data = await postJson<{ message?: string }>(
        '/api/newsletter',
        { email: email.trim(), locale, source: variant, consent },
        { fallbackError: t('newsletter_error') }
      )
      setStatus('success')
      setMessage(data?.message || t('newsletter_success'))
      setEmail('')
      setConsent(false)
      onDone?.()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : t('newsletter_error'))
    }
  }

  return (
    <form className={`v61-newsletter v61-newsletter-${variant}`} onSubmit={submit}>
      <div>
        <span className="v61-newsletter-kicker">{t('newsletter_kicker')}</span>
        <h2>{t('newsletter_title')}</h2>
        <p>{t('newsletter_body')}</p>
      </div>
      <div className="v61-newsletter-fields">
        <label>
          <span>{t('newsletter_email_label')}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('newsletter_email_placeholder')}
            required
          />
        </label>
        <button type="submit" disabled={status === 'loading' || !consent}>
          {status === 'loading' ? t('newsletter_sending') : t('newsletter_button')}
        </button>
      </div>
      <label className="v61-newsletter-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>
          {t('newsletter_consent_before')}
          {locale === 'it' ? '’' : ' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            {t('newsletter_consent_link')}
          </a>{' '}
          {t('newsletter_consent_after')}
        </span>
      </label>
      {message && <p className={`v61-newsletter-message ${status}`}>{message}</p>}
    </form>
  )
}

export function NewsletterPopup() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(POPUP_KEY)) {
        const timer = window.setTimeout(() => setOpen(true), 900)
        return () => window.clearTimeout(timer)
      }
    } catch {}
  }, [])

  function close() {
    try {
      localStorage.setItem(POPUP_KEY, '1')
    } catch {}
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="v61-newsletter-popup-layer" role="presentation">
      <section
        className="v61-newsletter-popup"
        role="dialog"
        aria-modal="true"
        aria-label={t('newsletter_popup_aria')}
      >
        <button
          type="button"
          className="v61-newsletter-close"
          onClick={close}
          aria-label={t('common_close')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <NewsletterSignup variant="popup" onDone={close} />
      </section>
    </div>
  )
}
