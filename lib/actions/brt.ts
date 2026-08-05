'use server'

import { searchBrtPudoByZip, searchBrtPudoByLatLng, type BrtPudoPoint } from '@/lib/brt'

interface SearchBrtPudoResult {
  points?: BrtPudoPoint[]
  error?: string
}

export async function searchBrtPudoByZipAction(
  zipCode: string,
  language?: string
): Promise<SearchBrtPudoResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { error: 'CAP non valido' }
  }

  try {
    const points = await searchBrtPudoByZip({ zipCode, language })
    return { points }
  } catch (err) {
    console.error('Ricerca punti BRT per CAP fallita:', err)
    return { error: 'Servizio BRT non disponibile al momento' }
  }
}

export async function searchBrtPudoByLatLngAction(
  latitude: number,
  longitude: number,
  language?: string
): Promise<SearchBrtPudoResult> {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { error: 'Coordinate non valide' }
  }

  try {
    const points = await searchBrtPudoByLatLng({ latitude, longitude, language })
    return { points }
  } catch (err) {
    console.error('Ricerca punti BRT per coordinate fallita:', err)
    return { error: 'Servizio BRT non disponibile al momento' }
  }
}
