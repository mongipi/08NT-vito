'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

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
          Link non valido.
        </p>
        <Link href="/password-dimenticata" style={{ fontSize: '0.8125rem', color: 'var(--forest)', fontWeight: 500 }}>
          Richiedi un nuovo link →
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Le password non coincidono')
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
      setError(data.error ?? 'Errore durante il reset della password')
      setLoading(false)
      return
    }

    router.push('/login?reset=success')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={labelStyle}>Nuova password</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Minimo 8 caratteri"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Conferma nuova password</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Ripeti la password"
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
        {loading ? 'Salvataggio…' : 'Reimposta password'}
      </button>
    </form>
  )
}
