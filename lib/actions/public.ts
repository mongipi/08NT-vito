'use server'

import { getPricingConfig } from '@/lib/domain/pricing-config'
import type { PricingConfig } from '@/lib/domain/pricing'

/** Espone al client la configurazione prezzi gestita da /admin/impostazioni. */
export async function getShippingConfig(): Promise<PricingConfig> {
  return getPricingConfig()
}
