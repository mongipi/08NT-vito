import type { PricingConfig } from '@/lib/domain/pricing'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'

/**
 * Legge la configurazione prezzi da /admin/impostazioni.
 * Unico punto dell'applicazione in cui queste quattro impostazioni vengono lette.
 *
 * Gli importi non hanno copie nel codice: una chiave assente, vuota o non
 * numerica vale zero. Se il database non risponde, tutti e quattro valgono zero
 * e non viene addebitato alcun costo aggiuntivo.
 */

function parseAmount(raw: string | undefined): number {
  const parsed = parseFloat(raw ?? '')
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const settings = await getSettingsMap()
  return {
    codSurcharge: parseAmount(settings[SETTING_KEYS.COD_SURCHARGE]),
    shippingThreshold: parseAmount(settings[SETTING_KEYS.SPEDIZIONE_GRATUITA]),
    shippingPrice: parseAmount(settings[SETTING_KEYS.PREZZO_SPEDIZIONE]),
    foreignSurcharge: parseAmount(settings[SETTING_KEYS.SUPPLEMENTO_ESTERO]),
  }
}
