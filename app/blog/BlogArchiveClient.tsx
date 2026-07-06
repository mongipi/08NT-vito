'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cn, formatDate } from '@/lib/utils'

export interface BlogArchiveArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  tag: string
  publishedAt: string
  readingTime?: number | null
}

interface BlogSection {
  title: string
  body: string
  articles: BlogArchiveArticle[]
}

interface Props {
  sections: BlogSection[]
  articles: BlogArchiveArticle[]
}

export function BlogArchiveClient({ sections, articles }: Props) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const matches = useMemo(() => {
    if (!normalizedQuery) return []
    return articles.filter((article) => {
      const haystack = `${article.title} ${article.excerpt} ${article.body} ${article.tag}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [articles, normalizedQuery])

  const visibleSections = normalizedQuery
    ? [{ title: `Risultati per "${query.trim()}"`, body: matches.length ? 'Articoli suggeriti in base al tema cercato.' : 'Nessun articolo trovato per questa ricerca.', articles: matches }]
    : sections

  return (
    <>
      <section className="section v61-blog-search-section">
        <div className="v61-inner v61-blog-search">
          <div>
            <div className="v61-eyebrow">Ricerca articoli</div>
            <h2 className="v61-title">Trova il tema<br /><em>che ti interessa.</em></h2>
          </div>
          <label className="v61-blog-search-field">
            <span>Cerca nel blog</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Es. diosmina, menopausa, microcircolo..."
            />
          </label>
        </div>
      </section>

      {visibleSections.map((section) => (
        <ArticleSection key={section.title} title={section.title} body={section.body} articles={section.articles} />
      ))}
    </>
  )
}

function ArticleSection({ title, body, articles }: BlogSection) {
  if (articles.length === 0) {
    return (
      <section className="section v61-blog-archive-section">
        <div className="v61-inner">
          <div className="v61-blog-section-head">
            <div className="v61-eyebrow">Blog 08</div>
            <h2 className="v61-title">{title}</h2>
            <p>{body}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section v61-blog-archive-section">
      <div className="v61-inner">
        <div className="v61-blog-section-head">
          <div className="v61-eyebrow">Blog 08</div>
          <h2 className="v61-title">{title}</h2>
          <p>{body}</p>
        </div>
        <div className="v61-blog-grid">
          {articles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogCard({ article }: { article: BlogArchiveArticle }) {
  const [open, setOpen] = useState(false)

  return (
    <article className={cn('v61-blog-card', open && 'open')}>
      <button type="button" className="v61-blog-card-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <h3>{article.title}</h3>
        <span aria-hidden="true">{open ? '-' : '+'}</span>
      </button>
      <div className="v61-blog-card-detail">
        <span className="cat">{article.tag}</span>
        <p>{article.excerpt}</p>
        <span className="date">{formatDate(article.publishedAt)} · {article.readingTime ?? 5} min di lettura</span>
        <Link href={`/blog/${article.slug}`}>Leggi articolo</Link>
      </div>
    </article>
  )
}
