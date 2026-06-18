import type { Line, LineSlug } from '@/types'

export const LINES: Record<LineSlug, Line> = {
  menopausa: {
    slug: 'menopausa',
    name: 'Linea Menopausa',
    color: '#c94478',
    colorLight: '#fdf0f5',
  },
  beauty: {
    slug: 'beauty',
    name: 'Linea Beauty',
    color: '#1a6b30',
    colorLight: '#eaf5ec',
  },
  circolo: {
    slug: 'circolo',
    name: 'Linea Circolo',
    color: '#405089',
    colorLight: '#eaecf5',
  },
  energia: {
    slug: 'energia',
    name: 'Linea Energia',
    color: '#a86010',
    colorLight: '#faeedd',
  },
}
