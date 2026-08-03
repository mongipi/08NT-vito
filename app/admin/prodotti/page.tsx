import { getAdminProducts } from '@/services/products'
import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'

export const metadata = { title: 'Prodotti' }

const th: React.CSSProperties = { padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.6875rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9' }

export default async function ProdottiPage() {
  const products = await getAdminProducts()

  return (
    <div>
      <PageHeader title="Prodotti" description={`${products.length} prodotti`} action={{ label: 'Nuovo prodotto', href: '/admin/prodotti/nuovo' }} />
      <div style={{ background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '36rem' }}>
            <thead>
              <tr>{['Ord.', 'Nome', 'Linea', 'Prezzo', 'Stock', 'Pub.', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}>
                  Nessun prodotto. <Link href="/admin/prodotti/nuovo" style={{ color: '#1a4a2e' }}>Creane uno</Link>
                </td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ ...td, color: '#9ca3af', width: '3rem' }}>{p.order}</td>
                  <td style={td}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>{p.name}</div>
                    <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.0625rem' }}>{p.slug}</div>
                  </td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem' }}>
                      <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: p.line.color, flexShrink: 0 }} />
                      {p.line.name}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ fontWeight: 600, color: '#111827' }}>€{p.price.toFixed(2)}</span>
                    {p.comparePrice && <span style={{ fontSize: '0.6875rem', color: '#9ca3af', marginLeft: '0.375rem', textDecoration: 'line-through' }}>€{p.comparePrice.toFixed(2)}</span>}
                  </td>
                  <td style={{ ...td, fontWeight: 500, color: p.stock <= 5 ? '#dc2626' : '#374151' }}>{p.stock}</td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', width: '1.25rem', height: '1.25rem', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', background: p.published ? '#f0fdf4' : '#f9fafb', color: p.published ? '#16a34a' : '#9ca3af' }}>
                      {p.published ? '✓' : '–'}
                    </span>
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <Link href={`/admin/prodotti/${p.id}`} style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e', textDecoration: 'none' }}>Modifica</Link>
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
