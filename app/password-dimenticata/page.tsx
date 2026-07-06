import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { ForgotPasswordForm } from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Password dimenticata — 08 Natural Technology',
  description: 'Reimposta la password del tuo account 08 Natural Technology',
}

export default async function ForgotPasswordPage() {
  const session = await auth()
  if (session?.user) redirect('/account')
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: 'var(--forest)' }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem 1.25rem',
        background: 'linear-gradient(160deg, var(--paper) 0%, #fff 60%)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{
            fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--green)', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'block', width: 18, height: '1px', background: 'var(--green)' }} />
            Recupero account
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(2rem, 6vw, 2.75rem)',
            color: 'var(--forest)', lineHeight: 1, letterSpacing: '-0.01em',
            marginBottom: '0.375rem',
          }}>
            Password dimenticata?
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', marginBottom: '2.25rem', fontWeight: 300 }}>
            Inserisci la tua email e ti invieremo un link per reimpostarla.
          </p>

          <ForgotPasswordForm />

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--ink-3)', marginTop: '2rem' }}>
            <Link href="/login" style={{ color: 'var(--forest)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--green-l)' }}>
              Torna al login
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
