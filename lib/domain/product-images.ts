/**
 * Corrispondenza fra chiave immagine su database e segmento usato nell'URL.
 *
 * La stessa mappa era ripetuta in tre file (services/products.ts,
 * lib/actions/admin/products.ts e la route /api/product-images), due volte in un
 * verso e una nell'altro.
 */

export const IMAGE_KEYS = ['fronte', 'infografica', 'lato1', 'lato2', 'etichetta'] as const

export type ImageKey = (typeof IMAGE_KEYS)[number]

/** Chiave su database → segmento URL. */
export const IMAGE_KEY_TO_URL_PATH: Record<ImageKey, string> = {
  fronte: 'fronte',
  infografica: 'infografica',
  lato1: 'lato-1',
  lato2: 'lato-2',
  etichetta: 'etichetta',
}

const URL_PATH_TO_IMAGE_KEY: Record<string, ImageKey> = Object.fromEntries(
  IMAGE_KEYS.map((key) => [IMAGE_KEY_TO_URL_PATH[key], key])
) as Record<string, ImageKey>

/** Segmento URL → chiave su database; valori sconosciuti restano invariati. */
export function toImageStorageKey(urlPath: string): string {
  return URL_PATH_TO_IMAGE_KEY[urlPath] ?? urlPath
}
