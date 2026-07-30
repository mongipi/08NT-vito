'use client'

import { useMemo, useState } from 'react'
import type { ManagedFooterLogo } from '@/lib/site-settings'

type Props = {
  couriersName: string
  couriersInitialValue: string
  courierDefaults: ManagedFooterLogo[]
  ministryName: string
  ministryInitialValue: string
  ministryDefault: ManagedFooterLogo
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  color: '#111827',
  outline: 'none',
  borderRadius: '0.375rem',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#6b7280',
  marginBottom: '0.375rem',
}

function normalizeLogos(raw: string, fallback: ManagedFooterLogo[]) {
  if (!raw.trim()) return fallback
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallback
    const items = parsed
      .map((item, index) => ({
        id: typeof item?.id === 'string' && item.id.trim() ? item.id.trim() : `logo-${index + 1}`,
        label: typeof item?.label === 'string' ? item.label : '',
        src: typeof item?.src === 'string' ? item.src : '',
        width: Number.isFinite(Number(item?.width)) ? Number(item.width) : 80,
        height: Number.isFinite(Number(item?.height)) ? Number(item.height) : 24,
        enabled: item?.enabled !== false,
      }))
      .filter((item) => item.label && item.src)
    return items.length > 0 ? items : fallback
  } catch {
    return fallback
  }
}

function normalizeLogo(raw: string, fallback: ManagedFooterLogo) {
  if (!raw.trim()) return fallback
  try {
    const parsed = JSON.parse(raw)
    return {
      id: typeof parsed?.id === 'string' && parsed.id.trim() ? parsed.id.trim() : fallback.id,
      label: typeof parsed?.label === 'string' ? parsed.label : fallback.label,
      src: typeof parsed?.src === 'string' ? parsed.src : fallback.src,
      width: Number.isFinite(Number(parsed?.width)) ? Number(parsed.width) : fallback.width,
      height: Number.isFinite(Number(parsed?.height)) ? Number(parsed.height) : fallback.height,
      enabled: parsed?.enabled !== false,
    }
  } catch {
    return fallback
  }
}

export function FooterAssetsEditor({
  couriersName,
  couriersInitialValue,
  courierDefaults,
  ministryName,
  ministryInitialValue,
  ministryDefault,
}: Props) {
  const [couriers, setCouriers] = useState<ManagedFooterLogo[]>(() =>
    normalizeLogos(couriersInitialValue, courierDefaults)
  )
  const [ministry, setMinistry] = useState<ManagedFooterLogo>(() =>
    normalizeLogo(ministryInitialValue, ministryDefault)
  )

  const serializedCouriers = useMemo(() => JSON.stringify(couriers), [couriers])
  const serializedMinistry = useMemo(() => JSON.stringify(ministry), [ministry])

  function patchCourier(id: string, patch: Partial<ManagedFooterLogo>) {
    setCouriers((current) => current.map((logo) => (logo.id === id ? { ...logo, ...patch } : logo)))
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <input type="hidden" name={couriersName} value={serializedCouriers} />
      <input type="hidden" name={ministryName} value={serializedMinistry} />

      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '48rem' }}>
        Gestisci i loghi visuali del footer. Puoi cambiare immagine, dimensioni e visibilità senza
        entrare nel codice.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {couriers.map((logo, index) => (
          <div
            key={logo.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1rem',
              background: '#fafafa',
              display: 'grid',
              gap: '0.875rem',
            }}
          >
            <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Corriere {index + 1}</strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input style={inputStyle} value={logo.label} onChange={(event) => patchCourier(logo.id, { label: event.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Percorso immagine</label>
                <input style={inputStyle} value={logo.src} onChange={(event) => patchCourier(logo.id, { src: event.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 160px', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Larghezza</label>
                <input type="number" min="1" style={inputStyle} value={logo.width} onChange={(event) => patchCourier(logo.id, { width: Number(event.target.value) || logo.width })} />
              </div>
              <div>
                <label style={labelStyle}>Altezza</label>
                <input type="number" min="1" style={inputStyle} value={logo.height} onChange={(event) => patchCourier(logo.id, { height: Number(event.target.value) || logo.height })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#111827' }}>
                <input type="checkbox" checked={logo.enabled} onChange={(event) => patchCourier(logo.id, { enabled: event.target.checked })} />
                Visibile
              </label>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '1rem',
          background: '#fafafa',
          display: 'grid',
          gap: '0.875rem',
        }}
      >
        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Logo Ministero della Salute</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Etichetta alt</label>
            <input style={inputStyle} value={ministry.label} onChange={(event) => setMinistry({ ...ministry, label: event.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Percorso immagine</label>
            <input style={inputStyle} value={ministry.src} onChange={(event) => setMinistry({ ...ministry, src: event.target.value })} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 120px 160px', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Larghezza</label>
            <input type="number" min="1" style={inputStyle} value={ministry.width} onChange={(event) => setMinistry({ ...ministry, width: Number(event.target.value) || ministry.width })} />
          </div>
          <div>
            <label style={labelStyle}>Altezza</label>
            <input type="number" min="1" style={inputStyle} value={ministry.height} onChange={(event) => setMinistry({ ...ministry, height: Number(event.target.value) || ministry.height })} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#111827' }}>
            <input type="checkbox" checked={ministry.enabled} onChange={(event) => setMinistry({ ...ministry, enabled: event.target.checked })} />
            Visibile
          </label>
        </div>
      </div>
    </div>
  )
}
