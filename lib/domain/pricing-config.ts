import { PRICING_FALLBACK, type PricingConfig } from '@/lib/domain/pricing'
import { getSettingsMap, SETTING_KEYS } from '@/lib/settings'

/**
 * Legge la configurazione prezzi da /admin/impostazioni.
 * Unico punto dell'applicazione in cui queste quattro impostazioni vengono lette.
 */

function parseAmount(raw: string | undefined, fallback: number): number {
  const parsed = parseFloat(raw ?? '')
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const settings = await getSettingsMap()
  return {
    codSurcharge: parseAmount(settings[SETTING_KEYS.COD_SURCHARGE], PRICING_FALLBACK.codSurcharge),
    shippingThreshold: parseAmount(
      settings[SETTING_KEYS.SPEDIZIONE_GRATUITA],
      PRICING_FALLBACK.shippingThreshold
    ),
    shippingPrice: parseAmount(
      settings[SETTING_KEYS.PREZZO_SPEDIZIONE],
      PRICING_FALLBACK.shippingPrice
    ),
    foreignSurcharge: parseAmount(
      settings[SETTING_KEYS.SUPPLEMENTO_ESTERO],
      PRICING_FALLBACK.foreignSurcharge
    ),
  }
}
