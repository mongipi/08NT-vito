'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/contexts/CartContext'
import { validateCoupon } from '@/lib/actions/coupon'
import { createPaymentIntent } from '@/lib/actions/checkout'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/cart'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  border: '1px solid var(--border-2)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', color: 'var(--ink)', outline: 'none',
  background: 'white', fontFamily: 'var(--font-montserrat)',
  borderRadius: 0,
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.6875rem', fontWeight: 500,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: '0.375rem',
}

const FIELDS = [
  { key: 'name',       label: 'Nome e cognome',        required: true },
  { key: 'address',    label: 'Indirizzo',              required: true },
  { key: 'city',       label: 'Città',                  required: true },
  { key: 'postalCode', label: 'CAP',                    required: true },
  { key: 'province',   label: 'Provincia (es. BA)',      required: false },
  { key: 'phone',      label: 'Telefono (opzionale)',    required: false },
] as const

export function CheckoutClient() {
  const { data: session } = useSession()
  const cart = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    name: session?.user?.name ?? '',
    address: '', city: '', postalCode: '', province: '', country: 'IT', phone: '',
  })
  const [step, setStep] = useState<'address' | 'payment'>('address')

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true); setCouponError(null)
    const role = (session?.user?.role as 'consumer' | 'b2b') ?? 'consumer'
    const result = await validateCoupon(couponInput, cart.items, role)
    if (!result.valid) setCouponError(result.error ?? 'Codice non valido')
    else if (result.coupon) { cart.applyCoupon(result.coupon); setCouponInput('') }
    setCouponLoading(false)
  }

  async function handleProceed() {
    setLoading(true)
    try {
      const { clientSecret } = await createPaymentIntent(cart.items, cart.coupon, address)
      setClientSecret(clientSecret!)
      setStep('payment')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = address.name && address.address && address.city && address.postalCode

  if (cart.itemCount === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink-3)', marginBottom: '1.5rem', fontWeight: 300 }}>Il carrello è vuoto.</p>
        <Link href="/prodotti" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--forest)', color: 'white', textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Vai ai prodotti
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="checkout-grid">
      {/* Colonna sinistra: form */}
      <div>
        {step === 'address' && (
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <h2 style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1.5rem' }}>
              Indirizzo di spedizione
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {FIELDS.map(({ key, label, required }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
                  <input
                    type="text"
                    value={address[key]}
                    onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <label style={labelStyle}>Codice sconto</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="es. ESTATE20"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.08em' }}
                />
                <button
                  onClick={applyCoupon} disabled={couponLoading}
                  style={{ background: 'var(--paper)', border: '1px solid var(--border-2)', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', color: 'var(--ink)', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {couponLoading ? '…' : 'Applica'}
                </button>
              </div>
              {couponError && <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 6 }}>{couponError}</p>}
              {cart.coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>✓ Codice <strong>{cart.coupon.code}</strong> — sconto {formatPrice(cart.discountAmount)}</span>
                  <button onClick={cart.removeCoupon} style={{ fontSize: '0.75rem', color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}>Rimuovi</button>
                </div>
              )}
            </div>

            <button
              onClick={handleProceed}
              disabled={!canProceed || loading}
              style={{
                marginTop: '1.75rem', width: '100%', padding: '0.9375rem',
                background: canProceed && !loading ? 'var(--forest)' : 'var(--ink-4)',
                color: 'white', border: 'none', cursor: canProceed && !loading ? 'pointer' : 'not-allowed',
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              }}
            >
              {loading ? 'Preparazione pagamento…' : 'Procedi al pagamento →'}
            </button>
          </div>
        )}

        {step === 'payment' && clientSecret && (
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.75rem' }}>
            <button
              onClick={() => setStep('address')}
              style={{ fontSize: '0.75rem', color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
            >
              ← Modifica indirizzo
            </button>
            <h2 style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1.5rem' }}>
              Pagamento
            </h2>
            <Elements stripe={stripePromise} options={{ clientSecret, locale: 'it', appearance: { theme: 'stripe', variables: { colorPrimary: '#1a4a2e', borderRadius: '0px' } } }}>
              <PaymentForm />
            </Elements>
          </div>
        )}
      </div>

      {/* Colonna destra: riepilogo */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.75rem', alignSelf: 'start' }}>
        <h2 style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1.25rem' }}>
          Riepilogo ordine
        </h2>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.items.map((item) => (
            <li key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--ink)', fontWeight: 400 }}>
                {item.name}
                <span style={{ color: 'var(--ink-4)', fontWeight: 300 }}> × {item.qty}</span>
              </span>
              <span style={{ fontWeight: 600, color: 'var(--forest)', flexShrink: 0 }}>{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
            <span>Subtotale</span><span>{formatPrice(cart.subtotal)}</span>
          </div>
          {cart.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#16a34a' }}>
              <span>Sconto ({cart.coupon?.code})</span>
              <span>−{formatPrice(cart.discountAmount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--forest)', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
            <span>Totale</span><span>{formatPrice(cart.total)}</span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-4)', fontSize: '0.6875rem' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Pagamento sicuro con Stripe
        </div>
      </div>

      <style>{`
        @media (min-width: 700px) {
          .checkout-grid { grid-template-columns: 1fr 340px !important; }
        }
      `}</style>
    </div>
  )
}

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError(null)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/checkout/successo` },
    })
    if (error) setError(error.message ?? 'Errore nel pagamento')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PaymentElement />
      {error && (
        <p style={{ fontSize: '0.8125rem', color: '#dc2626', padding: '0.625rem 0.875rem', background: '#fff5f5', border: '1px solid #fecaca' }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !stripe}
        style={{
          width: '100%', padding: '0.9375rem',
          background: loading || !stripe ? 'var(--ink-4)' : 'var(--forest)',
          color: 'white', border: 'none', cursor: loading || !stripe ? 'not-allowed' : 'pointer',
          fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
        }}
      >
        {loading ? 'Elaborazione…' : 'Conferma e paga'}
      </button>
    </form>
  )
}
