import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getArticleSlugs } from '@/services/articles'
import type { Metadata } from 'next'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return { title: article.title }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <main>
      {/* ── HEADER ── */}
      <div
        className="section"
        style={{
          background: 'var(--forest)',
          borderBottom: '1px solid var(--amber)',
          paddingBottom: 52,
        }}
      >
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2"
          style={{
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(184,144,60,0.6)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Blog
        </Link>

        <div
          style={{
            fontSize: 8.5,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--amber)',
            marginBottom: 12,
          }}
        >
          {article.tag}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 300,
            color: '#f0ede8',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            marginBottom: 16,
          }}
        >
          {article.title}
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 300,
            color: 'rgba(253,246,232,0.4)',
            letterSpacing: '0.04em',
          }}
        >
          {formatDate(article.publishedAt)} · {article.readingTime} min di lettura
        </div>
      </div>

      {/* ── BODY ── */}
      <section className="section">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 20,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--green)',
              lineHeight: 1.7,
              marginBottom: 32,
              borderLeft: '2px solid var(--amber)',
              paddingLeft: 20,
            }}
          >
            {article.excerpt}
          </p>

          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: 'var(--ink-2)',
              lineHeight: 2,
            }}
          >
            {article.body}
          </p>

          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '0.5px solid var(--border)' }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2"
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '11px 24px',
                background: 'none',
                color: 'var(--green)',
                border: '1px solid var(--green)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Tutti gli articoli
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
