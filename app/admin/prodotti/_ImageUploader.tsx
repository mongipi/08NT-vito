'use client'

import { useRef, useState } from 'react'

const IMAGE_SLOTS = [
  { key: 'fronte',      label: 'Fronte' },
  { key: 'infografica', label: 'Infografica' },
  { key: 'lato1',       label: 'Lato 1' },
  { key: 'lato2',       label: 'Lato 2' },
  { key: 'etichetta',   label: 'Etichetta' },
] as const

interface Props {
  images: Record<string, string>
}

export function ImageUploader({ images }: Props) {
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const refs = useRef<Record<string, HTMLInputElement | null>>({})

  function handleChange(key: string, file: File | undefined) {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviews(p => ({ ...p, [key]: url }))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
      {IMAGE_SLOTS.map(({ key, label }) => {
        const preview = previews[key]
        const current = images[key]
        const shown = preview ?? current

        return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>

            {/* Image area — click to upload */}
            <button
              type="button"
              onClick={() => refs.current[key]?.click()}
              style={{
                position: 'relative', width: '100%', aspectRatio: '1',
                borderRadius: 8, overflow: 'hidden',
                border: shown ? '1.5px solid #e5e7eb' : '1.5px dashed #d1d5db',
                background: shown ? '#fff' : '#f9fafb',
                cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {shown ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={shown} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>Aggiungi</span>
                </div>
              )}

              {/* Overlay on hover when image present */}
              {shown && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.15s',
                }}
                  className="img-overlay"
                >
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>Cambia</span>
                </div>
              )}
            </button>

            {preview && (
              <span style={{ fontSize: 10, color: '#16a34a', textAlign: 'center' }}>✓ Pronta</span>
            )}

            {/* Hidden file input */}
            <input
              ref={el => { refs.current[key] = el }}
              type="file"
              name={`img_${key}`}
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={e => handleChange(key, e.target.files?.[0])}
            />
          </div>
        )
      })}

      <style>{`
        button:hover .img-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
