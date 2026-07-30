import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'

export type HomeHeroSlide = {
  id: string
  src: string
  alt: string
  durationMs: number
  enabled: boolean
}

const DEFAULT_SLIDES: HomeHeroSlide[] = [
  {
    id: 'home-hero-default-08',
    src: '/v61/img/hero_home_bg.jpg',
    alt: '08 Natural Technology',
    durationMs: 30000,
    enabled: true,
  },
]

function clampDuration(durationMs: number, fallback: number) {
  if (!Number.isFinite(durationMs)) return fallback
  return Math.min(60000, Math.max(4000, Math.round(durationMs)))
}

function normalizeSlides(input: unknown) {
  if (!Array.isArray(input)) return DEFAULT_SLIDES

  const slides = input
    .map((slide, index): HomeHeroSlide | null => {
      const src = typeof slide?.src === 'string' ? slide.src.trim() : ''
      if (!src) return null

      return {
        id: typeof slide?.id === 'string' && slide.id.trim() ? slide.id.trim() : `home-hero-${index + 1}`,
        src,
        alt:
          typeof slide?.alt === 'string' && slide.alt.trim()
            ? slide.alt.trim()
            : `Slide hero home ${index + 1}`,
        durationMs: clampDuration(Number(slide?.durationMs ?? (index === 0 ? 30000 : 8000)), index === 0 ? 30000 : 8000),
        enabled: slide?.enabled !== false,
      }
    })
    .filter((slide): slide is HomeHeroSlide => Boolean(slide))
    .filter((slide) => slide.enabled)

  return slides.length > 0 ? slides : DEFAULT_SLIDES
}

export async function getHomeHeroSlides(): Promise<HomeHeroSlide[]> {
  try {
    const settings = await getSettingsMap()
    const raw = settings[SETTING_KEYS.HOME_HERO_CAROUSEL]
    if (!raw) return DEFAULT_SLIDES
    return normalizeSlides(JSON.parse(raw))
  } catch {
    return DEFAULT_SLIDES
  }
}

export function getDefaultHomeHeroSlides() {
  return DEFAULT_SLIDES
}
