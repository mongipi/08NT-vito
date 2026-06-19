'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Slide {
  src: string
  alt: string
  label: string
}

interface Props {
  slides: Slide[]
  color: string
  /** contained=true: inside hero column, transparent bg, fills parent height */
  contained?: boolean
}

export function ProductGallery({ slides, color, contained = false }: Props) {
  const [active, setActive] = useState(0)

  if (slides.length === 0) return null

  const prev = () => setActive((i) => (i - 1 + slides.length) % slides.length)
  const next = () => setActive((i) => (i + 1) % slides.length)

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: contained ? 1 : undefined,
        ...(contained ? {} : {
          background: 'var(--paper-2)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }),
      }}
    >
      {/* Slide viewport */}
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            transform: `translateX(-${active * 100}%)`,
            transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.src}
              style={{
                minWidth: '100%',
                height: contained ? 'clamp(320px, 45vw, 560px)' : 'clamp(300px, 50vw, 580px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: contained ? '2.25rem 2.5rem' : '2rem 5rem',
                background: contained
                  ? 'transparent'
                  : (i % 2 === 0 ? 'var(--paper-2)' : '#f0f0ec'),
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: contained ? 260 : 760,
                  height: '100%',
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  style={{
                    objectFit: 'contain',
                    filter: contained && i === 0
                      ? 'drop-shadow(0 24px 48px rgba(0,0,0,0.10)) drop-shadow(0 6px 12px rgba(0,0,0,0.07))'
                      : undefined,
                  }}
                  sizes={contained
                    ? '(max-width: 1024px) 70vw, 30vw'
                    : '(max-width: 640px) 100vw, 80vw'
                  }
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev arrow */}
      {slides.length > 1 && (
        <button
          onClick={prev}
          aria-label="Immagine precedente"
          style={{
            position: 'absolute',
            top: '50%',
            left: '0.75rem',
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `0.5px solid ${color}30`,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            zIndex: 2,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {slides.length > 1 && (
        <button
          onClick={next}
          aria-label="Immagine successiva"
          style={{
            position: 'absolute',
            top: '50%',
            right: '0.75rem',
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `0.5px solid ${color}30`,
            background: 'rgba(255,255,255,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            zIndex: 2,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Bottom bar: label + dots + counter */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '0.625rem 1rem',
          borderTop: `0.5px solid ${color}18`,
          background: contained ? 'rgba(255,255,255,0.7)' : '#fff',
          backdropFilter: contained ? 'blur(8px)' : undefined,
          minHeight: 40,
        }}
      >
        <span
          style={{
            fontSize: '0.53rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: `${color}70`,
          }}
        >
          {slides[active].label}
        </span>

        <div className="flex items-center gap-3">
          {slides.length > 1 && (
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Vai alla slide ${i + 1}`}
                  style={{
                    width: i === active ? 16 : 5,
                    height: 5,
                    borderRadius: 3,
                    background: i === active ? color : `${color}30`,
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              ))}
            </div>
          )}
          <span
            style={{
              fontSize: '0.53rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: `${color}45`,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {active + 1} / {slides.length}
          </span>
        </div>
      </div>
    </div>
  )
}
