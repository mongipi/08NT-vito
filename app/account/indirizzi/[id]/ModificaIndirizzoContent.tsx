'use client'

import type { UserAddress } from '@prisma/client'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { AddressForm } from '../_AddressForm'

interface Props {
  address: UserAddress
  updateAddress: (fd: FormData) => Promise<void>
  deleteAddress: (fd: FormData) => Promise<void>
}

export function ModificaIndirizzoContent({ address, updateAddress, deleteAddress }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)

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
            {t('account_link_profile')}
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white',
            margin: 0, letterSpacing: '0.02em',
          }}>
            {address.label ?? t('address_edit_heading')}
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '1.75rem 1.25rem 3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AddressForm action={updateAddress} address={address} />

        {/* Elimina */}
        <form action={deleteAddress}>
          <input type="hidden" name="id" value={address.id} />
          <button type="submit" style={{
            width: '100%', padding: '0.875rem',
            background: 'transparent', color: '#dc2626',
            border: '1px solid #fca5a5', cursor: 'pointer',
            fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            {t('address_form_delete')}
          </button>
        </form>
      </div>
    </main>
  )
}
