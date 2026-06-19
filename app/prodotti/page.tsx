import type { Metadata } from 'next'
import { getProducts } from '@/services/products'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProductCard } from '@/components/ui/ProductCard'

export const metadata: Metadata = { title: 'Prodotti' }

export default async function ProdottiPage() {
  const products = await getProducts()

  return (
    <main>
      <PageHeader
        eyebrow="Le nostre formule"
        script="Catalogo Prodotti 2026"
        title="Prodotti."
      />

      <section className="section">
        <div className="grid grid-cols-1 border border-[var(--border-2)] sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant="catalog" />
          ))}
        </div>

        {/* Legal disclaimer */}
        <div
          className="mt-6 flex items-start gap-3"
          style={{ padding: '1rem 1.25rem', border: '0.5px solid rgba(42,110,62,0.15)', background: 'rgba(42,110,62,0.03)' }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--green-2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1, opacity: 0.55 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p style={{ fontSize: '0.6875rem', fontWeight: 300, color: 'var(--ink-4)', lineHeight: 1.75, margin: 0 }}>
            Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile
            di vita sano. Tenere fuori dalla portata dei bambini. Tutti i prodotti sono notificati
            al Ministero della Salute della Repubblica Italiana.
          </p>
        </div>
      </section>
    </main>
  )
}
