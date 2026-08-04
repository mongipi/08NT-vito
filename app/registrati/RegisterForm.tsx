'use client'

import { useState } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'
import { ApiError, postJson } from '@/lib/api-client'

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid var(--border-2)',
  borderRadius: 0,
  padding: '0.75rem 1rem',
  fontSize: '0.875rem',
  color: 'var(--ink)',
  outline: 'none',
  background: 'white',
  fontFamily: 'var(--font-montserrat)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--ink-3)',
  marginBottom: '0.375rem',
}

export function RegisterForm() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  // Non spuntata di default: una casella pre-selezionata non e' consenso valido.
  const [newsletter, setNewsletter] = useState(false)
  // L'account viene creato anche se l'email di conferma non parte: in quel caso
  // va detto, altrimenti si resta ad aspettare un messaggio che non arrivera'.
  const [emailSent, setEmailSent] = useState(true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('register_password_mismatch'))
      return
    }

    setLoading(true)
    try {
      const result = await postJson<{ emailSent?: boolean }>(
        '/api/auth/register',
        { name, email, password, confirmPassword, newsletter },
        { fallbackError: t('register_generic_error') }
      )
      setEmailSent(result.emailSent !== false)
      setSubmitted(true)
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status !== 0
          ? caught.message
          : t('register_network_error')
      )
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '1.25rem 1.5rem',
          background: emailSent ? 'var(--paper)' : '#fffbeb',
          border: `1px solid ${emailSent ? 'var(--border-2)' : '#fde68a'}`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--ink)',
            fontWeight: 500,
            marginBottom: '0.5rem',
          }}
        >
          {t(emailSent ? 'register_check_email_title' : 'register_email_failed_title')}
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          {richText(
            t(emailSent ? 'register_check_email_body' : 'register_email_failed_body', { email })
          )}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={labelStyle}>{t('register_name')}</label>
        <input
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('register_name_placeholder')}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t('login_email')}</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('register_email_placeholder')}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t('register_password')}</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('register_password_placeholder')}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t('register_confirm_password')}</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('register_confirm_password_placeholder')}
          style={inputStyle}
        />
      </div>

      {error && (
        <p
          style={{
            fontSize: '0.8125rem',
            color: '#dc2626',
            padding: '0.625rem 0.875rem',
            background: '#fff5f5',
            border: '1px solid #fecaca',
          }}
        >
          {error}
        </p>
      )}

      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          color: 'var(--ink-3)',
        }}
      >
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(event) => setNewsletter(event.target.checked)}
          style={{ marginTop: '0.15rem', accentColor: 'var(--forest)', flexShrink: 0 }}
        />
        <span>{t('newsletter_optin_register')}</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          marginTop: '0.25rem',
          background: loading ? 'var(--ink-3)' : 'var(--forest)',
          color: 'white',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
      >
        {loading ? t('register_submitting') : t('register_submit')}
      </button>

      <p
        style={{ fontSize: '0.75rem', color: 'var(--ink-4)', textAlign: 'center', lineHeight: 1.6 }}
      >
        {t('register_terms_prefix')}{' '}
        <a
          href="/termini-condizioni-vendita"
          style={{
            color: 'var(--forest)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--green-l)',
          }}
        >
          {t('register_terms_link')}
        </a>{' '}
        {t('register_and_the')}{' '}
        <a
          href="/privacy"
          style={{
            color: 'var(--forest)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--green-l)',
          }}
        >
          {t('register_privacy_link')}
        </a>
        .
      </p>
    </form>
  )
}
