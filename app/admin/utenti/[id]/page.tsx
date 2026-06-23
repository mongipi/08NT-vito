import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '../../_components/Badge'
import { formatDate } from '@/lib/utils'
import { updateUserRole } from '@/lib/actions/admin/users'
import { s } from '../../_components/styles'

export default async function EditUtentePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: { orders: { orderBy: { createdAt: 'desc' }, take: 5 } },
  })
  if (!user) notFound()

  const profileFields = [
    ['Nome', user.name ?? '—'],
    ['Email', user.email],
    ['Azienda', user.company ?? '—'],
    ['P. IVA', user.vatNumber ?? '—'],
    ['Iscritto il', formatDate(user.createdAt)],
    ...(user.stripeCustomerId ? [['Stripe ID', user.stripeCustomerId]] : []),
  ]

  return (
    <>
      <div style={s.breadcrumb}>
        <Link href="/admin/utenti" style={s.link}>← Utenti</Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{user.name ?? user.email}</span>
      </div>

      <div className="detail-grid">
        {/* Main */}
        <div style={s.stack(16)}>
          {/* Profilo */}
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Profilo</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
              {profileFields.map(([k, v]) => (
                <div key={k as string}>
                  <dt style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 3 }}>{k}</dt>
                  <dd style={{ fontSize: 13, color: '#374151', margin: 0, wordBreak: 'break-all' }}>{v}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* Ordini */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Ultimi ordini</span>
              <Link href="/admin/ordini" style={s.linkGreen}>Vedi tutti →</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>{['ID', 'Totale', 'Stato', 'Data'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {user.orders.length === 0 && (
                    <tr><td colSpan={4} style={{ ...s.td, textAlign: 'center', color: '#9ca3af', padding: '28px 16px' }}>Nessun ordine</td></tr>
                  )}
                  {user.orders.map(o => (
                    <tr key={o.id}>
                      <td style={s.td}>
                        <Link href={`/admin/ordini/${o.id}`} style={s.mono}>#{o.id.slice(-8).toUpperCase()}</Link>
                      </td>
                      <td style={{ ...s.td, fontWeight: 600, color: '#111827' }}>€{o.total.toFixed(2)}</td>
                      <td style={s.td}><Badge value={o.status} /></td>
                      <td style={{ ...s.td, color: '#9ca3af' }}>{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={s.stack(16)}>
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Ruolo</p>
            <div style={{ marginBottom: 14 }}><Badge value={user.role} /></div>
            <form action={updateUserRole} style={s.stack(10)}>
              <input type="hidden" name="id" value={id} />
              <select name="role" defaultValue={user.role} style={s.select}>
                <option value="consumer">Consumer</option>
                <option value="b2b">B2B</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" style={s.btnPrimary}>Aggiorna ruolo</button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .detail-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 900px) {
          .detail-grid {
            display: grid;
            grid-template-columns: 1fr 260px;
            gap: 20px;
            align-items: start;
          }
        }
      `}</style>
    </>
  )
}
