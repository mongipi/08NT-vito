import { prisma } from '@/lib/prisma'
import { toImageStorageKey } from '@/lib/domain/product-images'
import type { ProductImage } from '@prisma/client'

/** Immagini prodotto salvate su database. Unico accesso a prisma.productImage. */

/**
 * Cerca l'immagine accettando come identificatore sia l'id sia lo slug prodotto.
 * La chiave in URL usa il trattino (lato-1), quella su database no (lato1).
 */
export async function findProductImage(
  productIdOrSlug: string,
  urlKey: string
): Promise<ProductImage | null> {
  const key = toImageStorageKey(urlKey)

  const byId = await prisma.productImage.findUnique({
    where: { productId_key: { productId: productIdOrSlug, key } },
  })
  if (byId) return byId

  const product = await prisma.product.findUnique({
    where: { slug: productIdOrSlug },
    select: { id: true },
  })
  if (!product) return null

  return prisma.productImage.findUnique({
    where: { productId_key: { productId: product.id, key } },
  })
}
