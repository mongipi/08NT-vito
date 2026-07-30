export const dynamic = 'force-dynamic'

import { getArticles } from '@/services/articles'
import { getHomeHeroSlides } from '@/lib/home-hero'
import { HomeContent } from './HomeContent'

export default async function HomePage() {
  const [articles, heroSlides] = await Promise.all([getArticles(), getHomeHeroSlides()])

  return (
    <HomeContent
      heroSlides={heroSlides}
      articles={articles.map((article) => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        tag: article.tag,
        publishedAt: new Date(article.publishedAt).toISOString(),
        readingTime: article.readingTime,
        titleEn: article.titleEn,
        excerptEn: article.excerptEn,
      }))}
    />
  )
}
