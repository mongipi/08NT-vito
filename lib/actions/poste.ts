'use server'

import { isPosteConfigured, searchPosteLockers, type PosteLocker } from '@/lib/poste'
import type { DictionaryKey } from '@/lib/i18n/dictionary'

interface SearchPosteLockersResult {
  lockers?: PosteLocker[]
  errorKey?: DictionaryKey
}

export async function searchPosteLockersAction(zipCode: string): Promise<SearchPosteLockersResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { errorKey: 'checkout_pickup_zip_error' }
  }

  if (!isPosteConfigured()) {
    return { errorKey: 'checkout_poste_config_missing' }
  }

  try {
    const lockers = await searchPosteLockers(zipCode)
    return { lockers }
  } catch (err) {
    console.error('Ricerca locker Poste fallita:', err)
    return { errorKey: 'checkout_poste_service_unavailable' }
  }
}
