import type { Metadata } from 'next'
import Link from 'next/link'
import { ClearCart } from './ClearCart'

export const metadata: Metadata = {
  title: 'Ordine confermato — 08 Natural Technology',
  robots: { index: false },
}

export default function SuccessPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <ClearCart />
      <div style={{ height: 3, background: 'var(--forest)' }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1.25rem',
        background: 'linear-gradient(160deg, var(--paper) 0%, #fff 60%)',
      }}>
        <div style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
          {/* Icona check */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#f0fdf4', border: '1.5px solid #bbf7d0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.75rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <div style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ width: 18, height: '1px', background: 'var(--green)', display: 'block' }} />
            Ordine confermato
            <span style={{ width: 18, height: '1px', background: 'var(--green)', display: 'block' }} />
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(2rem, 6vw, 2.75rem)',
            color: 'var(--forest)', lineHeight: 1, margin: '0 0 1rem',
          }}>
            Grazie per il tuo acquisto.
          </h1>

          <p style={{ fontSize: '0.875rem', color: 'var(--ink-3)', fontWeight: 300, lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: 380, margin: '0 auto 2.5rem' }}>
            Il tuo ordine è stato ricevuto e confermato. Riceverai una email con i dettagli della spedizione non appena il pacco sarà in partenza.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}>
            <Link href="/account" style={{
              display: 'block', padding: '0.875rem',
              background: 'var(--forest)', color: 'white', textDecoration: 'none',
              fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              textAlign: 'center',
            }}>
              Vedi i miei ordini
            </Link>
            <Link href="/prodotti" style={{
              display: 'block', padding: '0.875rem',
              background: 'transparent', color: 'var(--forest)', textDecoration: 'none',
              fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
              textAlign: 'center', border: '1px solid var(--forest)',
            }}>
              Continua gli acquisti
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
