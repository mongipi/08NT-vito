'use client'

import { useLocale, pickLocalized } from '@/contexts/LocaleContext'

interface Props {
  it: string
  en?: string | null
}

/** Mostra il testo italiano o la traduzione inglese in base alla lingua selezionata nella navbar. */
export function Localized({ it, en }: Props) {
  const { locale } = useLocale()
  return <>{pickLocalized(locale, it, en ?? null)}</>
}
