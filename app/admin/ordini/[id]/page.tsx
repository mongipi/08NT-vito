import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '../../_components/Badge'
import { formatDate } from '@/lib/utils'
import { updateOrderStatus } from '@/lib/actions/admin/orders'
import { s } from '../../_components/styles'

export const metadata = { title: 'Dettaglio ordine' }

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'In attesa' },
  { value: 'paid',      label: 'Pagato' },
  { value: 'shipped',   label: 'Spedito' },
  { value: 'delivered', label: 'Consegnato' },
  { value: 'cancelled', label: 'Annullato' },
]

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true, shippingAddress: true },
  })
  if (!order) notFound()

  const items = order.items
  const address = order.shippingAddress

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/ordini" style={{ fontSize: '0.8125rem', color: '#6b7280', textDecoration: 'none' }}>
          ← Ordini
        </Link>
        <span style={{ color: '#d1d5db' }}>/</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
          #{id.slice(-8).toUpperCase()}
        </span>
        <Badge value={order.status} />
      </div>

      <div className="order-admin-grid">

        {/* ── Colonna principale ── */}
        <div style={s.stack(16)}>

          {/* Articoli */}
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Articoli ordinati</p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map((item, i) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem', padding: '0.75rem 0',
                  borderBottom: i < items.length - 1 ? '0.5px solid #f0f1f3' : 'none',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.125rem 0 0' }}>
                      Qtà {item.qty} · €{item.unitPrice.toFixed(2)} cad.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', flexShrink: 0 }}>
                    €{(item.unitPrice * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totali */}
            <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #f0f1f3', display: 'flex', flexDirection: 'column', gap: '0.4375rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#6b7280' }}>
                <span>Subtotale</span><span>€{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#dc2626' }}>
                  <span>Sconto{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                  <span>−€{order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 700, color: '#111827', borderTop: '1px solid #f0f1f3', paddingTop: '0.5625rem', marginTop: '0.125rem' }}>
                <span>Totale</span><span>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Indirizzo */}
          {address && (
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Indirizzo di spedizione</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1875rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#111827' }}>
                  {[address.firstName, address.lastName].filter(Boolean).join(' ')}
                </span>
                {address.company   && <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{address.company}</span>}
                {address.vatNumber && <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>P.IVA {address.vatNumber}</span>}
                {address.fiscalCode && <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>C.F. {address.fiscalCode}</span>}
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{address.address}</span>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  {[address.postalCode, address.city, address.province].filter(Boolean).join(' ')}
                </span>
                {address.country !== 'IT' && <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{address.country}</span>}
                {address.phone && <span style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.375rem' }}>{address.phone}</span>}
              </div>
            </div>
          )}

          {/* Punto di ritiro */}
          {order.deliveryType === 'pickup' && (
            <div style={s.cardPad}>
              <p style={s.cardTitle}>Ritiro in punto di consegna</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1875rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#111827' }}>
                  {order.pickupCarrier
                    ? ({ POSTE: 'Poste Italiane', BRT: 'BRT Fermopoint' } as Record<string, string>)[order.pickupCarrier] ?? order.pickupCarrier
                    : '—'}
                </span>
                {order.pickupPointAddress && (
                  <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{order.pickupPointAddress}</span>
                )}
                {order.pickupPointCode && (
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                    Codice: {order.pickupPointCode}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={s.stack(16)}>

          {/* Aggiorna stato */}
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Stato ordine</p>
            <form action={updateOrderStatus} style={s.stack(10)}>
              <input type="hidden" name="id" value={id} />
              <select name="status" defaultValue={order.status} style={s.select}>
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.25rem' }}>
                  N° tracking (opzionale)
                </label>
                <input
                  name="trackingNumber"
                  placeholder="es. 1Z999AA10123456784"
                  style={{ ...s.select, fontFamily: 'monospace' }}
                />
                <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Incluso nell&apos;email di spedizione al cliente.</p>
              </div>
              <button type="submit" style={s.btnPrimary}>Aggiorna stato</button>
            </form>
          </div>

          {/* Cliente */}
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Cliente</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <div style={{
                width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0,
                background: '#f0f7f2', color: '#1a4a2e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                {(order.user?.name ?? order.user?.email ?? order.guestEmail ?? 'O')[0].toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {order.user?.name ?? (order.guestEmail ? 'Ospite' : '—')}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.0625rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {order.user?.email ?? order.guestEmail ?? '—'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {order.user ? (
                <>
                  <Badge value={order.user.role} />
                  <Link href={`/admin/utenti/${order.user.id}`} style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1a4a2e', textDecoration: 'none' }}>
                    Profilo →
                  </Link>
                </>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Ordine ospite</span>
              )}
            </div>
          </div>

          {/* Meta */}
          <div style={s.cardPad}>
            <p style={s.cardTitle}>Dettagli</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {([
                ['Creato il', formatDate(order.createdAt)],
                ['Aggiornato', formatDate(order.updatedAt)],
                ...(order.stripePaymentIntentId
                  ? [['Stripe PI', '…' + order.stripePaymentIntentId.slice(-14)]]
                  : []),
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: '0.75rem', color: '#374151', fontFamily: k === 'Stripe PI' ? 'monospace' : undefined, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-admin-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 56.25rem) {
          .order-admin-grid {
            display: grid;
            grid-template-columns: 1fr 16.25rem;
            gap: 1.25rem;
            align-items: start;
          }
        }
      `}</style>
    </div>
  )
}
