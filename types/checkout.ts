/** Tipi del flusso di checkout, condivisi fra client, azioni e dominio. */

export type DocType = 'fattura' | 'scontrino' | 'nessuno'
export type DeliveryType = 'home' | 'pickup'
export type PickupCarrier = 'BRT' | 'POSTE'

/**
 * Dati raccolti nel checkout: spedizione, fatturazione, ritiro e, per gli
 * ospiti, la creazione facoltativa dell'account.
 */
export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  vatNumber?: string
  fiscalCode?: string
  sdiCode?: string
  pec?: string
  docType?: DocType | null
  address: string
  city: string
  postalCode: string
  province?: string
  country: string
  phone?: string
  shippingNotes?: string
  deliveryType?: DeliveryType
  pickupCarrier?: PickupCarrier | null
  pickupPointCode?: string
  pickupPointAddress?: string
  billingDifferent?: boolean
  billingFirstName?: string
  billingLastName?: string
  billingCompany?: string
  billingVatNumber?: string
  billingFiscalCode?: string
  billingAddress?: string
  billingCity?: string
  billingPostalCode?: string
  billingProvince?: string
  billingCountry?: string
  saveForNextTime?: boolean
  guestEmail?: string
  createAccount?: boolean
  guestPasswordHash?: string
}
