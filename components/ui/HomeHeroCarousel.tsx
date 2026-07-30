'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import type { HomeHeroSlide } from '@/lib/home-hero'

interface Props {
  slides: HomeHeroSlide[]
}

export function HomeHeroCarousel({ slides }: Props) {
  const activeSlides = useMemo(
    () => slides.filter((slide) => slide.enabled !== false && slide.src.trim()),
    [slides]
  )
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [activeSlides.length])

  useEffect(() => {
    if (activeSlides.length <= 1) return
    const current = activeSlides[active] ?? activeSlides[0]
    const timer = window.setTimeout(() => {
      setActive((index) => (index + 1) % activeSlides.length)
    }, current?.durationMs ?? 8000)

    return () => window.clearTimeout(timer)
  }, [active, activeSlides])

  if (activeSlides.length === 0) return null

  const prev = () => setActive((index) => (index - 1 + activeSlides.length) % activeSlides.length)
  const next = () => setActive((index) => (index + 1) % activeSlides.length)

  return (
    <>
      <div className="v61-hero-carousel" aria-label="Carousel immagini hero">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`v61-hero-carousel-slide ${index === active ? 'active' : ''}`}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              unoptimized
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {activeSlides.length > 1 && (
        <div className="v61-hero-carousel-controls" aria-label="Controlli carousel hero">
          <button type="button" className="v61-hero-carousel-arrow prev" onClick={prev} aria-label="Immagine precedente">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="v61-hero-carousel-dots">
            {activeSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === active ? 'active' : ''}
                onClick={() => setActive(index)}
                aria-label={`Vai alla slide ${index + 1}`}
              />
            ))}
          </div>
          <button type="button" className="v61-hero-carousel-arrow next" onClick={next} aria-label="Immagine successiva">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
