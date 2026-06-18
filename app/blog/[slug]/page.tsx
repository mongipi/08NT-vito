import { notFound } from 'next/navigation'
import { getArticleBySlug, getArticleSlugs } from '@/services/articles'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return { title: article.title }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-montserrat)' }}>
      <p>🚧 Articolo — {article.title}</p>
    </main>
  )
}
