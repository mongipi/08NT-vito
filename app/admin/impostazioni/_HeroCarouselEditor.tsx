'use client'

import { useMemo, useRef, useState } from 'react'
import type { HomeHeroSlide } from '@/lib/home-hero'
import { getDefaultHomeHeroSlides } from '@/lib/home-hero'
import { SETTING_KEYS } from '@/lib/settings'

type Props = {
  initialValue: string
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

const secondaryButton: React.CSSProperties = {
  padding: '0.5rem 0.8rem',
  background: '#fff',
  color: '#111827',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
}

const MAX_SIDE = 2200
const QUALITY = 0.9

function normalizeSlides(raw: string): HomeHeroSlide[] {
  const fallback = getDefaultHomeHeroSlides()
  if (!raw.trim()) return fallback

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback

    const normalized = parsed
      .map((slide, index) => ({
        id: typeof slide?.id === 'string' && slide.id.trim() ? slide.id.trim() : `hero-slide-${index + 1}`,
        src: typeof slide?.src === 'string' ? slide.src : '',
        alt: typeof slide?.alt === 'string' ? slide.alt : `Slide hero ${index + 1}`,
        durationMs: Number.isFinite(Number(slide?.durationMs))
          ? Number(slide.durationMs)
          : index === 0
            ? 30000
            : 8000,
        enabled: slide?.enabled !== false,
      }))
      .filter((slide) => slide.src.trim())

    return normalized.length > 0 ? normalized : fallback
  } catch {
    return fallback
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()

    img.onload = () => {
      let { width, height } = img
      if (width > MAX_SIDE || height > MAX_SIDE) {
        if (width > height) {
          height = Math.round((height * MAX_SIDE) / width)
          width = MAX_SIDE
        } else {
          width = Math.round((width * MAX_SIDE) / height)
          height = MAX_SIDE
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas non disponibile'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compressione non riuscita'))
            return
          }

          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result || ''))
          reader.onerror = () => reject(new Error('Lettura file non riuscita'))
          reader.readAsDataURL(blob)
        },
        'image/webp',
        QUALITY
      )
    }

    img.onerror = () => reject(new Error('Immagine non valida'))
    img.src = URL.createObjectURL(file)
  })
}

export function HeroCarouselEditor({ initialValue }: Props) {
  const [slides, setSlides] = useState<HomeHeroSlide[]>(() => normalizeSlides(initialValue))
  const [busyId, setBusyId] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const serialized = useMemo(() => JSON.stringify(slides), [slides])

  function patchSlide(id: string, patch: Partial<HomeHeroSlide>) {
    setSlides((current) => current.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide)))
  }

  function moveSlide(id: string, direction: -1 | 1) {
    setSlides((current) => {
      const index = current.findIndex((slide) => slide.id === id)
      if (index === -1) return current
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current

      const copy = [...current]
      const [item] = copy.splice(index, 1)
      copy.splice(nextIndex, 0, item)
      return copy
    })
  }

  function addSlide() {
    setSlides((current) => [
      ...current,
      {
        id:
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `hero-slide-${Date.now()}`,
        src: '/v61/img/hero_home_bg.jpg',
        alt: `Nuova slide hero ${current.length + 1}`,
        durationMs: 8000,
        enabled: true,
      },
    ])
  }

  async function replaceImage(id: string, file?: File) {
    if (!file) return
    setBusyId(id)
    try {
      const src = await fileToDataUrl(file)
      patchSlide(id, { src })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name={SETTING_KEYS.HOME_HERO_CAROUSEL} value={serialized} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '44rem' }}>
          Gestisci le immagini del hero in home. La prima slide resta quella principale e puo durare piu a lungo. Le frecce e i pallini compaiono automaticamente quando ci sono almeno 2 immagini attive.
        </p>
        <button
          type="button"
          onClick={addSlide}
          style={{
            padding: '0.625rem 1rem',
            background: '#1a4a2e',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Aggiungi slide
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1rem',
              background: '#fafafa',
              display: 'grid',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#111827' }}>Slide {index + 1}</strong>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {index === 0 ? 'Slide principale consigliata per la home.' : 'Slide secondaria del carousel.'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => moveSlide(slide.id, -1)} style={secondaryButton} disabled={index === 0}>
                  Su
                </button>
                <button type="button" onClick={() => moveSlide(slide.id, 1)} style={secondaryButton} disabled={index === slides.length - 1}>
                  Giu
                </button>
                <button
                  type="button"
                  onClick={() => setSlides((current) => current.filter((item) => item.id !== slide.id))}
                  style={{ ...secondaryButton, color: '#b91c1c', borderColor: '#fecaca' }}
                  disabled={slides.length === 1}
                >
                  Rimuovi
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 320px) minmax(0, 1fr)', gap: '1rem', alignItems: 'start' }}>
              <div>
                <button
                  type="button"
                  onClick={() => inputRefs.current[slide.id]?.click()}
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 10',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    background: '#fff',
                    padding: 0,
                    cursor: busyId === slide.id ? 'wait' : 'pointer',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.src} alt={slide.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </button>
                <input
                  ref={(node) => {
                    inputRefs.current[slide.id] = node
                  }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                  onChange={(event) => replaceImage(slide.id, event.target.files?.[0])}
                />
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                  {busyId === slide.id ? 'Sto ottimizzando l immagine...' : 'Clicca sull anteprima per sostituire l immagine.'}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '0.875rem' }}>
                <div>
                  <label style={labelStyle}>Testo alternativo</label>
                  <input
                    style={inputStyle}
                    value={slide.alt}
                    onChange={(event) => patchSlide(slide.id, { alt: event.target.value })}
                    placeholder="Esempio: Logo 08 su mano"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 220px) auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>Durata visibile (secondi)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      min="4"
                      max="60"
                      step="1"
                      value={Math.round(slide.durationMs / 1000)}
                      onChange={(event) =>
                        patchSlide(slide.id, {
                          durationMs: Math.min(60000, Math.max(4000, Number(event.target.value || 8) * 1000)),
                        })
                      }
                    />
                  </div>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#111827' }}>
                    <input
                      type="checkbox"
                      checked={slide.enabled}
                      onChange={(event) => patchSlide(slide.id, { enabled: event.target.checked })}
                    />
                    Slide attiva
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
