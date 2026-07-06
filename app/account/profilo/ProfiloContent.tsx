'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

const inp: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid var(--border-2)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', color: 'var(--ink)', outline: 'none',
  background: 'white', fontFamily: 'var(--font-montserrat)',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.5625rem', fontWeight: 500,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: '0.375rem',
}
const sec: React.CSSProperties = {
  fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em',
  textTransform: 'uppercase', color: 'var(--ink-4)',
  margin: '0 0 1rem', paddingBottom: '0.625rem',
  borderBottom: '0.5px solid var(--border)',
}
const card: React.CSSProperties = {
  background: 'white', border: '1px solid var(--border)', padding: '1.5rem',
}

function Field({ label, name, defaultValue, type = 'text', placeholder }: {
  label: string; name: string; defaultValue?: string | null; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input name={name} type={type} defaultValue={defaultValue ?? ''} placeholder={placeholder} style={inp} />
    </div>
  )
}

interface UserData {
  name: string | null
  email: string
  phone: string | null
  fiscalCode: string | null
  company: string | null
  vatNumber: string | null
  sdiCode: string | null
  pec: string | null
}

interface AddressData {
  id: string
  label: string | null
  isDefault: boolean
  firstName: string
  lastName: string
  company: string | null
  address: string
  city: string
  postalCode: string
  province: string | null
  phone: string | null
}

interface Props {
  user: UserData
  addresses: AddressData[]
  saved?: string
  updateUserInfo: (fd: FormData) => Promise<void>
  deleteAddress: (fd: FormData) => Promise<void>
  setDefaultAddress: (fd: FormData) => Promise<void>
}

export function ProfiloContent({ user, addresses, saved, updateUserInfo, deleteAddress, setDefaultAddress }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)

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
            {t('profile_back_to_account')}
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)', fontWeight: 300,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'white',
            margin: 0, letterSpacing: '0.02em',
          }}>
            {t('profile_heading')}
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '1.75rem 1.25rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#15803d' }}>
            ✓ {t('profile_saved')}
          </div>
        )}

        {/* ── Dati personali ── */}
        <form action={updateUserInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={card}>
            <p style={sec}>{t('profile_personal_data')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label={t('profile_full_name')} name="name" defaultValue={user.name} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label={t('profile_phone')} name="phone" defaultValue={user.phone} placeholder="+39 000 000 0000" />
                <Field label={t('profile_fiscal_code')} name="fiscalCode" defaultValue={user.fiscalCode} placeholder="RSSMRA80A01H501U" />
              </div>
              <div>
                <label style={lbl}>{t('profile_email')}</label>
                <input value={user.email} disabled style={{ ...inp, background: 'var(--paper)', color: 'var(--ink-4)', cursor: 'not-allowed' }} />
              </div>
            </div>
          </div>

          <div style={card}>
            <p style={sec}>
              {t('profile_company_data')}{' '}
              <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>
                {t('profile_company_data_hint')}
              </span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label={t('profile_company_name')} name="company" defaultValue={user.company} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label={t('profile_vat_number')} name="vatNumber" defaultValue={user.vatNumber} />
                <Field label={t('profile_sdi_code')} name="sdiCode" defaultValue={user.sdiCode} placeholder="XXXXXXX" />
              </div>
              <Field label={t('profile_pec')} name="pec" type="email" defaultValue={user.pec} placeholder="pec@esempio.it" />
            </div>
          </div>

          <button type="submit" style={{
            padding: '0.9375rem', background: 'var(--forest)', color: 'white',
            border: 'none', cursor: 'pointer',
            fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            {t('profile_save_changes')}
          </button>
        </form>

        {/* ── Indirizzi ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ ...sec, margin: 0, border: 'none', paddingBottom: 0 }}>{t('profile_shipping_addresses')}</p>
            <Link href="/account/indirizzi/nuovo" style={{
              fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--forest)',
              border: '1px solid var(--forest)', padding: '0.375rem 0.75rem',
              textDecoration: 'none',
            }}>
              {t('profile_new_address')}
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {addresses.length === 0 && (
              <div style={{ ...card, textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--ink-4)', fontWeight: 300, margin: '0 0 1.25rem' }}>
                  {t('profile_no_saved_address')}
                </p>
                <Link href="/account/indirizzi/nuovo" style={{
                  display: 'inline-block', padding: '0.625rem 1.25rem',
                  background: 'var(--forest)', color: 'white', textDecoration: 'none',
                  fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>
                  {t('profile_add_address')}
                </Link>
              </div>
            )}

            {addresses.map((addr) => (
              <div key={addr.id} style={{ ...card, padding: 0, border: addr.isDefault ? '1px solid var(--forest)' : '1px solid var(--border)' }}>
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
                          {t('profile_default_badge')}
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
                    {t('profile_edit')}
                  </Link>
                </div>

                {!addr.isDefault && (
                  <div style={{ borderTop: '0.5px solid var(--border)', padding: '0.625rem 1.25rem', display: 'flex', gap: '1rem' }}>
                    <form action={setDefaultAddress}>
                      <input type="hidden" name="id" value={addr.id} />
                      <button type="submit" style={{ fontSize: '0.6875rem', color: 'var(--forest)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {t('profile_set_default')}
                      </button>
                    </form>
                    <form action={deleteAddress}>
                      <input type="hidden" name="id" value={addr.id} />
                      <button type="submit" style={{ fontSize: '0.6875rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {t('profile_delete')}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
