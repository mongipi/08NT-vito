'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/cart'
import { validateCoupon } from '@/lib/actions/coupon'
import { getShippingConfig } from '@/lib/actions/public'
import { useSession } from 'next-auth/react'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart()
  const { data: session } = useSession()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [shipping, setShipping] = useState<{ threshold: number; price: number; foreignSurcharge: number } | null>(null)

  useEffect(() => {
    getShippingConfig().then(setShipping).catch(() => {})
  }, [])

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    const role = (session?.user?.role as 'consumer' | 'b2b') ?? 'consumer'
    const result = await validateCoupon(couponInput, cart.items, role)
    if (!result.valid) setCouponError(result.error ?? 'Codice non valido')
    else if (result.coupon) { cart.applyCoupon(result.coupon); setCouponInput('') }
    setCouponLoading(false)
  }

  const freeThreshold  = shipping?.threshold ?? 50
  const shippingPrice  = shipping?.price     ?? 5.90
  const missingForFree = Math.max(0, freeThreshold - cart.total)
  const hasFreeShipping = cart.total >= freeThreshold
  const progressPct    = Math.min(100, (cart.total / freeThreshold) * 100)
  const estimatedTotal = cart.total + (hasFreeShipping ? 0 : (shipping?.price ?? 0))

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            zIndex: 200, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 100vw)',
        background: 'white', zIndex: 201,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--forest)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'white', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Carrello
            </span>
            {cart.itemCount > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                fontSize: '0.6875rem', fontWeight: 600,
                borderRadius: 99, padding: '2px 8px',
              }}>
                {cart.itemCount}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Banner spedizione gratuita */}
        {cart.items.length > 0 && shipping && (
          <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--border)', background: hasFreeShipping ? '#f0fdf4' : '#fafaf8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: hasFreeShipping ? '#15803d' : 'var(--ink-3)', letterSpacing: '0.05em' }}>
                {hasFreeShipping
                  ? '✓ Hai diritto alla spedizione gratuita!'
                  : `Aggiungi ${formatPrice(missingForFree)} per la spedizione gratuita`}
              </span>
              {!hasFreeShipping && (
                <span style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', flexShrink: 0, marginLeft: 8 }}>{formatPrice(shippingPrice)}</span>
              )}
            </div>
            <div style={{ height: 3, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${progressPct}%`,
                background: hasFreeShipping ? '#16a34a' : 'var(--forest)',
                borderRadius: 99, transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: cart.items.length ? 0 : '3rem 1.5rem' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
                <circle cx="9" cy="20" r="1.35"/><circle cx="18" cy="20" r="1.35"/><path d="M3 4h2.2l2.15 10.25a2 2 0 0 0 1.95 1.58h7.7a2 2 0 0 0 1.9-1.38L21 8H6.1"/><path d="M8 11h10.8"/>
              </svg>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink-3)', fontWeight: 300, marginBottom: '1.5rem' }}>Il carrello è vuoto</p>
              <button onClick={onClose} style={{
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--forest)', background: 'none', border: '1px solid var(--forest)',
                padding: '0.625rem 1.25rem', cursor: 'pointer',
              }}>
                Continua gli acquisti
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {cart.items.map((item) => (
                <li key={item.productId} style={{
                  display: 'flex', gap: 14, padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ width: 64, height: 64, flexShrink: 0, background: 'var(--paper)', position: 'relative', overflow: 'hidden' }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain', padding: 4 }} unoptimized />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--border-2)" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.3 }}>{item.name}</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--forest)', margin: '0 0 10px' }}>
                      {formatPrice(item.price * item.qty)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      <button onClick={() => cart.updateQty(item.productId, item.qty - 1)} style={qtyBtn}>−</button>
                      <span style={{ width: 32, textAlign: 'center', fontSize: '0.8125rem', fontWeight: 500 }}>{item.qty}</span>
                      <button onClick={() => cart.updateQty(item.productId, item.qty + 1)} style={qtyBtn}>+</button>
                    </div>
                  </div>

                  <button
                    onClick={() => cart.removeItem(item.productId)}
                    style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', padding: 4 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Coupon */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Codice sconto"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                style={{
                  flex: 1, border: '1px solid var(--border-2)', padding: '0.5rem 0.75rem',
                  fontSize: '0.8125rem', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.05em',
                }}
              />
              <button
                onClick={applyCoupon} disabled={couponLoading}
                style={{
                  background: 'var(--paper)', border: '1px solid var(--border-2)',
                  padding: '0.5rem 0.875rem', fontSize: '0.75rem', fontWeight: 500,
                  cursor: 'pointer', color: 'var(--ink)', whiteSpace: 'nowrap',
                }}
              >
                {couponLoading ? '…' : 'Applica'}
              </button>
            </div>
            {couponError && <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>{couponError}</p>}
            {cart.coupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>✓ Codice {cart.coupon.code} applicato</span>
                <button onClick={cart.removeCoupon} style={{ fontSize: '0.75rem', color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}>Rimuovi</button>
              </div>
            )}

            {/* Totali */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                <span>Subtotale</span><span>{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#16a34a' }}>
                  <span>Sconto</span><span>−{formatPrice(cart.discountAmount)}</span>
                </div>
              )}
              {shipping && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: hasFreeShipping ? '#16a34a' : 'var(--ink-3)' }}>
                  <span>Spedizione</span>
                  <span>{hasFreeShipping ? 'Gratuita' : formatPrice(shippingPrice)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, color: 'var(--forest)', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 2 }}>
                <span>Totale</span><span>{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              style={{
                display: 'block', textAlign: 'center', width: '100%',
                padding: '0.9375rem', background: 'var(--forest)', color: 'white',
                textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                boxSizing: 'border-box',
              }}
            >
              Procedi all&apos;acquisto
            </Link>

            <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--ink-4)', margin: 0 }}>
              Supplemento estero e contrassegno calcolati al checkout
            </p>
          </div>
        )}
      </div>
    </>
  )
}

const qtyBtn: React.CSSProperties = {
  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--paper)', border: '1px solid var(--border)', cursor: 'pointer',
  fontSize: '1rem', color: 'var(--ink)', lineHeight: 1,
}
