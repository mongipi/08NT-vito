'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

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

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Errore durante la registrazione')
        setLoading(false)
        return
      }
      await signIn('credentials', { email, password, callbackUrl: '/account', redirect: true })
    } catch {
      setError('Errore di rete. Riprova.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={labelStyle}>Nome</label>
        <input
          type="text" required autoComplete="name"
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Mario Rossi"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Email</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="mario@esempio.it"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Password</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Minimo 8 caratteri"
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
        {loading ? 'Creazione account…' : 'Crea account'}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', textAlign: 'center', lineHeight: 1.6 }}>
        Registrandoti accetti i nostri{' '}
        <a href="/termini-condizioni-vendita" style={{ color: 'var(--forest)', textDecoration: 'none', borderBottom: '1px solid var(--green-l)' }}>Termini e condizioni di vendita</a>
        {' '}e la{' '}
        <a href="/privacy" style={{ color: 'var(--forest)', textDecoration: 'none', borderBottom: '1px solid var(--green-l)' }}>Privacy Policy</a>.
      </p>
    </form>
  )
}
