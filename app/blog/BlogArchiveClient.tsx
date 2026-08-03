'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { cn, formatDate } from '@/lib/utils'
import { useLocale, pickLocalized } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'
import { PageHeader } from '@/components/ui/PageHeader'

export interface BlogArchiveArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  tag: string
  publishedAt: string
  readingTime?: number | null
  titleEn?: string | null
  excerptEn?: string | null
  bodyEn?: string | null
}

interface BlogSection {
  title: string
  body: string
  articles: BlogArchiveArticle[]
}

export function BlogArchiveClient({ articles }: { articles: BlogArchiveArticle[] }) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const sections = useMemo<BlogSection[]>(() => {
    const dossierMatches = articles.filter((article) =>
      ['Dossier formula', 'Beauty nutrition', 'Benessere donna', 'Microcircolo'].includes(
        article.tag
      )
    )
    const featured = dossierMatches.length ? dossierMatches : articles.slice(0, 4)
    const principles = articles.filter(
      (article) => article.tag === 'Principio attivo' && !featured.includes(article)
    )
    const quality = articles.filter(
      (article) => article.tag === 'Qualità ingredienti' && !featured.includes(article)
    )
    const other = articles.filter(
      (article) =>
        !featured.includes(article) && !principles.includes(article) && !quality.includes(article)
    )
    return [
      {
        title: t('blog_section_dossier_title'),
        body: t('blog_section_dossier_body'),
        articles: featured,
      },
      ...(principles.length > 0
        ? [
            {
              title: t('blog_section_principles_title'),
              body: t('blog_section_principles_body'),
              articles: principles,
            },
          ]
        : []),
      ...(quality.length > 0
        ? [
            {
              title: t('blog_section_quality_title'),
              body: t('blog_section_quality_body'),
              articles: quality,
            },
          ]
        : []),
      ...(other.length > 0
        ? [
            {
              title: t('blog_section_other_title'),
              body: t('blog_section_other_body'),
              articles: other,
            },
          ]
        : []),
    ]
  }, [articles, t])

  const matches = useMemo(() => {
    if (!normalizedQuery) return []
    return articles.filter((article) => {
      const haystack =
        `${article.title} ${article.excerpt} ${article.body} ${article.tag}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [articles, normalizedQuery])

  const visibleSections = normalizedQuery
    ? [
        {
          title: t('blog_results_for', { query: query.trim() }),
          body: matches.length ? t('blog_results_suggested') : t('blog_results_none'),
          articles: matches,
        },
      ]
    : sections

  return (
    <>
      <PageHeader eyebrow={t('blog_eyebrow')} title={<em>{t('blog_title_2')}</em>} />

      <section className="section v61-blog-search-section">
        <div className="v61-inner v61-blog-search">
          <div>
            <div className="v61-eyebrow">{t('blog_search_eyebrow')}</div>
            <h2 className="v61-title">{richText(t('blog_search_title'))}</h2>
          </div>
          <label className="v61-blog-search-field">
            <span>{t('blog_search_field_label')}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('blog_search_placeholder')}
            />
          </label>
        </div>
      </section>

      {visibleSections.map((section) => (
        <ArticleSection
          key={section.title}
          title={section.title}
          body={section.body}
          articles={section.articles}
          sectionEyebrow={t('blog_section_eyebrow')}
          readArticleLabel={t('blog_read_article')}
          readingTimeLabel={t('blog_reading_time')}
        />
      ))}
    </>
  )
}

function ArticleSection({
  title,
  body,
  articles,
  sectionEyebrow,
  readArticleLabel,
  readingTimeLabel,
}: BlogSection & { sectionEyebrow: string; readArticleLabel: string; readingTimeLabel: string }) {
  if (articles.length === 0) {
    return (
      <section className="section v61-blog-archive-section">
        <div className="v61-inner">
          <div className="v61-blog-section-head">
            <div className="v61-eyebrow">{sectionEyebrow}</div>
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
          <div className="v61-eyebrow">{sectionEyebrow}</div>
          <h2 className="v61-title">{title}</h2>
          <p>{body}</p>
        </div>
        <div className="v61-blog-grid">
          {articles.map((article) => (
            <BlogCard
              key={article.id}
              article={article}
              readArticleLabel={readArticleLabel}
              readingTimeLabel={readingTimeLabel}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogCard({
  article,
  readArticleLabel,
  readingTimeLabel,
}: {
  article: BlogArchiveArticle
  readArticleLabel: string
  readingTimeLabel: string
}) {
  const [open, setOpen] = useState(false)
  const { locale } = useLocale()

  return (
    <article className={cn('v61-blog-card', open && 'open')}>
      <button
        type="button"
        className="v61-blog-card-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <h3>{pickLocalized(locale, article.title, article.titleEn)}</h3>
        <span aria-hidden="true">{open ? '-' : '+'}</span>
      </button>
      <div className="v61-blog-card-detail">
        <span className="cat">{article.tag}</span>
        <p>{pickLocalized(locale, article.excerpt, article.excerptEn)}</p>
        <span className="date">
          {formatDate(article.publishedAt)} · {article.readingTime ?? 5} {readingTimeLabel}
        </span>
        <Link href={`/blog/${article.slug}`}>{readArticleLabel}</Link>
      </div>
    </article>
  )
}
