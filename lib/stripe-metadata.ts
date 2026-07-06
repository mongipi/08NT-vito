// Stripe limita ogni valore di metadata a 500 caratteri. Indirizzi con note lunghe,
// dati punto di ritiro, o carrelli con molti articoli possono superarlo facilmente:
// questi helper spezzano/riassemblano un valore su più chiavi (`${key}_0`, `${key}_1`, ...).
const CHUNK_SIZE = 500

export function chunkMetadataValue(key: string, value: string): Record<string, string> {
  const parts: string[] = []
  for (let i = 0; i < value.length; i += CHUNK_SIZE) {
    parts.push(value.slice(i, i + CHUNK_SIZE))
  }

  const result: Record<string, string> = { [`${key}_count`]: String(parts.length) }
  parts.forEach((part, i) => { result[`${key}_${i}`] = part })
  return result
}

export function unchunkMetadataValue(meta: Record<string, string>, key: string): string {
  const count = Number(meta[`${key}_count`] ?? 0)
  if (!count) return meta[key] ?? ''

  let value = ''
  for (let i = 0; i < count; i++) value += meta[`${key}_${i}`] ?? ''
  return value
}
