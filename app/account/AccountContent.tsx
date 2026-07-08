'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation, type DictionaryKey } from '@/lib/i18n/dictionary'
import { SignOutButton } from './_SignOutButton'

const STATUS_KEY: Record<string, DictionaryKey> = {
  pending:   'order_status_pending',
  paid:      'order_status_paid',
  shipped:   'order_status_shipped',
  delivered: 'order_status_delivered',
  cancelled: 'order_status_cancelled',
}

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  pending:   { background: '#fef9ec', color: '#a16207' },
  paid:      { background: '#f0fdf4', color: '#16a34a' },
  shipped:   { background: '#eff6ff', color: '#2563eb' },
  delivered: { background: '#f0fdf4', color: '#15803d' },
  cancelled: { background: '#fff5f5', color: '#dc2626' },
}

export interface AccountOrder {
  id: string
  status: string
  total: number
  discountAmount: number
  createdAt: string
  itemCount: number
}

interface Props {
  name: string
  email: string
  isB2B: boolean
  orders: AccountOrder[]
}

export function AccountContent({ name, email, isB2B, orders }: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const initials = (name || email).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)

  return (
    <main style={{ background: 'var(--paper)', minHeight: '100dvh' }}>
      <div style={{ height: '0.1875rem', background: 'var(--forest)' }} />

      {/* ── Header ────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(150deg, #0b2214 0%, var(--forest) 100%)', padding: '2rem 1.25rem 2.5rem' }}>
        <div style={{ maxWidth: '44rem', margin: '0 auto' }}>

          {/* Eyebrow */}
          <div style={{ fontSize: '0.5rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ display: 'block', width: '1rem', height: '0.5px', background: 'rgba(255,255,255,0.3)' }} />
            {t('account_eyebrow')}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
              {/* Avatar */}
              <div style={{
                width: '3.25rem', height: '3.25rem', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.04em' }}>{initials}</span>
              </div>

              <div style={{ minWidth: 0 }}>
                <h1 style={{
                  fontFamily: 'var(--font-cormorant)', fontWeight: 300,
                  fontSize: 'clamp(1.625rem, 5vw, 2.25rem)',
                  color: 'white', margin: 0, lineHeight: 1.05,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {name || t('account_default_title')}
                </h1>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: '0.25rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email}
                </p>
                {isB2B && (
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#a16207', background: '#fef9ec', padding: '0.1875rem 0.5rem' }}>
                    {t('account_b2b_badge')}
                  </span>
                )}
              </div>
            </div>

            <SignOutButton />
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '2rem' }}>
            {[
              { label: t('account_stat_orders'), value: String(orders.length) },
              { label: t('account_stat_total_spent'), value: `€ ${totalSpent.toFixed(2)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.875rem 1rem' }}>
                <p style={{ fontSize: '0.5rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 0.3125rem' }}>{label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: 0, fontFamily: 'var(--font-cormorant)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Corpo ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '44rem', margin: '0 auto', padding: '2rem 1.25rem 3rem' }}>

        {/* Titolo sezione ordini */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <span style={{ display: 'block', width: '1.125rem', height: '0.5px', background: 'var(--green)', flexShrink: 0 }} />
          <h2 style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--green)', margin: 0 }}>
            {t('account_my_orders')}
          </h2>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '3rem 1.5rem', textAlign: 'center' }}>
            <svg width="2.5rem" height="2.5rem" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1" style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.625rem', fontWeight: 300, color: 'var(--forest)', margin: '0 0 0.5rem' }}>
              {t('account_no_orders_title')}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', fontWeight: 300, margin: '0 0 1.75rem' }}>
              {t('account_no_orders_body')}
            </p>
            <Link href="/prodotti" style={{
              display: 'inline-block', padding: '0.75rem 1.75rem',
              background: 'var(--forest)', color: 'white', textDecoration: 'none',
              fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>
              {t('account_discover_products')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {orders.map((order) => {
              const sc = STATUS_STYLE[order.status] ?? STATUS_STYLE.pending
              const statusKey = STATUS_KEY[order.status]

              return (
                <div key={order.id} style={{ background: 'white', border: '1px solid var(--border)' }}>
                  {/* Card top */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '1rem 1.25rem', gap: '0.75rem', borderBottom: '0.5px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)', margin: 0, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', margin: '0.1875rem 0 0', fontWeight: 300 }}>
                        {new Date(order.createdAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{order.itemCount} {order.itemCount === 1 ? t('account_item_singular') : t('account_item_plural')}
                      </p>
                    </div>
                    <span style={{
                      flexShrink: 0, fontSize: '0.5rem', fontWeight: 600,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '0.25rem 0.5625rem',
                      ...sc,
                    }}>
                      {statusKey ? t(statusKey) : order.status}
                    </span>
                  </div>

                  {/* Card bottom */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--forest)', fontFamily: 'var(--font-cormorant)' }}>
                        €{order.total.toFixed(2)}
                      </span>
                      {order.discountAmount > 0 && (
                        <span style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 400 }}>
                          (−€{order.discountAmount.toFixed(2)})
                        </span>
                      )}
                    </div>
                    <Link href={`/account/ordini/${order.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: '0.3125rem',
                      fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: 'var(--forest)', textDecoration: 'none',
                      borderBottom: '1px solid var(--green-l)',
                      paddingBottom: '0.0625rem',
                    }}>
                      {t('account_details')}
                      <svg width="0.5625rem" height="0.5625rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Link rapidi */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '2rem' }}>
          {[
            { href: '/account/profilo', label: t('account_link_profile') },
            { href: '/prodotti', label: t('account_link_catalog') },
            { href: '/contatti', label: t('account_link_support') },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1rem', background: 'white', border: '1px solid var(--border)',
              fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'none', fontWeight: 400,
            }}>
              {label}
              <span style={{ color: 'var(--ink-4)', fontSize: '0.875rem' }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
