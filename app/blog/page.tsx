export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticles } from '@/services/articles'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <main>
      <PageHeader
        eyebrow="Scienza, nutrizione, benessere"
        script="Approfondimenti"
        title="Blog."
      />

      <section className="section">
        <div className="flex flex-col border border-[var(--border-2)]">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="grid grid-cols-[100px_1fr] transition-colors duration-200 hover:bg-[var(--green-ll)] sm:grid-cols-[170px_1fr]"
              style={{
                borderBottom: i < articles.length - 1 ? '1px solid var(--border-2)' : undefined,
              }}
            >
              {/* Icon column */}
              <div
                className="flex items-center justify-center border-r border-[var(--border-2)]"
                style={{ minHeight: i === 0 ? 110 : 90, background: 'var(--paper-2)' }}
              >
                <ArticleTagIcon tag={article.tag} size={i === 0 ? 38 : 30} />
              </div>

              {/* Text column */}
              <div style={{ padding: i === 0 ? '28px 32px' : '24px 32px' }}>
                <span
                  style={{
                    fontSize: 8.5,
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--amber)',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  {article.tag}
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontSize: i === 0 ? 24 : 20,
                    fontWeight: 400,
                    color: 'var(--ink)',
                    lineHeight: 1.4,
                  }}
                >
                  {article.title}
                </div>
                <div
                  style={{ fontSize: 10, fontWeight: 300, color: 'var(--ink-4)', marginTop: 10 }}
                >
                  {formatDate(article.publishedAt)} · {article.readingTime} min di lettura
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

function ArticleTagIcon({ tag, size }: { tag: string; size: number }) {
  const s = 'var(--ink-4)'
  if (tag === 'Nutrizione') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a7 7 0 0 0-7 7c0 4.5 7 13 7 13s7-8.5 7-13a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="9" r="2" />
      </svg>
    )
  }
  if (tag === 'Benessere') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6M9 3v8L5 21h14L15 11V3" />
      <path d="M5 16h14" />
    </svg>
  )
}
