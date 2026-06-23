import { prisma } from '@/lib/prisma'
import type { Article } from '@/types'

export async function getArticles(): Promise<Article[]> {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  }) as Promise<Article[]>
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return prisma.article.findFirst({
    where: { slug, published: true },
  }) as Promise<Article | null>
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return articles.map((a) => a.slug)
}
