import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createAddress } from '@/lib/actions/account'
import { AddressForm } from '../_AddressForm'

export const metadata: Metadata = { title: 'Nuovo indirizzo — 08 Natural Technology' }

export default async function NuovoIndirizzoPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100dvh' }}>
      <div style={{ height: '0.1875rem', background: 'var(--forest)' }} />

      <section style={{ background: 'linear-gradient(150deg, #0b2214 0%, var(--forest) 100%)', padding: '1.75rem 1.25rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
          <Link href="/account/profilo" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', marginBottom: '1.25rem',
          }}>
            <svg width="0.625rem" height="0.625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Il mio profilo
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white',
            margin: 0, letterSpacing: '0.02em',
          }}>
            Nuovo indirizzo
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '1.75rem 1.25rem 3rem' }}>
        <AddressForm action={createAddress} submitLabel="Salva indirizzo" />
      </div>
    </main>
  )
}
