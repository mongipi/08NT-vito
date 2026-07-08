'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid var(--border-2)', borderRadius: 0,
  padding: '0.75rem 1rem', fontSize: '0.875rem',
  color: 'var(--ink)', outline: 'none', background: 'white',
  fontFamily: 'var(--font-montserrat)',
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account'

  const VERIFY_BANNER: Record<string, { text: string; color: string; bg: string; border: string }> = {
    success: { text: t('login_verify_success'), color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
    expired: { text: t('login_verify_expired'), color: '#a16207', bg: '#fffbeb', border: '#fde68a' },
    invalid: { text: t('login_verify_invalid'), color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
  }

  const RESET_BANNER: Record<string, { text: string; color: string; bg: string; border: string }> = {
    success: { text: t('login_reset_success'), color: '#166534', bg: '#f0fdf4', border: '#bbf7d0' },
  }

  const verifyBanner = VERIFY_BANNER[searchParams.get('verify') ?? '']
  const resetBanner = RESET_BANNER[searchParams.get('reset') ?? '']
  const banner = verifyBanner ?? resetBanner

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setUnverifiedEmail(null)
    setResendState('idle')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      if (res.error === 'email_not_verified') {
        setError(t('login_error_unverified'))
        setUnverifiedEmail(email)
      } else {
        setError(t('login_error_credentials'))
      }
      setLoading(false)
    } else {
      const session = await getSession()
      const dest = session?.user?.role === 'admin' ? '/admin' : callbackUrl
      router.push(dest)
    }
  }

  async function handleResend() {
    if (!unverifiedEmail) return
    setResendState('sending')
    await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: unverifiedEmail }),
    })
    setResendState('sent')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {banner && (
        <p style={{
          fontSize: '0.8125rem', color: banner.color, lineHeight: 1.6,
          padding: '0.75rem 1rem', background: banner.bg, border: `1px solid ${banner.border}`,
        }}>
          {banner.text}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '0.375rem' }}>
            {t('login_email')}
          </label>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.375rem' }}>
            <label style={{ fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
              {t('login_password')}
            </label>
            <Link href="/password-dimenticata" style={{ fontSize: '0.75rem', color: 'var(--forest)', textDecoration: 'none', borderBottom: '1px solid var(--green-l)' }}>
              {t('login_forgot_password')}
            </Link>
          </div>
          <input
            type="password" required autoComplete="current-password"
            value={password} onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ fontSize: '0.8125rem', color: '#dc2626', padding: '0.625rem 0.875rem', background: '#fff5f5', border: '1px solid #fecaca' }}>
            {error}
          </p>
        )}

        {unverifiedEmail && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendState !== 'idle'}
            style={{
              alignSelf: 'flex-start', background: 'none', border: 'none', padding: 0,
              fontSize: '0.75rem', color: 'var(--forest)', textDecoration: 'underline',
              cursor: resendState === 'idle' ? 'pointer' : 'default',
            }}
          >
            {resendState === 'sent' ? t('login_resend_sent') : resendState === 'sending' ? t('login_resend_sending') : t('login_resend_verification')}
          </button>
        )}

        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', padding: '0.875rem',
            background: loading ? 'var(--ink-3)' : 'var(--forest)',
            color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
            transition: 'background 0.2s',
          }}
        >
          {loading ? t('login_submitting') : t('login_submit')}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
        <span style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', letterSpacing: '0.1em' }}>{t('login_or')}</span>
        <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
      </div>

      {/* Google */}
      <button
        onClick={() => signIn('google', { callbackUrl })}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          width: '100%', padding: '0.75rem',
          background: 'white', border: '1px solid var(--border-2)', cursor: 'pointer',
          fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)',
        }}
      >
        <GoogleIcon />
        {t('login_google')}
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
