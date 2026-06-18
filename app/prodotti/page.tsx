import { getProducts } from '@/services/products'

export const metadata = { title: 'Prodotti' }

export default async function ProdottiPage() {
  const products = await getProducts()

  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-montserrat)' }}>
      <p>🚧 Prodotti — {products.length} prodotti</p>
    </main>
  )
}
