import { getArticles } from '@/services/articles'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  const articles = await getArticles()
  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-montserrat)' }}>
      <p>🚧 Blog — {articles.length} articoli</p>
    </main>
  )
}
