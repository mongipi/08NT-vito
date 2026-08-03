'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/contexts/CartContext'
import { validateCoupon } from '@/lib/actions/coupon'
import { createPaymentIntent, createDirectOrder, hashPasswordForCheckout } from '@/lib/actions/checkout'
import type { ShippingAddress } from '@/lib/actions/checkout'
import { useSession } from 'next-auth/react'
import { formatPrice } from '@/lib/cart'
import Link from 'next/link'
import { COUNTRIES, ISLAND_PROVINCES } from '@/lib/countries'
import { computeOrderTotals, isDomesticCountry, type PricingConfig } from '@/lib/domain/pricing'
import { BrtFermopointPicker } from './BrtFermopointPicker'
import { PosteLockerPicker } from './PosteLockerPicker'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'

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

const PHONE_PREFIXES = [
  { country: 'Italia', code: '+39', flag: '🇮🇹' },
  { country: 'Francia', code: '+33', flag: '🇫🇷' },
  { country: 'Germania', code: '+49', flag: '🇩🇪' },
  { country: 'Spagna', code: '+34', flag: '🇪🇸' },
  { country: 'Portogallo', code: '+351', flag: '🇵🇹' },
  { country: 'Regno Unito', code: '+44', flag: '🇬🇧' },
  { country: 'Svizzera', code: '+41', flag: '🇨🇭' },
  { country: 'Austria', code: '+43', flag: '🇦🇹' },
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
  pricing,
}: {
  prefill?: Prefill
  /** Configurazione gestita da /admin/impostazioni, letta dal server. */
  pricing: PricingConfig
}) {
  const { codSurcharge, shippingThreshold, shippingPrice, foreignSurcharge } = pricing
  const { locale } = useLocale()
  const t = useTranslation(locale)

  const ADDRESS_FIELDS = [
    { key: 'address',    label: t('checkout_address'),    required: true,  placeholder: t('checkout_address_placeholder') },
    { key: 'city',       label: t('checkout_city'),        required: true,  placeholder: t('checkout_city_placeholder') },
    { key: 'postalCode', label: t('checkout_postal_code'), required: true,  placeholder: t('checkout_postal_code_placeholder') },
    { key: 'province',   label: t('checkout_province'),    required: false, placeholder: t('checkout_province_placeholder') },
  ] as const

  const PAY_METHODS: { value: PayMethod; label: string; desc: string }[] = [
    { value: 'stripe',       label: t('checkout_pay_stripe_label'), desc: t('checkout_pay_stripe_desc') },
    { value: 'bonifico',     label: t('checkout_pay_bank_label'),   desc: t('checkout_pay_bank_desc') },
    { value: 'contrassegno', label: t('checkout_pay_cod_label'),    desc: t('checkout_pay_cod_desc', { amount: `€${codSurcharge.toFixed(2)}` }) },
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
  const savedPhone = prefill?.phone?.trim() ?? ''
  const savedPhonePrefix = PHONE_PREFIXES.find(({ code }) => savedPhone.startsWith(code))
  const savedPhoneNumber = savedPhonePrefix ? savedPhone.slice(savedPhonePrefix.code.length).trim() : savedPhone
  const [phonePrefix, setPhonePrefix] = useState<string>(savedPhonePrefix?.code ?? '+39')
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
    phone:         savedPhoneNumber,
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
      setProceedError(t('checkout_error_email'))
      return
    }
    if (!session && createAccount && guestPassword.length < 8) {
      setProceedError(t('checkout_error_password'))
      return
    }
    setProceedError(null)

    const guestPasswordHash = (!session && createAccount && guestPassword)
      ? await hashPasswordForCheckout(guestPassword)
      : undefined
    const isPickup = deliveryType === 'pickup'
    const orderAddress: ShippingAddress = {
      ...address,
      phone: address.phone.trim() ? `${phonePrefix} ${address.phone.trim()}` : '',
      docType,
      guestEmail: session ? undefined : guestEmail,
      createAccount: session ? undefined : createAccount,
      guestPasswordHash,
      saveForNextTime,
      deliveryType,
      pickupCarrier: isPickup ? effectiveCarrier : null,
      pickupPointCode: isPickup ? pickupPointCode : undefined,
      pickupPointAddress: isPickup ? pickupPointAddress : undefined,
      billingDifferent,
      ...(billingDifferent
        ? {
            billingFirstName: billing.firstName,
            billingLastName: billing.lastName,
            billingCompany: billing.company,
            billingVatNumber: billing.vatNumber,
            billingFiscalCode: billing.fiscalCode,
            billingAddress: billing.address,
            billingCity: billing.city,
            billingPostalCode: billing.postalCode,
            billingProvince: billing.province,
            billingCountry: billing.country,
          }
        : {}),
    }

    // Spedizione e sovrapprezzi non vengono inviati: li ricalcola il server.
    if (payMethod === 'stripe') {
      setLoading(true)
      try {
        const { clientSecret } = await createPaymentIntent(cart.items, cart.coupon, orderAddress)
        setClientSecret(clientSecret!)
        setStep('payment')
      } finally {
        setLoading(false)
      }
    } else {
      startTransition(async () => {
        await createDirectOrder(cart.items, cart.coupon, orderAddress, payMethod)
      })
    }
  }

  const isIsland = address.country === 'IT' && (ISLAND_PROVINCES as readonly string[]).includes(address.province.trim().toUpperCase())
  const effectiveCarrier: 'BRT' | 'POSTE' = isIsland ? 'POSTE' : pickupCarrier
  const isBrtPickup = deliveryType === 'pickup' && effectiveCarrier === 'BRT'

  const baseOk = !!(address.firstName && address.lastName && address.address && address.city && address.postalCode)
  const docOk = docType === 'nessuno' || docType === 'scontrino' || (docType === 'fattura' && !!(address.company && address.vatNumber && (address.sdiCode || address.pec)))
  const pickupOk = deliveryType === 'home' || !!pickupPointAddress.trim()
  const canProceed = baseOk && docOk && pickupOk

  // Anteprima: il totale definitivo viene comunque ricalcolato dal server alla
  // creazione dell'ordine, usando questa stessa funzione.
  const totals = useMemo(
    () =>
      computeOrderTotals(
        { items: cart.items, coupon: cart.coupon, country: address.country, paymentMethod: payMethod },
        pricing
      ),
    [cart.items, cart.coupon, address.country, payMethod, pricing]
  )
  const isCod        = payMethod === 'contrassegno'
  const isEstero     = !isDomesticCountry(address.country)
  const baseShipping = totals.shippingCost + totals.foreignSurcharge
  const displayTotal = totals.total

  useEffect(() => {
    if (isBrtPickup && payMethod === 'contrassegno') {
      setPayMethod('stripe')
    }
  }, [isBrtPickup, payMethod])

  if (cart.itemCount === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--ink-3)', marginBottom: '1.5rem', fontWeight: 300 }}>{t('checkout_empty')}</p>
        <Link href="/prodotti" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: 'var(--forest)', color: 'white', textDecoration: 'none', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {t('checkout_go_to_products')}
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
              {t('checkout_data_shipping')}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Email ospite */}
              {!session && (
                <div>
                  <label style={labelStyle}>{t('checkout_email')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    style={inputStyle}
                    placeholder={t('checkout_email_placeholder')}
                    required
                  />
                  <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: '0.375rem' }}>
                    {t('checkout_email_note')}{' '}
                    <a href="/login" style={{ color: 'var(--forest)', textDecoration: 'underline' }}>{t('checkout_already_account')}</a>
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
                    {t('checkout_create_account')}
                  </label>
                  {createAccount && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={labelStyle}>{t('checkout_password')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input
                        type="password"
                        value={guestPassword}
                        onChange={e => setGuestPassword(e.target.value)}
                        style={inputStyle}
                        placeholder={t('checkout_password_placeholder')}
                        autoComplete="new-password"
                      />
                      <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', marginTop: '0.375rem' }}>
                        {t('checkout_password_note')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Nome + Cognome */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {(['firstName', 'lastName'] as const).map((key) => (
                  <div key={key}>
                    <label style={labelStyle}>{key === 'firstName' ? t('checkout_first_name') : t('checkout_last_name')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                    <input type="text" value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} style={inputStyle} placeholder={key === 'firstName' ? t('checkout_first_name_placeholder') : t('checkout_last_name_placeholder')} />
                  </div>
                ))}
              </div>

              {/* Documento fiscale */}
              <div style={{ paddingTop: '0.25rem' }}>
                <p style={{ ...labelStyle, marginBottom: '0.625rem' }}>{t('checkout_fiscal_doc')}</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {([
                    { value: 'nessuno',   label: t('checkout_doc_none') },
                    { value: 'scontrino', label: t('checkout_doc_receipt') },
                    { value: 'fattura',   label: t('checkout_doc_invoice') },
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
                    <label style={labelStyle}>{t('checkout_fiscal_code_optional')}</label>
                    <input type="text" value={address.fiscalCode} onChange={e => setAddress(a => ({ ...a, fiscalCode: e.target.value }))} style={inputStyle} placeholder={t('checkout_fiscal_code_placeholder')} />
                  </div>
                )}

                {docType === 'fattura' && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>{t('checkout_company')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input type="text" value={address.company} onChange={e => setAddress(a => ({ ...a, company: e.target.value }))} style={inputStyle} placeholder={t('checkout_company_placeholder')} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('checkout_vat')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input type="text" value={address.vatNumber} onChange={e => setAddress(a => ({ ...a, vatNumber: e.target.value }))} style={inputStyle} placeholder={t('checkout_vat_placeholder')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>{t('checkout_sdi_code')}</label>
                        <input type="text" value={address.sdiCode} onChange={e => setAddress(a => ({ ...a, sdiCode: e.target.value }))} style={inputStyle} placeholder={t('checkout_sdi_code')} maxLength={7} />
                      </div>
                      <div>
                        <label style={labelStyle}>{t('checkout_pec')}</label>
                        <input type="email" value={address.pec} onChange={e => setAddress(a => ({ ...a, pec: e.target.value }))} style={inputStyle} placeholder="pec@azienda.test" />
                      </div>
                    </div>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--ink-4)', margin: 0 }}>{t('checkout_sdi_or_pec_note')}</p>
                  </div>
                )}
              </div>

              {/* Separatore */}
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.25rem' }} />

              {/* Indirizzo di spedizione */}
              {ADDRESS_FIELDS.map(({ key, label, required, placeholder }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
                  <input type="text" value={address[key]} onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} style={inputStyle} placeholder={placeholder} />
                </div>
              ))}

              <div>
                <label style={labelStyle}>{t('checkout_phone_optional')}</label>
                <div className="checkout-phone-row">
                  <select
                    value={phonePrefix}
                    onChange={e => setPhonePrefix(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                    aria-label={t('checkout_phone_prefix_label')}
                  >
                    {PHONE_PREFIXES.map(prefix => (
                      <option key={`${prefix.code}-${prefix.country}`} value={prefix.code}>
                        {prefix.flag} {prefix.code} {prefix.country}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                    style={inputStyle}
                    placeholder={t('checkout_phone_placeholder')}
                    inputMode="tel"
                  />
                </div>
              </div>

              {/* Paese */}
              <div>
                <label style={labelStyle}>{t('checkout_shipping_country')}</label>
                <select
                  value={address.country}
                  onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
                {isEstero && (
                  <p style={{ fontSize: '0.6875rem', color: '#b45309', marginTop: '0.375rem' }}>
                    {t('checkout_foreign_surcharge_note', { amount: `€${foreignSurcharge.toFixed(2)}` })}
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
                  {t('checkout_billing_different')}
                </label>

                {billingDifferent && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: '#f9faf8', border: '1px solid var(--border)' }}>
                    <p style={{ ...labelStyle, margin: 0 }}>{t('checkout_billing_address_title')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {(['firstName', 'lastName'] as const).map(k => (
                        <div key={k}>
                          <label style={labelStyle}>{k === 'firstName' ? t('checkout_first_name') : t('checkout_last_name')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                          <input type="text" value={billing[k]} onChange={e => setBilling(b => ({ ...b, [k]: e.target.value }))} style={inputStyle} placeholder={k === 'firstName' ? t('checkout_billing_first_name_placeholder') : t('checkout_billing_last_name_placeholder')} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={labelStyle}>{t('checkout_company_optional')}</label>
                      <input type="text" value={billing.company} onChange={e => setBilling(b => ({ ...b, company: e.target.value }))} style={inputStyle} placeholder={t('checkout_company_placeholder')} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('checkout_vat_optional')}</label>
                      <input type="text" value={billing.vatNumber || billing.fiscalCode} onChange={e => setBilling(b => ({ ...b, vatNumber: e.target.value }))} style={inputStyle} placeholder={t('checkout_vat_placeholder')} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('checkout_address')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                      <input type="text" value={billing.address} onChange={e => setBilling(b => ({ ...b, address: e.target.value }))} style={inputStyle} placeholder={t('checkout_address_placeholder')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={labelStyle}>{t('checkout_postal_code')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                        <input type="text" value={billing.postalCode} onChange={e => setBilling(b => ({ ...b, postalCode: e.target.value }))} style={inputStyle} placeholder={t('checkout_postal_code_placeholder')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{t('checkout_city')}<span style={{ color: '#ef4444', marginLeft: 2 }}>*</span></label>
                        <input type="text" value={billing.city} onChange={e => setBilling(b => ({ ...b, city: e.target.value }))} style={inputStyle} placeholder={t('checkout_billing_city_placeholder')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{t('checkout_province_short')}</label>
                        <input type="text" value={billing.province} onChange={e => setBilling(b => ({ ...b, province: e.target.value }))} style={inputStyle} placeholder={t('checkout_province_placeholder')} maxLength={2} />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>{t('checkout_country')}</label>
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
                  {t('checkout_save_next_time')}
                </label>
              )}

              {/* Note spedizione */}
              <div>
                <label style={labelStyle}>{t('checkout_shipping_notes')}</label>
                <textarea
                  value={address.shippingNotes}
                  onChange={e => setAddress(a => ({ ...a, shippingNotes: e.target.value }))}
                  placeholder={t('checkout_shipping_notes_placeholder')}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            {/* Modalità di consegna */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>{t('checkout_delivery_method')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {([
                  { value: 'home',   label: t('checkout_delivery_home'),   desc: t('checkout_delivery_home_desc') },
                  { value: 'pickup', label: t('checkout_delivery_pickup'), desc: t('checkout_delivery_pickup_desc') },
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
                      {richText(t('checkout_islands_poste_only'))}
                    </div>
                  ) : (
                    <div>
                      <p style={{ ...labelStyle, marginBottom: '0.5rem' }}>{t('checkout_carrier')}</p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {(['BRT', 'POSTE'] as const).map(c => (
                          <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                            <input
                              type="radio" name="pickupCarrier" value={c}
                              checked={pickupCarrier === c}
                              onChange={() => setPickupCarrier(c)}
                              style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem' }}
                            />
                            {c === 'BRT' ? t('checkout_carrier_brt') : t('checkout_carrier_poste')}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {effectiveCarrier === 'POSTE' ? (
                    <PosteLockerPicker
                      pickupPointCode={pickupPointCode}
                      pickupPointAddress={pickupPointAddress}
                      onSelect={(code, addr) => { setPickupPointCode(code); setPickupPointAddress(addr) }}
                      inputStyle={inputStyle}
                      labelStyle={labelStyle}
                    />
                  ) : (
                    <BrtFermopointPicker
                      pickupPointCode={pickupPointCode}
                      pickupPointAddress={pickupPointAddress}
                      onSelect={(code, addr) => { setPickupPointCode(code); setPickupPointAddress(addr) }}
                      inputStyle={inputStyle}
                      labelStyle={labelStyle}
                      postalCode={address.postalCode}
                      t={t as (key: string, vars?: Record<string, string | number>) => string}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Coupon */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <label style={labelStyle}>{t('checkout_discount_code')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder={t('checkout_discount_code_placeholder')}
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.08em' }}
                />
                <button
                  onClick={applyCoupon} disabled={couponLoading}
                  style={{ background: 'var(--paper)', border: '1px solid var(--border-2)', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', color: 'var(--ink)', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {couponLoading ? '…' : t('checkout_apply')}
                </button>
              </div>
              {couponError && <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 6 }}>{couponError}</p>}
              {cart.coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>✓ {t('checkout_code_discount_applied', { code: cart.coupon.code, amount: formatPrice(cart.discountAmount) })}</span>
                  <button onClick={cart.removeCoupon} style={{ fontSize: '0.75rem', color: 'var(--ink-4)', background: 'none', border: 'none', cursor: 'pointer' }}>{t('checkout_remove')}</button>
                </div>
              )}
            </div>

            {/* Metodo di pagamento */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ ...labelStyle, marginBottom: '0.75rem' }}>{t('checkout_payment_method')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {PAY_METHODS.map(opt => {
                  const disabled = isBrtPickup && opt.value === 'contrassegno'
                  return (
                    <label key={opt.value} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: disabled ? 'not-allowed' : 'pointer',
                      padding: '0.875rem 1rem',
                      border: payMethod === opt.value ? '1.5px solid var(--forest)' : '1px solid var(--border)',
                      background: payMethod === opt.value ? '#f8faf9' : 'white',
                      opacity: disabled ? 0.5 : 1,
                    }}>
                      <input
                        type="radio" name="payMethod" value={opt.value}
                        checked={payMethod === opt.value}
                        onChange={() => !disabled && setPayMethod(opt.value)}
                        disabled={disabled}
                        style={{ accentColor: 'var(--forest)', width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }}
                      />
                      <span>
                        <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '0.1875rem' }}>{opt.label}</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-4)', fontWeight: 300 }}>{opt.desc}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {isBrtPickup && (
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-4)', marginTop: '0.625rem', marginBottom: 0 }}>
                  {t('checkout_brt_cod_disabled')}
                </p>
              )}
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
                ? t('checkout_processing')
                : payMethod === 'stripe'
                  ? t('checkout_proceed_payment')
                  : t('checkout_confirm_order')}
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
              ← {t('checkout_edit_address')}
            </button>
            <h2 style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1.5rem' }}>
              {t('checkout_payment_title')}
            </h2>
            <Elements stripe={stripePromise} options={{ clientSecret, locale: locale === 'en' ? 'en' : 'it', appearance: { theme: 'stripe', variables: { colorPrimary: '#1a4a2e', borderRadius: '0px' } } }}>
              <PaymentForm />
            </Elements>
          </div>
        )}
      </div>

      {/* Colonna destra: riepilogo */}
      <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1.75rem', alignSelf: 'start' }}>
        <h2 style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: '1.25rem' }}>
          {t('checkout_order_summary')}
        </h2>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cart.items.map((item) => (
            <li key={item.productId + (item.variantId ?? '')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, fontSize: '0.875rem' }}>
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
            <span>{t('cart_subtotal')}</span><span>{formatPrice(cart.subtotal)}</span>
          </div>
          {cart.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#16a34a' }}>
              <span>{t('checkout_discount_with_code', { code: cart.coupon?.code ?? '' })}</span>
              <span>−{formatPrice(cart.discountAmount)}</span>
            </div>
          )}
          {/* Spedizione */}
          {baseShipping === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#16a34a' }}>
              <span>{t('cart_shipping')}</span><span>{t('checkout_free')}</span>
            </div>
          ) : (
            <>
              {totals.shippingCost > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                  <span>{t('cart_shipping')}</span><span>+{formatPrice(totals.shippingCost)}</span>
                </div>
              )}
              {totals.foreignSurcharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
                  <span>{t('checkout_foreign_surcharge')}</span><span>+{formatPrice(totals.foreignSurcharge)}</span>
                </div>
              )}
            </>
          )}
          {isCod && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
              <span>{t('checkout_cod_surcharge')}</span>
              <span>+{formatPrice(totals.codSurcharge)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--forest)', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
            <span>{t('cart_total')}</span><span>{formatPrice(displayTotal)}</span>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-4)', fontSize: '0.6875rem' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          {payMethod === 'stripe' ? t('checkout_trust_stripe') : payMethod === 'bonifico' ? t('checkout_trust_bank') : t('checkout_trust_cod')}
        </div>
      </div>

      <style>{`
        .checkout-grid input:focus::placeholder,
        .checkout-grid textarea:focus::placeholder {
          color: transparent;
        }
        .checkout-phone-row {
          display: grid;
          grid-template-columns: minmax(132px, 0.36fr) minmax(0, 1fr);
          gap: 0.5rem;
        }
        @media (max-width: 520px) {
          .checkout-phone-row {
            grid-template-columns: 1fr;
          }
        }
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
  const { locale } = useLocale()
  const t = useTranslation(locale)
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
    if (error) setError(error.message ?? t('checkout_payment_error'))
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
        {loading ? t('checkout_processing') : t('checkout_confirm_and_pay')}
      </button>
    </form>
  )
}

