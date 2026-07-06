import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import Link from 'next/link'
import { PageHeader } from '../_components/PageHeader'
import { Badge } from '../_components/Badge'
import { SearchInput } from '../_components/SearchInput'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Ordini' }

const th: React.CSSProperties = { padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid #f0f1f3', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '0.6875rem 1rem', fontSize: '0.8125rem', color: '#374151', borderBottom: '1px solid #f7f8f9' }

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function OrdiniPage({ searchParams }: Props) {
  const { q } = await searchParams

  const where: Prisma.OrderWhereInput | undefined = q ? {
    OR: [
      { id: { contains: q, mode: 'insensitive' } },
      { guestEmail: { contains: q, mode: 'insensitive' } },
      { couponCode: { contains: q, mode: 'insensitive' } },
      { user: { name: { contains: q, mode: 'insensitive' } } },
      { user: { email: { contains: q, mode: 'insensitive' } } },
    ],
  } : undefined

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, name: true } }, items: { select: { qty: true } } },
  })

  return (
    <div>
      <PageHeader title="Ordini" description={`${orders.length} ordini${q ? ' trovati' : ' totali'}`} />
      <SearchInput placeholder="Cerca per ID ordine, cliente, email o coupon…" />
      <div style={{ background: 'white', borderRadius: '0.625rem', border: '1px solid #e8eaed', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '48rem' }}>
            <thead>
              <tr>{['ID', 'Cliente', 'Art.', 'Subtotale', 'Sconto', 'Totale', 'Coupon', 'Stato', 'Data'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={9} style={{ ...td, textAlign: 'center', color: '#9ca3af', padding: '2.5rem 1rem' }}>
                  {q ? `Nessun ordine trovato per "${q}"` : 'Nessun ordine'}
                </td></tr>
              )}
              {orders.map((o) => {
                return (
                  <tr key={o.id}>
                    <td style={td}>
                      <Link href={`/admin/ordini/${o.id}`} style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#1a4a2e', textDecoration: 'none', fontWeight: 600 }}>
                        #{o.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td style={td}>{o.user?.name ?? o.user?.email ?? o.guestEmail ?? '—'}</td>
                    <td style={{ ...td, color: '#9ca3af' }}>{o.items.length}</td>
                    <td style={td}>€{o.subtotal.toFixed(2)}</td>
                    <td style={{ ...td, color: o.discountAmount > 0 ? '#dc2626' : '#9ca3af' }}>
                      {o.discountAmount > 0 ? `-€${o.discountAmount.toFixed(2)}` : '—'}
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: '#111827' }}>€{o.total.toFixed(2)}</td>
                    <td style={{ ...td, fontFamily: 'monospace', fontSize: '0.75rem', color: '#9ca3af' }}>{o.couponCode ?? '—'}</td>
                    <td style={td}><Badge value={o.status} /></td>
                    <td style={{ ...td, color: '#9ca3af' }}>{formatDate(o.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
