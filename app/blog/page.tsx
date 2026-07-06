export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getArticles } from '@/services/articles'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Article } from '@/types'
import { BlogArchiveClient, type BlogArchiveArticle } from './BlogArchiveClient'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  const articles = await getArticles()
  const dossierMatches = articles.filter((article) => ['Dossier formula', 'Beauty nutrition', 'Benessere donna', 'Microcircolo'].includes(article.tag))
  const featured = dossierMatches.length ? dossierMatches : articles.slice(0, 4)
  const principles = articles.filter((article) => article.tag === 'Principio attivo' && !featured.includes(article))
  const quality = articles.filter((article) => article.tag === 'Qualità ingredienti' && !featured.includes(article))
  const other = articles.filter((article) => !featured.includes(article) && !principles.includes(article) && !quality.includes(article))
  const sections = [
    { title: 'Dossier prodotto', body: 'I post completi dedicati alle formule 08 Natural Technology.', articles: featured },
    ...(principles.length > 0 ? [{ title: 'Principi attivi, ingredienti e funzioni', body: 'Post separati dedicati ai singoli attivi: cosa sono, quale ingrediente viene usato e quale funzione svolgono nella formula.', articles: principles }] : []),
    ...(quality.length > 0 ? [{ title: 'Qualità ingredienti: confronti utili', body: 'Post separati che spiegano la differenza tra un ingrediente tecnico e la rispettiva alternativa generica.', articles: quality }] : []),
    ...(other.length > 0 ? [{ title: 'Approfondimenti già presenti', body: 'Articoli mantenuti nell’archivio blog.', articles: other }] : []),
  ].map((section) => ({ ...section, articles: section.articles.map(serializeArticle) }))

  return (
    <main>
      <PageHeader
        eyebrow="Scienza, nutrizione, benessere"
        script="Approfondimenti"
        title={<><span>Approfondimenti</span><br /><em>Blog.</em></>}
      />

      <BlogArchiveClient sections={sections} articles={articles.map(serializeArticle)} />
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
  }
}
