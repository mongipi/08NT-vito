'use client'

import { signOut } from 'next-auth/react'

interface Props {
  user: { name?: string | null; email?: string | null }
  onMenuClick: () => void
}

export function AdminTopbar({ user, onMenuClick }: Props) {
  const initials = (user.name ?? user.email ?? 'A')
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <header style={{
      height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1rem',
      background: 'white', borderBottom: '1px solid #e8eaed',
      flexShrink: 0, gap: '1rem',
    }}>
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Apri menu"
        className="md:hidden"
        style={{
          width: '2rem', height: '2rem', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '0.3125rem',
          background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
        }}
      >
        <span style={{ display: 'block', width: '1.125rem', height: '0.0625rem', background: '#374151', borderRadius: '0.0625rem' }} />
        <span style={{ display: 'block', width: '1.125rem', height: '0.0625rem', background: '#374151', borderRadius: '0.0625rem' }} />
        <span style={{ display: 'block', width: '0.75rem', height: '0.0625rem', background: '#374151', borderRadius: '0.0625rem', alignSelf: 'flex-start' }} />
      </button>

      <div className="hidden md:block" style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className="hidden md:block" style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>{user.email}</span>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            fontSize: '0.75rem', fontWeight: 500, color: '#374151',
            background: 'none', border: '1px solid #e5e7eb', borderRadius: '0.375rem',
            padding: '0.3125rem 0.75rem', cursor: 'pointer',
          }}
        >
          Esci
        </button>

        <div style={{
          width: '2rem', height: '2rem', borderRadius: '50%',
          background: '#1a4a2e', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
        }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
