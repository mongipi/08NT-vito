'use server'

import { getSettingsMap } from '@/lib/settings'

export async function getShippingConfig() {
  const settings = await getSettingsMap()
  return {
    threshold:       parseFloat(settings['SPEDIZIONE_GRATUITA'] ?? '50')  || 50,
    price:           parseFloat(settings['PREZZO_SPEDIZIONE']   ?? '5.90') || 5.90,
    foreignSurcharge: parseFloat(settings['SUPPLEMENTO_ESTERO'] ?? '10')  || 10,
  }
}
