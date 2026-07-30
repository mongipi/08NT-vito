'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

interface NewsletterSignupProps {
  variant?: 'section' | 'footer' | 'popup'
  onDone?: () => void
}

const POPUP_KEY = '08nt_newsletter_popup_seen_v1'

export function NewsletterSignup({ variant = 'section', onDone }: NewsletterSignupProps) {
  const { locale } = useLocale()
  const siteSettings = useSiteSettings()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), locale, source: variant }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Errore iscrizione')
      setStatus('success')
      setMessage(data?.message || 'Iscrizione confermata. Il tuo extra sconto 5% e stato riservato.')
      setEmail('')
      onDone?.()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Non siamo riusciti a completare l iscrizione.')
    }
  }

  return (
    <form className={`v61-newsletter v61-newsletter-${variant}`} onSubmit={submit}>
      <div>
        <span className="v61-newsletter-kicker">{siteSettings.newsletterKicker}</span>
        <h2>{siteSettings.newsletterTitle}</h2>
        <p>{siteSettings.newsletterBody}</p>
      </div>
      <div className="v61-newsletter-fields">
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={siteSettings.newsletterEmailPlaceholder}
            required
          />
        </label>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Invio...' : siteSettings.newsletterButtonLabel}
        </button>
      </div>
      {message && <p className={`v61-newsletter-message ${status}`}>{message}</p>}
    </form>
  )
}

export function NewsletterPopup() {
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
        aria-label="Iscrizione newsletter"
      >
        <button
          type="button"
          className="v61-newsletter-close"
          onClick={close}
          aria-label="Chiudi"
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
