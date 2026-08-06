'use server'

import { searchBrtPudoByZip, searchBrtPudoByLatLng, type BrtPudoPoint } from '@/lib/brt'
import type { DictionaryKey } from '@/lib/i18n/dictionary'

interface SearchBrtPudoResult {
  points?: BrtPudoPoint[]
  errorKey?: DictionaryKey
}

export async function searchBrtPudoByZipAction(
  zipCode: string,
  language?: string
): Promise<SearchBrtPudoResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { errorKey: 'checkout_pickup_zip_error' }
  }

  try {
    const points = await searchBrtPudoByZip({ zipCode, language })
    return { points }
  } catch (err) {
    console.error('Ricerca punti BRT per CAP fallita:', err)
    return { errorKey: 'checkout_brt_service_unavailable' }
  }
}

export async function searchBrtPudoByLatLngAction(
  latitude: number,
  longitude: number,
  language?: string
): Promise<SearchBrtPudoResult> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { errorKey: 'checkout_brt_invalid_coordinates' }
  }

  try {
    const points = await searchBrtPudoByLatLng({ latitude, longitude, language })
    return { points }
  } catch (err) {
    console.error('Ricerca punti BRT per coordinate fallita:', err)
    return { errorKey: 'checkout_brt_service_unavailable' }
  }
}
