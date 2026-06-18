import { ARTICLES } from '@/lib/mock-data'
import type { Article } from '@/types'

/** Returns all published articles sorted by date descending. */
export async function getArticles(): Promise<Article[]> {
  return ARTICLES.filter((a) => a.published).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

/** Returns a single published article by slug, or null if not found. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return ARTICLES.find((a) => a.slug === slug && a.published) ?? null
}

/** Returns all published article slugs (used for generateStaticParams). */
export async function getArticleSlugs(): Promise<string[]> {
  return ARTICLES.filter((a) => a.published).map((a) => a.slug)
}
