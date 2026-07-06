export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getProducts } from '@/services/products'
import { ProdottiContent } from './ProdottiContent'

export const metadata: Metadata = { title: 'Prodotti' }

export default async function ProdottiPage() {
  const products = await getProducts()
  return <ProdottiContent products={products} />
}
