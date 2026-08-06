'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation, type DictionaryKey } from '@/lib/i18n/dictionary'

interface Props {
  k: DictionaryKey
  vars?: Record<string, string>
}

/** Testo del dizionario dentro un server component. Gemello di <Localized> per le stringhe statiche. */
export function T({ k, vars }: Props) {
  const { locale } = useLocale()
  return <>{useTranslation(locale)(k, vars)}</>
}
