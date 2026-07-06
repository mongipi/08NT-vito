'use client'

import { useState } from 'react'
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

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.6875rem', fontWeight: 500,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: '0.375rem',
}

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div style={{
        padding: '1.25rem 1.5rem', background: '#fff5f5',
        border: '1px solid #fecaca', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.875rem', color: '#dc2626', marginBottom: '0.75rem' }}>
          {t('reset_invalid_link')}
        </p>
        <Link href="/password-dimenticata" style={{ fontSize: '0.8125rem', color: 'var(--forest)', fontWeight: 500 }}>
          {t('reset_request_new_link')}
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('reset_password_mismatch'))
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? t('reset_generic_error'))
      setLoading(false)
      return
    }

    router.push('/login?reset=success')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={labelStyle}>{t('reset_new_password')}</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder={t('register_password_placeholder')}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>{t('reset_confirm_new_password')}</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          placeholder={t('register_confirm_password_placeholder')}
          style={inputStyle}
        />
      </div>

      {error && (
        <p style={{ fontSize: '0.8125rem', color: '#dc2626', padding: '0.625rem 0.875rem', background: '#fff5f5', border: '1px solid #fecaca' }}>
          {error}
        </p>
      )}

      <button
        type="submit" disabled={loading}
        style={{
          width: '100%', padding: '0.875rem', marginTop: '0.25rem',
          background: loading ? 'var(--ink-3)' : 'var(--forest)',
          color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
      >
        {loading ? t('reset_submitting') : t('reset_submit')}
      </button>
    </form>
  )
}
