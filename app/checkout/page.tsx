import type { Metadata } from 'next'
import { auth } from '@/auth'
import { getCheckoutProfile } from '@/services/users'
import { getDefaultAddress } from '@/services/addresses'
import { getPricingConfig } from '@/lib/domain/pricing-config'
import { CheckoutClient } from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout — 08 Natural Technology',
  robots: { index: false },
}

export default async function CheckoutPage() {
  const session = await auth()
  const pricing = await getPricingConfig()

  let prefill: React.ComponentProps<typeof CheckoutClient>['prefill'] = undefined

  if (session?.user) {
    const [user, defaultAddr] = await Promise.all([
      getCheckoutProfile(session.user.id),
      getDefaultAddress(session.user.id),
    ])

    const nameParts = (user?.name ?? '').split(' ')

    prefill = {
      firstName:  nameParts[0] ?? '',
      lastName:   nameParts.slice(1).join(' '),
      phone:      user?.phone ?? '',
      fiscalCode: user?.fiscalCode ?? '',
      company:    user?.company ?? '',
      vatNumber:  user?.vatNumber ?? '',
      pec:        user?.pec ?? '',
      sdiCode:    user?.sdiCode ?? '',
      // indirizzo predefinito
      address:    defaultAddr?.address ?? '',
      city:       defaultAddr?.city ?? '',
      postalCode: defaultAddr?.postalCode ?? '',
      province:   defaultAddr?.province ?? '',
      country:    defaultAddr?.country ?? 'IT',
    }
  }

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
          <CheckoutClient prefill={prefill} pricing={pricing} />
        </div>
      </div>
    </main>
  )
}
