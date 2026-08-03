'use server'

import { isBrtConfigured, searchBrtFermopoints, type BrtFermopoint } from '@/lib/brt'

interface SearchBrtFermopointsResult {
  points?: BrtFermopoint[]
  error?: string
  configurationMissing?: boolean
}

export async function searchBrtFermopointsAction(
  postalCode?: string,
  city?: string,
  address?: string,
  latitude?: number,
  longitude?: number
): Promise<SearchBrtFermopointsResult> {
  if (
    (!postalCode || !/^\d{5}$/.test(postalCode)) &&
    (typeof latitude !== 'number' || typeof longitude !== 'number')
  ) {
    return { error: 'CAP non valido' }
  }

  if (!isBrtConfigured()) {
    return {
      error: 'Servizio BRT Fermopoint non configurato.',
      configurationMissing: true,
    }
  }

  try {
    const points = await searchBrtFermopoints({ postalCode, city, address, latitude, longitude })
    return { points }
  } catch (err) {
    console.error('Ricerca Fermopoint BRT fallita:', err)
    const message =
      err instanceof Error ? err.message : 'Servizio BRT Fermopoint non disponibile al momento'
    return { error: message }
  }
}
