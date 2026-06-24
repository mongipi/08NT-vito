import type { UserAddress } from '@prisma/client'

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
  submitLabel: string
}

export function AddressForm({ action, address, submitLabel }: Props) {
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {address && <input type="hidden" name="id" value={address.id} />}

      {/* Etichetta + predefinito */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Field label="Etichetta (opzionale)" name="label" defaultValue={address?.label} placeholder="es. Casa, Ufficio, Magazzino" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--ink-3)', cursor: 'pointer', whiteSpace: 'nowrap', paddingBottom: '0.75rem' }}>
            <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault ?? false} style={{ width: '1rem', height: '1rem', accentColor: 'var(--forest)' }} />
            Predefinito
          </label>
        </div>
      </div>

      {/* Intestatario */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 0.25rem', paddingBottom: '0.625rem', borderBottom: '0.5px solid var(--border)' }}>Intestatario</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Nome" name="firstName" defaultValue={address?.firstName} required />
          <Field label="Cognome" name="lastName" defaultValue={address?.lastName} required />
        </div>
        <Field label="Ragione sociale (aziende)" name="company" defaultValue={address?.company} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Partita IVA" name="vatNumber" defaultValue={address?.vatNumber} />
          <Field label="Codice fiscale" name="fiscalCode" defaultValue={address?.fiscalCode} />
        </div>
      </div>

      {/* Indirizzo */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: '0 0 0.25rem', paddingBottom: '0.625rem', borderBottom: '0.5px solid var(--border)' }}>Indirizzo</p>
        <Field label="Via / Piazza" name="address" defaultValue={address?.address} required placeholder="es. Via Roma 1" />
        <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr 4rem', gap: '1rem' }}>
          <Field label="CAP" name="postalCode" defaultValue={address?.postalCode} required />
          <Field label="Città" name="city" defaultValue={address?.city} required />
          <Field label="Prov." name="province" defaultValue={address?.province} placeholder="BA" />
        </div>
        <Field label="Telefono" name="phone" defaultValue={address?.phone} placeholder="+39 000 000 0000" />
        <div>
          <label style={labelStyle}>Paese</label>
          <select name="country" defaultValue={address?.country ?? 'IT'} style={{ ...inputStyle, appearance: 'auto' }}>
            <option value="IT">Italia</option>
            <option value="SM">San Marino</option>
            <option value="VA">Città del Vaticano</option>
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
