'use client'

import { useMemo, useState } from 'react'
import type { ManagedLink } from './_NavLinksEditor'

export type ManagedFooterSection = {
  id: string
  title: string
  links: ManagedLink[]
}

type Props = {
  name: string
  initialValue: string
  defaults: ManagedFooterSection[]
}

function normalizeSections(raw: string, defaults: ManagedFooterSection[]) {
  if (!raw.trim()) return defaults

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return defaults

    const sections = parsed.map((section, sectionIndex) => ({
      id: typeof section?.id === 'string' && section.id.trim() ? section.id.trim() : `section-${sectionIndex + 1}`,
      title: typeof section?.title === 'string' ? section.title : '',
      links: Array.isArray(section?.links)
        ? section.links.map((link: unknown, linkIndex: number) => ({
            id: typeof (link as { id?: string })?.id === 'string' && (link as { id: string }).id.trim()
              ? (link as { id: string }).id.trim()
              : `link-${sectionIndex + 1}-${linkIndex + 1}`,
            label: typeof (link as { label?: string })?.label === 'string' ? (link as { label: string }).label : '',
            href: typeof (link as { href?: string })?.href === 'string' ? (link as { href: string }).href : '',
            enabled: (link as { enabled?: boolean })?.enabled !== false,
          }))
        : [],
    }))

    return sections.length > 0 ? sections : defaults
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

export function FooterSectionsEditor({ name, initialValue, defaults }: Props) {
  const [sections, setSections] = useState<ManagedFooterSection[]>(() => normalizeSections(initialValue, defaults))
  const serialized = useMemo(() => JSON.stringify(sections), [sections])

  function patchSection(id: string, patch: Partial<ManagedFooterSection>) {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)))
  }

  function patchLink(sectionId: string, linkId: string, patch: Partial<ManagedLink>) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map((link) => (link.id === linkId ? { ...link, ...patch } : link)),
            }
          : section
      )
    )
  }

  function addLink(sectionId: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              links: [
                ...section.links,
                {
                  id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `link-${Date.now()}`,
                  label: 'Nuovo link',
                  href: '/',
                  enabled: true,
                },
              ],
            }
          : section
      )
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name={name} value={serialized} />
      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '44rem' }}>
        Gestisci le colonne link del footer. Puoi cambiare titolo, etichette e percorsi senza toccare il codice.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {sections.map((section, sectionIndex) => (
          <div key={section.id} style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', background: '#fafafa', display: 'grid', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Titolo colonna {sectionIndex + 1}</label>
              <input style={inputStyle} value={section.title} onChange={(event) => patchSection(section.id, { title: event.target.value })} />
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {section.links.map((link, linkIndex) => (
                <div key={link.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr) auto auto', gap: '0.75rem', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>Etichetta {linkIndex + 1}</label>
                    <input style={inputStyle} value={link.label} onChange={(event) => patchLink(section.id, link.id, { label: event.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Percorso o URL</label>
                    <input style={inputStyle} value={link.href} onChange={(event) => patchLink(section.id, link.id, { href: event.target.value })} />
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#111827', paddingBottom: '0.7rem' }}>
                    <input type="checkbox" checked={link.enabled} onChange={(event) => patchLink(section.id, link.id, { enabled: event.target.checked })} />
                    Attivo
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSections((current) =>
                        current.map((item) =>
                          item.id === section.id
                            ? { ...item, links: item.links.filter((entry) => entry.id !== link.id) }
                            : item
                        )
                      )
                    }
                    style={{ ...buttonStyle, color: '#b91c1c', borderColor: '#fecaca' }}
                    disabled={section.links.length === 1}
                  >
                    Rimuovi
                  </button>
                </div>
              ))}
            </div>

            <div>
              <button type="button" onClick={() => addLink(section.id)} style={buttonStyle}>
                Aggiungi link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
