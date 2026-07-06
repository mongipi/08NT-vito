'use client'

import type { UserAddress } from '@prisma/client'
import { COUNTRIES } from '@/lib/countries'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid var(--border-2)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', color: 'var(--ink)', outline: 'none',
  background: 'white', fontFamily: 'var(--font-montserrat)',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.5625rem', fontWeight: 500,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: '0.375rem',
}

function Field({ label, name, defaultValue, required, placeholder }: {
  label: string; name: string; defaultValue?: string | null; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
      <input name={name} defaultValue={defaultValue ?? ''} required={required} placeholder={placeholder} style={inputStyle} />
    </div>
  )
}

interface Props {
  action: (fd: FormData) => Promise<void>
  address?: UserAddress
}

export function AddressForm({ action, address }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const submitLabel = address ? t('address_form_save_changes') : t('address_form_save_new')

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {address && <input type="hidden" name="id" value={address.id} />}

      {/* Etichetta + predefinito */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Field label={t('address_form_label')} name="label" defaultValue={address?.label} placeholder={t('address_form_label_placeholder')} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--ink-3)', cursor: 'pointer', whiteSpace: 'nowrap', paddingBottom: '0.75rem' }}>
            <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault ?? false} style={{ width: '1rem', height: '1rem', accentColor: 'var(--forest)' }} />
            {t('address_form_default')}
          </label>
        </div>
      </div>

      {/* Intestatario */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 0.25rem', paddingBottom: '0.625rem', borderBottom: '0.5px solid var(--border)' }}>{t('address_form_recipient')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label={t('address_form_first_name')} name="firstName" defaultValue={address?.firstName} required />
          <Field label={t('address_form_last_name')} name="lastName" defaultValue={address?.lastName} required />
        </div>
        <Field label={t('address_form_company')} name="company" defaultValue={address?.company} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label={t('address_form_vat_number')} name="vatNumber" defaultValue={address?.vatNumber} />
          <Field label={t('address_form_fiscal_code')} name="fiscalCode" defaultValue={address?.fiscalCode} />
        </div>
      </div>

      {/* Indirizzo */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 0.25rem', paddingBottom: '0.625rem', borderBottom: '0.5px solid var(--border)' }}>{t('address_form_address_section')}</p>
        <Field label={t('address_form_street')} name="address" defaultValue={address?.address} required placeholder={t('address_form_street_placeholder')} />
        <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr 4rem', gap: '1rem' }}>
          <Field label={t('address_form_postal_code')} name="postalCode" defaultValue={address?.postalCode} required />
          <Field label={t('address_form_city')} name="city" defaultValue={address?.city} required />
          <Field label={t('address_form_province')} name="province" defaultValue={address?.province} placeholder="BA" />
        </div>
        <Field label={t('address_form_phone')} name="phone" defaultValue={address?.phone} placeholder={t('address_form_phone_placeholder')} />
        <div>
          <label style={labelStyle}>{t('address_form_country')}</label>
          <select name="country" defaultValue={address?.country ?? 'IT'} style={{ ...inputStyle, appearance: 'auto' }}>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <button type="submit" style={{
        padding: '0.9375rem', background: 'var(--forest)', color: 'white',
        border: 'none', cursor: 'pointer',
        fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        {submitLabel}
      </button>
    </form>
  )
}
