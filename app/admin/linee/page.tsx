import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'

export const metadata = { title: 'Linee prodotto' }

const th: React.CSSProperties = { padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9' }

export default async function LineePage() {
  const lines = await prisma.line.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div>
      <PageHeader title="Linee prodotto" description={`${lines.length} linee`} action={{ label: 'Nuova linea', href: '/admin/linee/nuovo' }} />

      <div style={{ background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '28rem' }}>
            <thead>
              <tr>{['Colore', 'Nome', 'Slug', 'Prodotti', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {lines.length === 0 && (
                <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}>
                  Nessuna linea. <Link href="/admin/linee/nuovo" style={{ color: '#1a4a2e' }}>Creane una</Link>
                </td></tr>
              )}
              {lines.map((l) => (
                <tr key={l.id}>
                  <td style={{ ...td, width: '3.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem', background: l.color, flexShrink: 0 }} />
                      <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem', background: l.colorLight, border: '1px solid #e5e7eb', flexShrink: 0 }} />
                    </div>
                  </td>
                  <td style={{ ...td, fontWeight: 500, color: '#111827' }}>{l.name}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280' }}>{l.slug}</td>
                  <td style={td}>{l._count.products} prodotti</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <Link href={`/admin/linee/${l.id}`} style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e', textDecoration: 'none' }}>Modifica</Link>
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
