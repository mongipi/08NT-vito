import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

interface Props { params: Promise<{ id: string }> }

const STATUS_LABEL: Record<string, string> = {
  pending: 'In attesa', paid: 'Pagato', shipped: 'Spedito',
  delivered: 'Consegnato', cancelled: 'Annullato',
}
const STATUS_STYLE: Record<string, React.CSSProperties> = {
  pending:   { background: '#fef9ec', color: '#a16207' },
  paid:      { background: '#f0fdf4', color: '#16a34a' },
  shipped:   { background: '#eff6ff', color: '#2563eb' },
  delivered: { background: '#f0fdf4', color: '#15803d' },
  cancelled: { background: '#fff5f5', color: '#dc2626' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Ordine #${id.slice(-8).toUpperCase()} — 08 Natural Technology` }
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  })
  if (!order || order.userId !== session.user.id) notFound()

  const items = order.items
  const address = order.shippingAddress
  const sc = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending
  const itemCount = items.reduce((n, i) => n + i.qty, 0)

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100dvh' }}>
      <div style={{ height: '0.1875rem', background: 'var(--forest)' }} />

      {/* ── Header ── */}
      <section style={{ background: 'linear-gradient(150deg, #0b2214 0%, var(--forest) 100%)', padding: '1.75rem 1.25rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto' }}>

          <Link href="/account" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', marginBottom: '1.25rem',
          }}>
            <svg width="0.625rem" height="0.625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            I miei ordini
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.5rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.375rem' }}>
                Ordine
              </p>
              <h1 style={{
                fontFamily: 'var(--font-cormorant)', fontWeight: 300,
                fontSize: 'clamp(1.625rem, 5vw, 2.25rem)',
                color: 'white', margin: 0, lineHeight: 1, letterSpacing: '0.02em',
              }}>
                #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', margin: '0.375rem 0 0', fontWeight: 300 }}>
                {order.createdAt.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}{itemCount} {itemCount === 1 ? 'articolo' : 'articoli'}
              </p>
            </div>

            <span style={{
              fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.14em',
              textTransform: 'uppercase', padding: '0.3125rem 0.75rem',
              alignSelf: 'flex-start', flexShrink: 0,
              ...sc,
            }}>
              {STATUS_LABEL[order.status] ?? order.status}
            </span>
          </div>
        </div>
      </section>

      {/* ── Corpo ── */}
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '1.75rem 1.25rem 3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Prodotti */}
        <div style={{ background: 'white', border: '1px solid var(--border)' }}>
          <div style={{ padding: '0.875rem 1.25rem', borderBottom: '0.5px solid var(--border)' }}>
            <SectionLabel>Prodotti ordinati</SectionLabel>
          </div>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.25rem',
              borderBottom: i < items.length - 1 ? '0.5px solid var(--border)' : 'none',
            }}>
              {/* Thumbnail */}
              <div style={{
                width: '3.5rem', height: '3.5rem', flexShrink: 0,
                background: 'var(--paper)', border: '0.5px solid var(--border)',
                position: 'relative', overflow: 'hidden',
              }}>
                {item.slug ? (
                  <Image src={`/api/product-images/${item.slug}/fronte`} alt={item.name} fill style={{ objectFit: 'contain' }} sizes="56px" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                    </svg>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {item.slug ? (
                  <Link
                    href={`/prodotti/${item.slug}`}
                    style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </span>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', margin: '0.1875rem 0 0', fontWeight: 300 }}>
                  Qtà {item.qty} · €{item.unitPrice.toFixed(2)} cad.
                </p>
              </div>

              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--forest)', flexShrink: 0, fontFamily: 'var(--font-cormorant)' }}>
                €{(item.unitPrice * item.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Importi + Indirizzo */}
        <div className="order-detail-grid">

          {/* Totali */}
          <div style={{ background: 'white', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '0.5px solid var(--border)' }}>
              <SectionLabel>Riepilogo importi</SectionLabel>
            </div>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <AmountRow label="Subtotale" value={`€${order.subtotal.toFixed(2)}`} />
              {order.discountAmount > 0 && (
                <AmountRow
                  label={`Sconto${order.couponCode ? ` · ${order.couponCode}` : ''}`}
                  value={`−€${order.discountAmount.toFixed(2)}`}
                  valueStyle={{ color: '#16a34a' }}
                />
              )}
              <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.125rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Totale</span>
                <span style={{ fontSize: '1.375rem', fontWeight: 300, color: 'var(--forest)', fontFamily: 'var(--font-cormorant)' }}>€{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Indirizzo */}
          <div style={{ background: 'white', border: '1px solid var(--border)' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '0.5px solid var(--border)' }}>
              <SectionLabel>Indirizzo di spedizione</SectionLabel>
            </div>
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.1875rem' }}>
              {address ? (
                <>
                  <p style={addrLine}>{[address.firstName, address.lastName].filter(Boolean).join(' ')}</p>
                  {address.company   && <p style={addrLine}>{address.company}</p>}
                  {address.vatNumber && <p style={{ ...addrLine, color: 'var(--ink-4)', fontSize: '0.75rem' }}>P.IVA {address.vatNumber}</p>}
                  <p style={addrLine}>{address.address}</p>
                  <p style={addrLine}>{[address.postalCode, address.city, address.province].filter(Boolean).join(' ')}</p>
                  {address.country !== 'IT' && <p style={addrLine}>{address.country}</p>}
                  {address.phone && <p style={{ ...addrLine, marginTop: '0.625rem', color: 'var(--ink-4)' }}>{address.phone}</p>}
                </>
              ) : (
                <p style={{ ...addrLine, color: 'var(--ink-4)' }}>—</p>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/prodotti" style={{
            display: 'block', textAlign: 'center', padding: '0.875rem',
            background: 'var(--forest)', color: 'white', textDecoration: 'none',
            fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            Continua gli acquisti
          </Link>
          <Link href="/contatti" style={{
            display: 'block', textAlign: 'center', padding: '0.875rem',
            background: 'transparent', color: 'var(--ink-3)', textDecoration: 'none',
            fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
            border: '1px solid var(--border)',
          }}>
            Assistenza
          </Link>
        </div>
      </div>

      <style>{`
        .order-detail-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 40rem) {
          .order-detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }
      `}</style>
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-4)', margin: 0 }}>
      {children}
    </p>
  )
}

function AmountRow({ label, value, valueStyle }: { label: string; value: string; valueStyle?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontWeight: 300 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', ...valueStyle }}>{value}</span>
    </div>
  )
}

const addrLine: React.CSSProperties = {
  fontSize: '0.8125rem', color: 'var(--ink)', fontWeight: 300,
  margin: 0, lineHeight: 1.7,
}
