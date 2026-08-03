import { getAdminDashboardStats } from '@/services/orders'
import Link from 'next/link'
import { Badge } from './_components/Badge'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Dashboard' }

const card: React.CSSProperties = {
  background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', padding: '1.25rem',
}

const th: React.CSSProperties = {
  padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem',
  fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af',
  borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap',
}

const td: React.CSSProperties = {
  padding: '0.6875rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9',
}

export default async function AdminDashboard() {
  const { totalOrders, pendingOrders, totalUsers, publishedProducts, revenue, recentOrders } =
    await getAdminDashboardStats()

  const stats = [
    { label: 'Fatturato', value: `€${revenue.toFixed(2)}`, sub: 'ordini pagati', color: '#1a4a2e', bg: '#f0f7f2' },
    { label: 'Ordini totali', value: totalOrders, sub: `${pendingOrders} in attesa`, color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Utenti', value: totalUsers, sub: 'registrati', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Prodotti attivi', value: publishedProducts, sub: 'pubblicati', color: '#b45309', bg: '#fffbeb' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.1875rem', marginBottom: 0 }}>Panoramica del tuo e-commerce</p>
      </div>

      {/* Stats grid: 2 col mobile, 4 col desktop */}
      <div className="admin-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {stats.map(({ label, value, sub, color, bg }) => (
          <div key={label} style={card}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
              <div style={{ width: '1rem', height: '1rem', borderRadius: '0.1875rem', background: color, opacity: 0.8 }} />
            </div>
            <p style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>{value}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151', marginTop: '0.125rem', marginBottom: '0.0625rem' }}>{label}</p>
            <p style={{ fontSize: '0.6875rem', color: '#9ca3af', margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ ...card, padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #f0f1f3' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>Ordini recenti</h2>
          <Link href="/admin/ordini" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e', textDecoration: 'none' }}>Vedi tutti →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '32rem' }}>
            <thead>
              <tr>
                {['ID ordine', 'Cliente', 'Totale', 'Stato', 'Data'].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2rem 1rem' }}>Nessun ordine ancora</td></tr>
              )}
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={td}>
                    <Link href={`/admin/ordini/${order.id}`} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#1a4a2e', textDecoration: 'none', fontWeight: 500 }}>
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td style={td}>{order.user?.name ?? order.user?.email ?? order.guestEmail ?? '—'}</td>
                  <td style={{ ...td, fontWeight: 600, color: '#111827' }}>€{order.total.toFixed(2)}</td>
                  <td style={td}><Badge value={order.status} /></td>
                  <td style={{ ...td, color: '#9ca3af' }}>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (min-width: 48rem) {
          .admin-stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
