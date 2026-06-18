export type LineSlug = 'menopausa' | 'beauty' | 'circolo' | 'energia'

export interface Line {
  slug: LineSlug
  name: string
  color: string
  colorLight: string
}

export interface Ingredient {
  name: string
  dosage?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  line: Line
  shortDescription: string
  longDescription: string
  ingredients: Ingredient[]
  usage: string
  target: string
  format: string
  capsules: number
  days: number
  dosage: string
  minAge?: number
  notificationMs?: string
  published: boolean
  order: number
  imageUrl?: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  tag: string
  publishedAt: string
  readingTime: number
  published: boolean
}
