'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { validateCoupon } from '@/lib/actions/coupon'
import {
  createDirectOrder,
  createPaymentIntent,
  hashPasswordForCheckout,
} from '@/lib/actions/checkout'
import { computeOrderTotals, isDomesticCountry, type PricingConfig } from '@/lib/domain/pricing'
import { toCustomerRole } from '@/lib/domain/roles'
import { ISLAND_PROVINCES } from '@/lib/countries'
import type { DeliveryType, DocType, PickupCarrier, ShippingAddress } from '@/types/checkout'

/**
 * Stato e regole del checkout.
 *
 * Estratto da CheckoutClient, che teneva insieme stato, validazione, calcolo
 * prezzi, invio ordine e ottocento righe di markup. Qui non c'è presentazione:
 * il componente si limita a leggere questi valori.
 */

export type PayMethod = 'stripe' | 'bonifico' | 'contrassegno'

export interface CheckoutPrefill {
  firstName: string
  lastName: string
  phone: string
  fiscalCode: string
  company: string
  vatNumber: string
  pec: string
  sdiCode: string
  address: string
  city: string
  postalCode: string
  province: string
  country: string
}

export const PHONE_PREFIXES = [
  { country: 'Italia', code: '+39', flag: '🇮🇹' },
  { country: 'Francia', code: '+33', flag: '🇫🇷' },
  { country: 'Germania', code: '+49', flag: '🇩🇪' },
  { country: 'Spagna', code: '+34', flag: '🇪🇸' },
  { country: 'Portogallo', code: '+351', flag: '🇵🇹' },
  { country: 'Regno Unito', code: '+44', flag: '🇬🇧' },
  { country: 'Svizzera', code: '+41', flag: '🇨🇭' },
  { country: 'Austria', code: '+43', flag: '🇦🇹' },
] as const

/** Separa il prefisso internazionale dal numero salvato nel profilo. */
function splitPhone(saved: string) {
  const trimmed = saved.trim()
  const prefix = PHONE_PREFIXES.find(({ code }) => trimmed.startsWith(code))
  return {
    prefix: prefix?.code ?? '+39',
    number: prefix ? trimmed.slice(prefix.code.length).trim() : trimmed,
  }
}

