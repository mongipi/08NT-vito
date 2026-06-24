import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import { deleteAddress, setDefaultAddress } from '@/lib/actions/account'

export const metadata: Metadata = { title: 'I miei indirizzi — 08 Natural Technology' }

export default async function IndirizziPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const addresses = await prisma.userAddress.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100dvh' }}>
      <div style={{ height: '0.1875rem', background: 'var(--forest)' }} />

      {/* Header */}
      <section style={{ background: 'linear-gradient(150deg, #0b2214 0%, var(--forest) 100%)', padding: '1.75rem 1.25rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
          <Link href="/account" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', marginBottom: '1.25rem',
          }}>
            <svg width="0.625rem" height="0.625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Il mio account
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <h1 style={{
              fontFamily: 'var(--font-cormorant)', fontWeight: 300,
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white',
              margin: 0, letterSpacing: '0.02em',
            }}>
              Indirizzi
            </h1>
            <Link href="/account/indirizzi/nuovo" style={{
              fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              + Nuovo
            </Link>
          </div>
        </div>
      </section>

      {/* Lista */}
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '1.75rem 1.25rem 3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {addresses.length === 0 && (
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '3rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-4)', fontWeight: 300, margin: '0 0 1.25rem' }}>
              Nessun indirizzo salvato
            </p>
            <Link href="/account/indirizzi/nuovo" style={{
              display: 'inline-block', padding: '0.75rem 1.5rem',
              background: 'var(--forest)', color: 'white', textDecoration: 'none',
              fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              Aggiungi indirizzo
            </Link>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} style={{ background: 'white', border: addr.isDefault ? '1px solid var(--forest)' : '1px solid var(--border)' }}>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {addr.label && (
                    <span style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>
                      {addr.label}
                    </span>
                  )}
                  {addr.isDefault && (
                    <span style={{ fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', background: 'var(--forest)', color: 'white', padding: '0.1875rem 0.4375rem' }}>
                      Predefinito
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>
                  {[addr.firstName, addr.lastName].filter(Boolean).join(' ')}
                </span>
                {addr.company && <span style={{ fontSize: '0.8125rem', color: 'var(--ink-3)' }}>{addr.company}</span>}
                <span style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontWeight: 300 }}>{addr.address}</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontWeight: 300 }}>
                  {[addr.postalCode, addr.city, addr.province].filter(Boolean).join(' ')}
                </span>
                {addr.phone && <span style={{ fontSize: '0.75rem', color: 'var(--ink-4)', marginTop: '0.25rem' }}>{addr.phone}</span>}
              </div>

              <Link href={`/account/indirizzi/${addr.id}`} style={{
                fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ink-3)', textDecoration: 'none',
                border: '1px solid var(--border)', padding: '0.375rem 0.75rem',
                flexShrink: 0,
              }}>
                Modifica
              </Link>
            </div>

            {!addr.isDefault && (
              <div style={{ borderTop: '0.5px solid var(--border)', padding: '0.625rem 1.25rem', display: 'flex', gap: '1rem' }}>
                <form action={setDefaultAddress}>
                  <input type="hidden" name="id" value={addr.id} />
                  <button type="submit" style={{ fontSize: '0.6875rem', color: 'var(--forest)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Imposta come predefinito
                  </button>
                </form>
                <form action={deleteAddress}>
                  <input type="hidden" name="id" value={addr.id} />
                  <button type="submit" style={{ fontSize: '0.6875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Elimina
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
