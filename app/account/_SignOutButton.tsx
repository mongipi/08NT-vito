'use client'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      style={{
        flexShrink: 0,
        background: 'transparent',
        color: 'rgba(255,255,255,0.5)',
        border: '0.5px solid rgba(255,255,255,0.18)',
        cursor: 'pointer',
        fontSize: '0.5rem',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        padding: '0.4375rem 0.875rem',
        transition: 'color 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap',
        alignSelf: 'flex-start',
      }}
    >
      Esci
    </button>
  )
}
