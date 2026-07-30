'use client'

import { useMemo, useState } from 'react'

export type ManagedLink = {
  id: string
  label: string
  href: string
  enabled: boolean
}

type Props = {
  name: string
  initialValue: string
  defaults: ManagedLink[]
  helperText: string
}

function normalizeLinks(raw: string, defaults: ManagedLink[]) {
  if (!raw.trim()) return defaults

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaults

    const links = parsed.map((link, index) => ({
      id: typeof link?.id === 'string' && link.id.trim() ? link.id.trim() : `link-${index + 1}`,
      label: typeof link?.label === 'string' ? link.label : '',
      href: typeof link?.href === 'string' ? link.href : '',
      enabled: link?.enabled !== false,
    }))

    return links.length > 0 ? links : defaults
  } catch {
    return defaults
  }
}

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 0.8rem',
  background: '#fff',
  color: '#111827',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
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

export function NavLinksEditor({ name, initialValue, defaults, helperText }: Props) {
  const [links, setLinks] = useState<ManagedLink[]>(() => normalizeLinks(initialValue, defaults))
  const serialized = useMemo(() => JSON.stringify(links), [links])

  function patchLink(id: string, patch: Partial<ManagedLink>) {
    setLinks((current) => current.map((link) => (link.id === id ? { ...link, ...patch } : link)))
  }

  function moveLink(id: string, direction: -1 | 1) {
    setLinks((current) => {
      const index = current.findIndex((item) => item.id === id)
      if (index === -1) return current
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const copy = [...current]
      const [item] = copy.splice(index, 1)
      copy.splice(nextIndex, 0, item)
      return copy
    })
  }

  function addLink() {
    setLinks((current) => [
      ...current,
      {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `link-${Date.now()}`,
        label: 'Nuovo link',
        href: '/',
        enabled: true,
      },
    ])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name={name} value={serialized} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '44rem' }}>{helperText}</p>
        <button type="button" onClick={addLink} style={{ ...buttonStyle, background: '#1a4a2e', color: '#fff', borderColor: '#1a4a2e' }}>
          Aggiungi link
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {links.map((link, index) => (
          <div key={link.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', background: '#fafafa', display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Link {index + 1}</strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => moveLink(link.id, -1)} style={buttonStyle} disabled={index === 0}>Su</button>
                <button type="button" onClick={() => moveLink(link.id, 1)} style={buttonStyle} disabled={index === links.length - 1}>Giu</button>
                <button
                  type="button"
                  onClick={() => setLinks((current) => current.filter((item) => item.id !== link.id))}
                  style={{ ...buttonStyle, color: '#b91c1c', borderColor: '#fecaca' }}
                  disabled={links.length === 1}
                >
                  Rimuovi
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr) auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={labelStyle}>Etichetta</label>
                <input style={inputStyle} value={link.label} onChange={(event) => patchLink(link.id, { label: event.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Percorso o URL</label>
                <input style={inputStyle} value={link.href} onChange={(event) => patchLink(link.id, { href: event.target.value })} />
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#111827', paddingBottom: '0.7rem' }}>
                <input type="checkbox" checked={link.enabled} onChange={(event) => patchLink(link.id, { enabled: event.target.checked })} />
                Attivo
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
