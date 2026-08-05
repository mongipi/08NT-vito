'use client'

import { useRef, useState } from 'react'

const IMAGE_SLOTS = [
  { key: 'fronte',      label: 'Fronte' },
  { key: 'infografica', label: 'Infografica' },
  { key: 'lato1',       label: 'Lato 1' },
  { key: 'lato2',       label: 'Lato 2' },
  { key: 'etichetta',   label: 'Etichetta' },
] as const

const MAX_SIDE = 1800  // px — max dimensione lato più lungo
const QUALITY  = 0.88  // qualità JPEG/WebP output

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      let { width, height } = img
      if (width > MAX_SIDE || height > MAX_SIDE) {
        if (width > height) { height = Math.round(height * MAX_SIDE / width); width = MAX_SIDE }
        else                 { width  = Math.round(width  * MAX_SIDE / height); height = MAX_SIDE }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if (!blob) { resolve(file); return }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }))
      }, 'image/webp', QUALITY)
    }
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}

interface Props {
  images: Record<string, string>
}

export function ImageUploader({ images }: Props) {
  const [previews, setPreviews]   = useState<Record<string, string>>({})
  const [sizes, setSizes]         = useState<Record<string, string>>({})
  const [loading, setLoading]     = useState<Record<string, boolean>>({})
  const refs = useRef<Record<string, HTMLInputElement | null>>({})

  async function handleChange(key: string, file: File | undefined) {
    if (!file) return
    setLoading(l => ({ ...l, [key]: true }))
    try {
      const compressed = await compressImage(file)
      const url = URL.createObjectURL(compressed)
      const kb  = (compressed.size / 1024).toFixed(0)
      setPreviews(p => ({ ...p, [key]: url }))
      setSizes(s    => ({ ...s, [key]: `${kb} KB` }))

      // Sostituisce il file nell'input con quello compresso
      const dt = new DataTransfer()
      dt.items.add(compressed)
      const input = refs.current[key]
      if (input) input.files = dt.files
    } finally {
      setLoading(l => ({ ...l, [key]: false }))
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
      {IMAGE_SLOTS.map(({ key, label }) => {
        const preview = previews[key]
        const current = images[key]
        const shown   = preview ?? current
        const isLoading = loading[key]

        return (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>

            <button
              type="button"
              onClick={() => refs.current[key]?.click()}
              disabled={isLoading}
              style={{
                position: 'relative', width: '100%', aspectRatio: '1',
                borderRadius: 8, overflow: 'hidden',
                border: shown ? '1.5px solid #e5e7eb' : '1.5px dashed #d1d5db',
                background: shown ? '#fff' : '#f9fafb',
                cursor: isLoading ? 'wait' : 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isLoading ? (
                <span style={{ fontSize: 10, color: '#9ca3af' }}>Comprimo…</span>
              ) : shown ? (
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

              {shown && !isLoading && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.15s',
                }} className="img-overlay">
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>Cambia</span>
                </div>
              )}
            </button>

            {preview && !isLoading && (
              <span style={{ fontSize: 10, color: '#16a34a', textAlign: 'center' }}>
                ✓ Pronta {sizes[key] ? `· ${sizes[key]}` : ''}
              </span>
            )}

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
