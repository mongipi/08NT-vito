'use server'

import { isPosteConfigured, searchPosteLockers, type PosteLocker } from '@/lib/poste'

interface SearchPosteLockersResult {
  lockers?: PosteLocker[]
  error?: string
  configurationMissing?: boolean
}

export async function searchPosteLockersAction(zipCode: string): Promise<SearchPosteLockersResult> {
  if (!/^\d{5}$/.test(zipCode)) {
    return { error: 'CAP non valido' }
  }

  if (!isPosteConfigured()) {
    return {
      error: 'La selezione automatica richiede l’attivazione delle credenziali Poste Italiane.',
      configurationMissing: true,
    }
  }

  try {
    const lockers = await searchPosteLockers(zipCode)
    return { lockers }
  } catch (err) {
    console.error('Ricerca locker Poste fallita:', err)
    const message = err instanceof Error ? err.message : 'Servizio Poste Italiane non disponibile al momento'
    return { error: message }
  }
}
