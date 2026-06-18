import { notFound } from 'next/navigation'
import { getProductBySlug, getProductSlugs } from '@/services/products'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return { title: product.name }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-montserrat)' }}>
      <p>🚧 Scheda prodotto — {product.name}</p>
    </main>
  )
}
