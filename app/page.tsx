import { getProducts } from '@/services/products'
import { getArticles } from '@/services/articles'

export default async function HomePage() {
  const [products, articles] = await Promise.all([getProducts(), getArticles()])

  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-montserrat)' }}>
      <p>🚧 Home — {products.length} prodotti · {articles.length} articoli caricati dai mock.</p>
    </main>
  )
}
