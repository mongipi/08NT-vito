'use client'

import { useMemo, useState } from 'react'

export type ManagedHomeFeature = {
  id: string
  icon: string
  title: string
  body: string
}

type Props = {
  name: string
  initialValue: string
  defaults: ManagedHomeFeature[]
}

function normalizeFeatures(raw: string, defaults: ManagedHomeFeature[]) {
  if (!raw.trim()) return defaults

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaults

    const features = parsed.map((feature, index) => ({
      id: typeof feature?.id === 'string' && feature.id.trim() ? feature.id.trim() : `feature-${index + 1}`,
      icon: typeof feature?.icon === 'string' ? feature.icon : '',
      title: typeof feature?.title === 'string' ? feature.title : '',
      body: typeof feature?.body === 'string' ? feature.body : '',
    }))

    return features.length > 0 ? features : defaults
  } catch {
    return defaults
  }
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

export function HomeFeaturesEditor({ name, initialValue, defaults }: Props) {
  const [features, setFeatures] = useState<ManagedHomeFeature[]>(() => normalizeFeatures(initialValue, defaults))
  const serialized = useMemo(() => JSON.stringify(features), [features])

  function patchFeature(id: string, patch: Partial<ManagedHomeFeature>) {
    setFeatures((current) => current.map((feature) => (feature.id === id ? { ...feature, ...patch } : feature)))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name={name} value={serialized} />
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '44rem' }}>
        Gestisci i 4 box compatti subito sotto l hero della home. Puoi usare sigle, emoji o icone testuali semplici.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {features.map((feature, index) => (
          <div key={feature.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', background: '#fafafa', display: 'grid', gap: '0.875rem' }}>
            <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Box {index + 1}</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '130px minmax(0, 1fr)', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Icona o sigla</label>
                <input style={inputStyle} value={feature.icon} onChange={(event) => patchFeature(feature.id, { icon: event.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Titolo</label>
                <input style={inputStyle} value={feature.title} onChange={(event) => patchFeature(feature.id, { title: event.target.value })} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Testo</label>
              <textarea
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                value={feature.body}
                onChange={(event) => patchFeature(feature.id, { body: event.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
