'use server'

import { searchPosteLockers, type PosteLocker } from '@/lib/poste'

interface SearchPosteLockersResult {
  lockers?: PosteLocker[]
  error?: string
}

export async function searchPosteLockersAction(zipCode: string): Promise<SearchPosteLockersResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { error: 'CAP non valido' }
  }

  try {
    const lockers = await searchPosteLockers(zipCode)
    return { lockers }
  } catch (err) {
    console.error('Ricerca locker Poste fallita:', err)
    return { error: 'Servizio Poste Italiane non disponibile al momento' }
  }
}
