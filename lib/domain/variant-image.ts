import { slugify } from '@/lib/utils'

/**
 * Token che collega una variante alla sua immagine (chiave `variant-<token>`).
 *
 * Era implementato due volte, in lettura (services/products.ts) e in scrittura
 * (lib/actions/admin/products.ts): se le due versioni divergevano, l'immagine
 * caricata dall'admin non veniva più trovata dalla pagina prodotto.
 */
export function variantImageToken(quantity: number, label: string): string {
  if (Number(quantity) > 0) return String(quantity)

  const quantityInLabel = String(label ?? '').match(/\d+/)?.[0]
  if (quantityInLabel) return quantityInLabel

  return slugify(String(label ?? ''))
}

export function variantImageKey(quantity: number, label: string): string {
  return `variant-${variantImageToken(quantity, label)}`
}
