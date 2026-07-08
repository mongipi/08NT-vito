'use client'

import { useLocale, pickLocalized } from '@/contexts/LocaleContext'

function splitProductName(name: string): [string, string] {
  const words = name.split(' ')
  if (words.length < 2) return [name, '']
  return [words.slice(0, -1).join(' '), words[words.length - 1]]
}

interface Props {
  name: string
  nameEn?: string | null
  /** true = nome completo su una riga (es. per un <h2>); false = split main/emphasized per l'hero <h1>. */
  join?: boolean
}

/** Nome prodotto localizzato, con lo split main/emphasized ricalcolato sulla lingua attiva. */
export function ProductTitle({ name, nameEn, join = false }: Props) {
  const { locale } = useLocale()
  const displayName = pickLocalized(locale, name, nameEn ?? null)

  if (join) return <>{displayName}</>

  const [mainName, emphasizedName] = splitProductName(displayName)
  return (
    <>
      {mainName} {emphasizedName && <em>{emphasizedName}.</em>}
    </>
  )
}
