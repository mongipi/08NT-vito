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
  vnr?: string | null
  order: number
}

export interface ProductImages {
  fronte?: string
  infografica?: string
  lato1?: string
  lato2?: string
  etichetta?: string
}

export interface ProductVariant {
  id: string
  label: string
  quantity: number
  price: number
  comparePrice?: number | null
  b2bPrice?: number | null
  stock: number
  order: number
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
  ingredientsText?: string | null
  nameEn?: string | null
  shortDescriptionEn?: string | null
  longDescriptionEn?: string | null
  usageEn?: string | null
  targetEn?: string | null
  formatEn?: string | null
  ingredientsTextEn?: string | null
  capsules?: number | null
  days?: number | null
  dosage?: string | null
  notificationMs?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  ingredients: Ingredient[]
  images: ProductImages
  variants: ProductVariant[]
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
  titleEn?: string | null
  excerptEn?: string | null
  bodyEn?: string | null
  createdAt: Date
  updatedAt: Date
}
