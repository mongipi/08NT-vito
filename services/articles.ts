import { prisma } from '@/lib/prisma'
import { isPrismaInitError, logPrismaInitError } from '@/lib/prisma-errors'
import type { Article } from '@/types'
import type { Prisma } from '@prisma/client'

export async function getArticles(): Promise<Article[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    })
    return articles as Article[]
  } catch (error) {
    logPrismaInitError('articles:list', error)
    if (isPrismaInitError(error)) return []
    throw error
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const article = await prisma.article.findFirst({
      where: { slug, published: true },
    })
    return article as Article | null
  } catch (error) {
    logPrismaInitError('articles:by-slug', error)
    if (isPrismaInitError(error)) return null
    throw error
  }
}

/** Elenco articoli per l'area admin: include anche i non pubblicati. */
export async function getAdminArticles() {
  return prisma.article.findMany({ orderBy: { publishedAt: 'desc' } })
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({ where: { id } })
}

export async function createArticle(data: Prisma.ArticleCreateInput) {
  return prisma.article.create({ data })
}

export async function updateArticle(id: string, data: Prisma.ArticleUpdateInput) {
  return prisma.article.update({ where: { id }, data })
}

export async function deleteArticle(id: string): Promise<void> {
  await prisma.article.delete({ where: { id } })
}

export async function getArticleSlugs(): Promise<string[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true },
    })
    return articles.map((a) => a.slug)
  } catch (error) {
    logPrismaInitError('articles:slugs', error)
    if (isPrismaInitError(error)) return []
    throw error
  }
}
