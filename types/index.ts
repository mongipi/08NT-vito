export type LineSlug = string

export interface Line {
  id: string
  slug: LineSlug
  name: string
  color: string
  colorLight: string
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  dosage?: string | null
  order: number
}

export interface ProductImages {
  fronte?: string
  infografica?: string
  lato1?: string
  lato2?: string
  etichetta?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  line: Line
  price: number
  comparePrice?: number | null
  stock: number
  published: boolean
  order: number
  shortDescription: string
  longDescription: string
  usage?: string | null
  target?: string | null
  format?: string | null
  capsules?: number | null
  days?: number | null
  dosage?: string | null
  notificationMs?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  ingredients: Ingredient[]
  images: ProductImages
  createdAt: Date
  updatedAt: Date
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  tag: string
  publishedAt: Date | string
  readingTime?: number | null
  published: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  createdAt: Date
  updatedAt: Date
}
