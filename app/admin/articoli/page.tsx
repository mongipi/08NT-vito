import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'
import { Badge } from '../_components/Badge'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Articoli' }

const th: React.CSSProperties = { padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.6875rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9' }

export default async function ArticoliPage() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <div>
      <PageHeader title="Articoli" description={`${articles.length} articoli`} action={{ label: 'Nuovo articolo', href: '/admin/articoli/nuovo' }} />
      <div style={{ background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '36rem' }}>
            <thead>
              <tr>{['Titolo', 'Tag', 'Lettura', 'Data', 'Stato', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}>
                  Nessun articolo. <Link href="/admin/articoli/nuovo" style={{ color: '#1a4a2e' }}>Creane uno</Link>
                </td></tr>
              )}
              {articles.map((a) => (
                <tr key={a.id}>
                  <td style={td}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>{a.title}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.0625rem' }}>{a.slug}</div>
                  </td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '0.25rem', background: '#fffbeb', color: '#92400e', fontSize: '0.6875rem', fontWeight: 500, padding: '0.125rem 0.5rem' }}>{a.tag}</span>
                  </td>
                  <td style={{ ...td, color: '#9ca3af' }}>{a.readingTime ?? '—'} min</td>
                  <td style={{ ...td, color: '#9ca3af' }}>{formatDate(a.publishedAt)}</td>
                  <td style={td}><Badge value={a.published ? 'active' : 'inactive'} /></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <Link href={`/admin/articoli/${a.id}`} style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e', textDecoration: 'none' }}>Modifica</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
