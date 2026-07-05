'use client'

import { useState } from 'react'

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

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{
        padding: '1.25rem 1.5rem', background: 'var(--paper)',
        border: '1px solid var(--border-2)', textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.9375rem', color: 'var(--ink)', fontWeight: 500, marginBottom: '0.5rem' }}>
          Controlla la tua email
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
          Se esiste un account associato a <strong>{email}</strong>, ti abbiamo inviato un link per reimpostare la password. Il link scade tra 1 ora.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={labelStyle}>Email</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="mario@esempio.it"
          style={inputStyle}
        />
      </div>

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
        {loading ? 'Invio in corso…' : 'Invia link di reimpostazione'}
      </button>
    </form>
  )
}
