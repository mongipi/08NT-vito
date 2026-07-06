export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getArticles } from '@/services/articles'
import type { Article } from '@/types'
import { BlogArchiveClient, type BlogArchiveArticle } from './BlogArchiveClient'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <main>
      <BlogArchiveClient articles={articles.map(serializeArticle)} />
    </main>
  )
}

function serializeArticle(article: Article): BlogArchiveArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    tag: article.tag,
    publishedAt: new Date(article.publishedAt).toISOString(),
    readingTime: article.readingTime,
    titleEn: article.titleEn,
    excerptEn: article.excerptEn,
    bodyEn: article.bodyEn,
  }
}
