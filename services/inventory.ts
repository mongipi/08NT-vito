import { prisma } from '@/lib/prisma'
import type { CartItem } from '@/lib/cart'

/**
 * Movimenti di magazzino.
 *
 * updateMany invece di update: se la variante o il prodotto non esistono più
 * (per esempio perché cancellati dopo l'aggiunta al carrello) l'ordine non deve
 * fallire.
 */
export async function decrementStock(items: CartItem[]): Promise<void> {
  await Promise.all(
    items.map((item) =>
      item.variantId
        ? prisma.productVariant.updateMany({
            where: { id: item.variantId },
            data: { stock: { decrement: item.qty } },
          })
        : prisma.product.updateMany({
            where: { slug: item.slug },
            data: { stock: { decrement: item.qty } },
          })
    )
  )
}
