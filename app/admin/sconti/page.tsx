import { getDiscounts } from '@/services/discounts'
import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'
import { Badge } from '../_components/Badge'
import { formatDate } from '@/lib/utils'
import { deleteDiscount } from '@/lib/actions/admin/discounts'

export const metadata = { title: 'Sconti' }

const th: React.CSSProperties = { padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.6875rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9' }

export default async function ScontiPage() {
  const discounts = await getDiscounts()

  return (
    <div>
      <PageHeader title="Sconti & Coupon" description={`${discounts.length} coupon`} action={{ label: 'Nuovo coupon', href: '/admin/sconti/nuovo' }} />
      <div style={{ background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '48rem' }}>
            <thead>
              <tr>{['Codice', 'Tipo', 'Valore', 'Utilizzi', 'Applica a', 'Min. ordine', 'Scade', 'Stato', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {discounts.length === 0 && (
                <tr><td colSpan={9} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}>
                  Nessun coupon. <Link href="/admin/sconti/nuovo" style={{ color: '#1a4a2e' }}>Creane uno</Link>
                </td></tr>
              )}
              {discounts.map((d) => (
                <tr key={d.id}>
                  <td style={td}><span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111827', fontSize: '0.8125rem' }}>{d.code}</span></td>
                  <td style={{ ...td, color: '#9ca3af', textTransform: 'capitalize' }}>{d.type}</td>
                  <td style={{ ...td, fontWeight: 600, color: '#111827' }}>{d.type === 'percent' ? `${d.value}%` : `€${d.value.toFixed(2)}`}</td>
                  <td style={{ ...td, color: '#9ca3af' }}>{d.usedCount}{d.maxUses ? `/${d.maxUses}` : ''}</td>
                  <td style={td}><Badge value={d.applicableTo} /></td>
                  <td style={{ ...td, color: '#9ca3af' }}>{d.minOrderAmount ? `€${d.minOrderAmount.toFixed(2)}` : '—'}</td>
                  <td style={{ ...td, color: '#9ca3af' }}>{d.expiresAt ? formatDate(d.expiresAt) : '—'}</td>
                  <td style={td}><Badge value={d.active ? 'active' : 'inactive'} /></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <form action={deleteDiscount} style={{ display: 'inline' }}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Elimina</button>
                    </form>
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
