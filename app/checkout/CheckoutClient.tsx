'use client'

import { useState, useTransition } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/contexts/CartContext'
import { validateCoupon } from '@/lib/actions/coupon'
import { createPaymentIntent, createDirectOrder, hashPasswordForCheckout } from '@/lib/actions/checkout'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/cart'
import Link from 'next/link'
import { COUNTRIES, DOMESTIC_COUNTRIES, ISLAND_PROVINCES } from '@/lib/countries'

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

const ADDRESS_FIELDS = [
  { key: 'address',    label: 'Indirizzo',           required: true },
  { key: 'city',       label: 'Città',               required: true },
  { key: 'postalCode', label: 'CAP',                 required: true },
  { key: 'province',   label: 'Provincia (es. BA)',  required: false },
  { key: 'phone',      label: 'Telefono (opzionale)',required: false },
] as const

type DocType = 'fattura' | 'scontrino' | 'nessuno'
type PayMethod = 'stripe' | 'bonifico' | 'contrassegno'

interface Prefill {
  firstName: string; lastName: string; phone: string
  fiscalCode: string; company: string; vatNumber: string; pec: string; sdiCode: string
  address: string; city: string; postalCode: string; province: string; country: string
}

export function CheckoutClient({
  prefill,
  codSurcharge     = 5,
  shippingThreshold = 50,
  shippingPrice     = 5.90,
  foreignSurcharge  = 10,
}: {
  prefill?: Prefill
  codSurcharge?: number
  shippingThreshold?: number
  shippingPrice?: number
  foreignSurcharge?: number
}) {
  const PAY_METHODS: { value: PayMethod; label: string; desc: string }[] = [
    { value: 'stripe',       label: 'Carta / PayPal / Google Pay / Apple Pay', desc: 'Pagamento online sicuro con Stripe' },
    { value: 'bonifico',     label: 'Bonifico bancario',                        desc: 'Riceverai IBAN e causale dopo la conferma' },
    { value: 'contrassegno', label: 'Contrassegno',                             desc: `Paghi in contanti al corriere (+€${codSurcharge.toFixed(2)} supplemento)` },
  ]
  const { data: session } = useSession()
  const cart = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [proceedError, setProceedError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [address, setAddress] = useState({
    firstName:  prefill?.firstName  ?? '',
    lastName:   prefill?.lastName   ?? '',
    company:    prefill?.company    ?? '',
    vatNumber:  prefill?.vatNumber  ?? '',
    fiscalCode: prefill?.fiscalCode ?? '',
    sdiCode:    prefill?.sdiCode    ?? '',
    pec:        prefill?.pec        ?? '',
    address:    prefill?.address    ?? '',
    city:       prefill?.city       ?? '',
    postalCode: prefill?.postalCode ?? '',
    province:   prefill?.province   ?? '',
    country:       prefill?.country ?? 'IT',
    phone:         prefill?.phone      ?? '',
    shippingNotes: '',
  })
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [docType, setDocType] = useState<DocType>('nessuno')
  const [payMethod, setPayMethod] = useState<PayMethod>('stripe')
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home')
  const [pickupCarrier, setPickupCarrier] = useState<'BRT' | 'POSTE'>('BRT')
  const [pickupPointCode, setPickupPointCode] = useState('')
  const [pickupPointAddress, setPickupPointAddress] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [createAccount, setCreateAccount] = useState(false)
  const [guestPassword, setGuestPassword] = useState('')
  const [saveForNextTime, setSaveForNextTime] = useState(false)
  const [billingDifferent, setBillingDifferent] = useState(false)
  const [billing, setBilling] = useState({
    firstName: '', lastName: '', company: '', vatNumber: '', fiscalCode: '',
    address: '', city: '', postalCode: '', province: '', country: 'IT',
  })

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
    if (!session && !guestEmail.includes('@')) {
      setProceedError('Inserisci un indirizzo email valido per continuare.')
      return
    }
    if (!session && createAccount && guestPassword.length < 8) {
      setProceedError('La password deve essere di almeno 8 caratteri.')
      return
    }
    setProceedError(null)

    const guestPasswordHash = (!session && createAccount && guestPassword)
      ? await hashPasswordForCheckout(guestPassword)
      : undefined
    if (payMethod === 'stripe') {
      setLoading(true)
      try {
        const { clientSecret } = await createPaymentIntent(cart.items, cart.coupon, { ...address, docType, guestEmail: session ? undefined : guestEmail, createAccount: session ? undefined : createAccount, guestPasswordHash, saveForNextTime, deliveryType, pickupCarrier: deliveryType === 'pickup' ? effectiveCarrier : null, pickupPointCode: deliveryType === 'pickup' ? pickupPointCode : undefined, pickupPointAddress: deliveryType === 'pickup' ? pickupPointAddress : undefined, billingDifferent, ...(billingDifferent ? { billingFirstName: billing.firstName, billingLastName: billing.lastName, billingCompany: billing.company, billingVatNumber: billing.vatNumber, billingFiscalCode: billing.fiscalCode, billingAddress: billing.address, billingCity: billing.city, billingPostalCode: billing.postalCode, billingProvince: billing.province, billingCountry: billing.country } : {}) }, { shippingCost: shippingCostVal, foreignSurcharge: foreignSurchargeVal, freeShipping: hasFreeShip })
        setClientSecret(clientSecret!)
        setStep('payment')
      } finally {
        setLoading(false)
      }
    } else {
      startTransition(async () => {
        await createDirectOrder(cart.items, cart.coupon, { ...address, docType, guestEmail: session ? undefined : guestEmail, createAccount: session ? undefined : createAccount, guestPasswordHash, saveForNextTime, deliveryType, pickupCarrier: deliveryType === 'pickup' ? effectiveCarrier : null, pickupPointCode: deliveryType === 'pickup' ? pickupPointCode : undefined, pickupPointAddress: deliveryType === 'pickup' ? pickupPointAddress : undefined, billingDifferent, ...(billingDifferent ? { billingFirstName: billing.firstName, billingLastName: billing.lastName, billingCompany: billing.company, billingVatNumber: billing.vatNumber, billingFiscalCode: billing.fiscalCode, billingAddress: billing.address, billingCity: billing.city, billingPostalCode: billing.postalCode, billingProvince: billing.province, billingCountry: billing.country } : {}) }, payMethod, { shippingCost: shippingCostVal, foreignSurcharge: foreignSurchargeVal, freeShipping: hasFreeShip })
      })
    }
  }

  const isIsland = address.country === 'IT' && (ISLAND_PROVINCES as readonly string[]).includes(address.province.trim().toUpperCase())
  const effectiveCarrier: 'BRT' | 'POSTE' = isIsland ? 'POSTE' : pickupCarrier

  const baseOk = !!(address.firstName && address.lastName && address.address && address.city && address.postalCode)
  const docOk = docType === 'nessuno' || docType === 'scontrino' || (docType === 'fattura' && !!(address.company && address.vatNumber && (address.sdiCode || address.pec)))
  const pickupOk = deliveryType === 'home' || !!pickupPointAddress.trim()
  const canProceed = baseOk && docOk && pickupOk

  const isCod          = payMethod === 'contrassegno'
  const isEstero       = !(DOMESTIC_COUNTRIES as readonly string[]).includes(address.country)
  const hasFreeShip    = cart.total >= shippingThreshold
  const shippingCostVal    = hasFreeShip ? 0 : shippingPrice
  const foreignSurchargeVal = isEstero ? foreignSurcharge : 0
  const baseShipping   = shippingCostVal + foreignSurchargeVal
  const displayTotal   = cart.total + (isCod ? codSurcharge : 0) + baseShipping

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
              Dati e spedizione
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Email ospite */}
              {!session && (
                <div>
                  <label style={labelStyle}>Email<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    style={inputStyle}
                    placeholder="nome@email.it"
                    required
                  />
                  <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: '0.375rem' }}>
                    Riceverai la conferma dell&apos;ordine a questo indirizzo.{' '}
                    <a href="/login" style={{ color: 'var(--forest)', textDecoration: 'underline' }}>Hai già un account?</a>
                  </p>
                </div>
              )}

              {/* Crea account opzionale per ospiti */}
              {!session && (
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--ink)', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={e => setCreateAccount(e.target.checked)}
                      style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem' }}
                    />
                    Crea un account con questi dati
                  </label>
                  {createAccount && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={labelStyle}>Password<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input
                        type="password"
                        value={guestPassword}
                        onChange={e => setGuestPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Minimo 8 caratteri"
                        autoComplete="new-password"
                      />
                      <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: '0.375rem' }}>
                        Potrai accedere con questa email e password per consultare i tuoi ordini.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Nome + Cognome */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {(['firstName', 'lastName'] as const).map((key) => (
                  <div key={key}>
                    <label style={labelStyle}>{key === 'firstName' ? 'Nome' : 'Cognome'}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                    <input type="text" value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
              </div>

              {/* Documento fiscale */}
              <div style={{ paddingTop: '0.25rem' }}>
                <p style={{ ...labelStyle, marginBottom: '0.625rem' }}>Documento fiscale</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {([
                    { value: 'nessuno',   label: 'Nessun documento' },
                    { value: 'scontrino', label: 'Scontrino' },
                    { value: 'fattura',   label: 'Fattura' },
                  ] as { value: DocType; label: string }[]).map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--ink)', cursor: 'pointer' }}>
                      <input
                        type="radio" name="docType" value={opt.value}
                        checked={docType === opt.value}
                        onChange={() => setDocType(opt.value)}
                        style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>

                {docType === 'scontrino' && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={labelStyle}>Codice fiscale <span style={{ color: 'var(--ink-4)', fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(opzionale)</span></label>
                    <input type="text" value={address.fiscalCode} onChange={e => setAddress(a => ({ ...a, fiscalCode: e.target.value }))} style={inputStyle} placeholder="RSSMRA80A01H501U" />
                  </div>
                )}

                {docType === 'fattura' && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Ragione sociale<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input type="text" value={address.company} onChange={e => setAddress(a => ({ ...a, company: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>C. FISCALE o Partita IVA<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input type="text" value={address.vatNumber} onChange={e => setAddress(a => ({ ...a, vatNumber: e.target.value }))} style={inputStyle} placeholder="IT12345678901" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>Codice SDI</label>
                        <input type="text" value={address.sdiCode} onChange={e => setAddress(a => ({ ...a, sdiCode: e.target.value }))} style={inputStyle} placeholder="XXXXXXX" maxLength={7} />
                      </div>
                      <div>
                        <label style={labelStyle}>PEC</label>
                        <input type="email" value={address.pec} onChange={e => setAddress(a => ({ ...a, pec: e.target.value }))} style={inputStyle} placeholder="pec@esempio.it" />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', margin: 0 }}>Inserisci almeno Codice SDI oppure PEC.</p>
                  </div>
                )}
              </div>

              {/* Separatore */}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.25rem' }} />

              {/* Indirizzo di spedizione */}
              {ADDRESS_FIELDS.map(({ key, label, required }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
                  <input type="text" value={address[key as keyof typeof address]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} style={inputStyle} />
                </div>
              ))}

              {/* Paese */}
              <div>
                <label style={labelStyle}>Paese di spedizione</label>
                <select
                  value={address.country}
                  onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
                {isEstero && (
                  <p style={{ fontSize: '0.6875rem', color: '#b45309', marginTop: '0.375rem' }}>
                    Supplemento spedizione estera: +€{foreignSurcharge.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Indirizzo di fatturazione */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--ink)', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={billingDifferent}
                    onChange={e => setBillingDifferent(e.target.checked)}
                    style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem' }}
                  />
                  L&apos;indirizzo di fatturazione è diverso da quello di spedizione
                </label>

                {billingDifferent && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#f9faf8', border: '1px solid var(--border)' }}>
                    <p style={{ ...labelStyle, margin: 0 }}>Indirizzo di fatturazione</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {(['firstName', 'lastName'] as const).map(k => (
                        <div key={k}>
                          <label style={labelStyle}>{k === 'firstName' ? 'Nome' : 'Cognome'}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                          <input type="text" value={billing[k]} onChange={e => setBilling(b => ({ ...b, [k]: e.target.value }))} style={inputStyle} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={labelStyle}>Azienda <span style={{ color: 'var(--ink-4)', fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(opzionale)</span></label>
                      <input type="text" value={billing.company} onChange={e => setBilling(b => ({ ...b, company: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>C. FISCALE o Partita IVA <span style={{ color: 'var(--ink-4)', fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(opzionale)</span></label>
                      <input type="text" value={billing.vatNumber || billing.fiscalCode} onChange={e => setBilling(b => ({ ...b, vatNumber: e.target.value }))} style={inputStyle} placeholder="IT12345678901 o RSSMRA80A01H501U" />
                    </div>
                    <div>
                      <label style={labelStyle}>Indirizzo<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input type="text" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} style={inputStyle} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>CAP<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                        <input type="text" value={billing.postalCode} onChange={e => setBilling(b => ({ ...b, postalCode: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Città<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                        <input type="text" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Prov.</label>
                        <input type="text" value={billing.province} onChange={e => setBilling(b => ({ ...b, province: e.target.value }))} style={inputStyle} placeholder="BA" maxLength={2} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Paese</label>
                      <select value={billing.country} onChange={e => setBilling(b => ({ ...b, country: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Salva per il prossimo ordine */}
              {session && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--ink)', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={saveForNextTime}
                    onChange={e => setSaveForNextTime(e.target.checked)}
                    style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem' }}
                  />
                  Salva i dati per il prossimo ordine
                </label>
              )}

              {/* Note spedizione */}
              <div>
                <label style={labelStyle}>Note per la spedizione <span style={{ color: 'var(--ink-4)', fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(opzionale)</span></label>
                <textarea
                  value={address.shippingNotes}
                  onChange={e => setAddress(a => ({ ...a, shippingNotes: e.target.value }))}
                  placeholder="Citofono, piano, orari preferiti, istruzioni per il corriere…"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            {/* Modalità di consegna */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>Modalità di consegna</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {([
                  { value: 'home',   label: 'Consegna a domicilio',   desc: 'Il corriere consegna all\'indirizzo indicato' },
                  { value: 'pickup', label: 'Ritiro in punto di ritiro', desc: 'Scegli un punto BRT o Poste Italiane vicino a te' },
                ] as { value: 'home' | 'pickup'; label: string; desc: string }[]).map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
                    padding: '0.875rem 1rem',
                    border: deliveryType === opt.value ? '1.5px solid var(--forest)' : '1px solid var(--border)',
                    background: deliveryType === opt.value ? '#f8faf9' : 'white',
                  }}>
                    <input
                      type="radio" name="deliveryType" value={opt.value}
                      checked={deliveryType === opt.value}
                      onChange={() => setDeliveryType(opt.value)}
                      style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }}
                    />
                    <span>
                      <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.1875rem' }}>{opt.label}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-4)', fontWeight: 300 }}>{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>

              {deliveryType === 'pickup' && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', padding: '1rem', background: '#f9faf8', border: '1px solid var(--border)' }}>
                  {/* Scelta corriere */}
                  {isIsland ? (
                    <div style={{ fontSize: '0.75rem', color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '0.625rem 0.875rem' }}>
                      Per le isole è disponibile solo <strong>Poste Italiane</strong> come punto di ritiro.
                    </div>
                  ) : (
                    <div>
                      <p style={{ ...labelStyle, marginBottom: '0.5rem' }}>Corriere</p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {(['BRT', 'POSTE'] as const).map(c => (
                          <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                            <input
                              type="radio" name="pickupCarrier" value={c}
                              checked={pickupCarrier === c}
                              onChange={() => setPickupCarrier(c)}
                              style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem' }}
                            />
                            {c === 'BRT' ? 'BRT Fermopoint' : 'Poste Italiane'}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Link locator corriere */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink-3)', lineHeight: 1.6 }}>
                    Trova il punto più vicino a te:&nbsp;
                    {effectiveCarrier === 'BRT' ? (
                      <a href="https://www.brt.it/it/servizi/fermopoint.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--forest)', fontWeight: 500 }}>
                        BRT Fermopoint →
                      </a>
                    ) : (
                      <a href="https://www.poste.it/cerca/index.html#/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--forest)', fontWeight: 500 }}>
                        Punti Poste Italiane →
                      </a>
                    )}
                  </div>

                  {/* Inserimento punto */}
                  <div>
                    <label style={labelStyle}>
                      Indirizzo punto di ritiro<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={pickupPointAddress}
                      onChange={e => setPickupPointAddress(e.target.value)}
                      placeholder={effectiveCarrier === 'BRT' ? 'es. Fermopoint Via Roma 1, Milano' : 'es. Ufficio Postale Via Roma 1, Palermo'}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Codice punto <span style={{ color: 'var(--ink-4)', fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(opzionale)</span></label>
                    <input
                      type="text"
                      value={pickupPointCode}
                      onChange={e => setPickupPointCode(e.target.value)}
                      placeholder="es. MI0042"
                      style={{ ...inputStyle, fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              )}
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

            {/* Metodo di pagamento */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>Metodo di pagamento</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PAY_METHODS.map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer',
                    padding: '0.875rem 1rem',
                    border: payMethod === opt.value ? '1.5px solid var(--forest)' : '1px solid var(--border)',
                    background: payMethod === opt.value ? '#f8faf9' : 'white',
                  }}>
                    <input
                      type="radio" name="payMethod" value={opt.value}
                      checked={payMethod === opt.value}
                      onChange={() => setPayMethod(opt.value)}
                      style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }}
                    />
                    <span>
                      <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.1875rem' }}>{opt.label}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-4)', fontWeight: 300 }}>{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={!canProceed || loading || pending}
              style={{
                marginTop: '1.75rem', width: '100%', padding: '0.9375rem',
                background: canProceed && !loading && !pending ? 'var(--forest)' : 'var(--ink-4)',
                color: 'white', border: 'none', cursor: canProceed && !loading && !pending ? 'pointer' : 'not-allowed',
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              }}
            >
              {loading || pending
                ? 'Elaborazione…'
                : payMethod === 'stripe'
                  ? 'Procedi al pagamento →'
                  : 'Conferma ordine →'}
            </button>
            {proceedError && (
              <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.75rem', textAlign: 'center' }}>
                {proceedError}
              </p>
            )}
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
          {/* Spedizione */}
          {baseShipping === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#16a34a' }}>
              <span>Spedizione</span><span>Gratuita</span>
            </div>
          ) : (
            <>
              {!isEstero && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                  <span>Spedizione</span><span>+{formatPrice(shippingPrice)}</span>
                </div>
              )}
              {isEstero && cart.total >= shippingThreshold && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                  <span>Supplemento estero</span><span>+{formatPrice(foreignSurcharge)}</span>
                </div>
              )}
              {isEstero && cart.total < shippingThreshold && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                    <span>Spedizione</span><span>+{formatPrice(shippingPrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                    <span>Supplemento estero</span><span>+{formatPrice(foreignSurcharge)}</span>
                  </div>
                </>
              )}
            </>
          )}
          {isCod && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
              <span>Supplemento contrassegno</span>
              <span>+{formatPrice(codSurcharge)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--forest)', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
            <span>Totale</span><span>{formatPrice(displayTotal)}</span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-4)', fontSize: '0.6875rem' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {payMethod === 'stripe' ? 'Pagamento sicuro con Stripe' : payMethod === 'bonifico' ? 'Riceverai le coordinate bancarie via email' : 'Paghi in contanti alla consegna'}
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
