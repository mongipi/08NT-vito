'use client'

import { useMemo, useState } from 'react'
import type { ManagedProductPageKicker } from '@/lib/site-settings'

type Props = {
  name: string
  initialValue: string
  defaults: ManagedProductPageKicker[]
}

function normalizeItems(raw: string, defaults: ManagedProductPageKicker[]) {
  if (!raw.trim()) return defaults

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaults

    const items = parsed
      .map((item) => ({
        slug: typeof item?.slug === 'string' ? item.slug.trim() : '',
        label: typeof item?.label === 'string' ? item.label.trim() : '',
        enabled: item?.enabled !== false,
      }))
      .filter((item) => item.slug)

    return items.length > 0 ? items : defaults
  } catch {
    return defaults
  }
}

export function ProductPageKickersEditor({ name, initialValue, defaults }: Props) {
  const [items, setItems] = useState<ManagedProductPageKicker[]>(() =>
    normalizeItems(initialValue, defaults)
  )

  const serialized = useMemo(() => JSON.stringify(items), [items])

  return (
    <div style={{ display: 'grid', gap: '0.875rem' }}>
      <input type="hidden" name={name} value={serialized} />
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6 }}>
        Gestisci il sottotitolo breve mostrato accanto alle immagini nelle singole pagine prodotto.
      </p>
      {items.map((item, index) => (
        <div
          key={`${item.slug}-${index}`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.6fr) auto',
            gap: '0.75rem',
            alignItems: 'end',
            padding: '0.875rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            background: '#fafafa',
          }}
        >
          <Field
            label="Slug prodotto"
            value={item.slug}
            onChange={(next) =>
              setItems((current) =>
                current.map((entry, i) => (i === index ? { ...entry, slug: next } : entry))
              )
            }
          />
          <Field
            label="Kicker"
            value={item.label}
            onChange={(next) =>
              setItems((current) =>
                current.map((entry, i) => (i === index ? { ...entry, label: next } : entry))
              )
            }
          />
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: '#374151',
              whiteSpace: 'nowrap',
              paddingBottom: '0.5rem',
            }}
          >
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(event) =>
                setItems((current) =>
                  current.map((entry, i) =>
                    i === index ? { ...entry, enabled: event.target.checked } : entry
                  )
                )
              }
            />
            Attivo
          </label>
        </div>
      ))}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'grid', gap: '0.375rem' }}>
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: '#6b7280',
        }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          border: '1px solid #d1d5db',
          padding: '0.625rem 0.875rem',
          fontSize: '0.875rem',
          color: '#111827',
          outline: 'none',
          borderRadius: '0.375rem',
          fontFamily: 'inherit',
          background: 'white',
        }}
      />
    </label>
  )
}