export function useCheckoutForm(pricing: PricingConfig, prefill?: CheckoutPrefill) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const { data: session } = useSession()
  const cart = useCart()

  const savedPhone = useMemo(() => splitPhone(prefill?.phone ?? ''), [prefill?.phone])

  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [proceedError, setProceedError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const [phonePrefix, setPhonePrefix] = useState<string>(savedPhone.prefix)
  const [address, setAddress] = useState({
    firstName: prefill?.firstName ?? '',
    lastName: prefill?.lastName ?? '',
    company: prefill?.company ?? '',
    vatNumber: prefill?.vatNumber ?? '',
    fiscalCode: prefill?.fiscalCode ?? '',
    sdiCode: prefill?.sdiCode ?? '',
    pec: prefill?.pec ?? '',
    address: prefill?.address ?? '',
    city: prefill?.city ?? '',
    postalCode: prefill?.postalCode ?? '',
    province: prefill?.province ?? '',
    country: prefill?.country ?? 'IT',
    phone: savedPhone.number,
    shippingNotes: '',
  })

  const [docType, setDocType] = useState<DocType>('nessuno')
  const [payMethod, setPayMethod] = useState<PayMethod>('stripe')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('home')
  const [pickupCarrier, setPickupCarrier] = useState<PickupCarrier>('BRT')
  const [pickupPointCode, setPickupPointCode] = useState('')
  const [pickupPointAddress, setPickupPointAddress] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [createAccount, setCreateAccount] = useState(false)
  const [guestPassword, setGuestPassword] = useState('')
  const [saveForNextTime, setSaveForNextTime] = useState(false)
  const [billingDifferent, setBillingDifferent] = useState(false)
  const [billing, setBilling] = useState({
    firstName: '',
    lastName: '',
    company: '',
    vatNumber: '',
    fiscalCode: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    country: 'IT',
  })

  // Per le isole italiane il ritiro BRT non è offerto: si forza Poste Italiane.
  const isIsland =
    address.country === 'IT' &&
    (ISLAND_PROVINCES as readonly string[]).includes(address.province.trim().toUpperCase())
  const effectiveCarrier: PickupCarrier = isIsland ? 'POSTE' : pickupCarrier
  const isBrtPickup = deliveryType === 'pickup' && effectiveCarrier === 'BRT'

  // BRT richiede mail e telefono del destinatario per la consegna in Fermopoint.
  useEffect(() => {
    if (isBrtPickup && payMethod === 'contrassegno') {
      setPayMethod('stripe')
    }
  }, [isBrtPickup, payMethod])

  const baseOk = !!(
    address.firstName &&
    address.lastName &&
    address.address &&
    address.city &&
    address.postalCode
  )
  const docOk =
    docType === 'nessuno' ||
    docType === 'scontrino' ||
    (docType === 'fattura' &&
      !!(address.company && address.vatNumber && (address.sdiCode || address.pec)))
  const pickupOk =
    deliveryType === 'home' || (!!pickupPointAddress.trim() && !!address.phone.trim())
  const canProceed = baseOk && docOk && pickupOk

  // Anteprima: il totale definitivo viene ricalcolato dal server alla creazione
  // dell'ordine, con questa stessa funzione.
  const totals = useMemo(
    () =>
      computeOrderTotals(
        {
          items: cart.items,
          coupon: cart.coupon,
          country: address.country,
          paymentMethod: payMethod,
        },
        pricing
      ),
    [cart.items, cart.coupon, address.country, payMethod, pricing]
  )

  const isCod = payMethod === 'contrassegno'
  const isEstero = !isDomesticCountry(address.country)

  /** Un solo handler stabile per entrambi i picker, invece di due funzioni inline. */
  const selectPickupPoint = useCallback((code: string, addressLabel: string) => {
    setPickupPointCode(code)
    setPickupPointAddress(addressLabel)
  }, [])

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    const result = await validateCoupon(
      couponInput,
      cart.items,
      toCustomerRole(session?.user?.role)
    )
    if (!result.valid) setCouponError(t(result.errorKey ?? 'coupon_error_invalid', result.errorVars))
    else if (result.coupon) {
      cart.applyCoupon(result.coupon)
      setCouponInput('')
    }
    setCouponLoading(false)
  }

  /** Dati d'ordine inviati al server. Spedizione e sovrapprezzi non sono inclusi: li ricalcola il server. */
  async function buildOrderAddress(): Promise<ShippingAddress> {
    const guestPasswordHash =
      !session && createAccount && guestPassword
        ? await hashPasswordForCheckout(guestPassword)
        : undefined
    const isPickup = deliveryType === 'pickup'

    return {
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

    const orderAddress = await buildOrderAddress()

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

  return {
    session,
    cart,
    step,
    setStep,
    clientSecret,
    loading,
    pending,
    proceedError,
    couponInput,
    setCouponInput,
    couponError,
    couponLoading,
    applyCoupon,
    phonePrefix,
    setPhonePrefix,
    address,
    setAddress,
    billing,
    setBilling,
    billingDifferent,
    setBillingDifferent,
    docType,
    setDocType,
    payMethod,
    setPayMethod,
    deliveryType,
    setDeliveryType,
    pickupCarrier,
    setPickupCarrier,
    isIsland,
    effectiveCarrier,
    isBrtPickup,
    pickupPointCode,
    setPickupPointCode,
    pickupPointAddress,
    setPickupPointAddress,
    selectPickupPoint,
    guestEmail,
    setGuestEmail,
    createAccount,
    setCreateAccount,
    guestPassword,
    setGuestPassword,
    saveForNextTime,
    setSaveForNextTime,
    canProceed,
    totals,
    isCod,
    isEstero,
    handleProceed,
  }
}
