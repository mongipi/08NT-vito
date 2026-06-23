import type { Metadata } from 'next'
import { CheckoutClient } from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout — 08 Natural Technology',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: 'var(--forest)' }} />
      <div style={{ flex: 1, background: 'var(--paper)', padding: '2rem 1.25rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 18, height: '1px', background: 'var(--green)', display: 'block' }} />
              Acquisto sicuro
            </div>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 300, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--forest)', margin: 0, lineHeight: 1 }}>
              Checkout
            </h1>
          </div>
          <CheckoutClient />
        </div>
      </div>
    </main>
  )
}
