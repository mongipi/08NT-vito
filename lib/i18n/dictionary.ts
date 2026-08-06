'use client'

import { useCallback } from 'react'
import type { Locale } from '@/contexts/LocaleContext'
import { translate, type DictionaryKey } from './data'

export { dictionary, translate, type DictionaryKey } from './data'

/**
 * La funzione restituita è stabile finché la lingua non cambia.
 *
 * Prima veniva ricreata a ogni render, quindi non poteva essere usata come
 * dipendenza di useMemo o useEffect: nei punti in cui serviva si era dovuto
 * mettere un eslint-disable e dipendere da `locale` a mano.
 */
export function useTranslation(locale: Locale) {
  return useCallback(
    (key: DictionaryKey, vars?: Record<string, string>) => translate(locale, key, vars),
    [locale]
  )
}
