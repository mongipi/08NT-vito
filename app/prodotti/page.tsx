export const dynamic = 'force-dynamic'

import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProducts } from '@/services/products'

export const metadata: Metadata = { title: 'Prodotti' }

const V61_PRODUCT_IMAGES: Record<string, string> = {
  'menopausa-complex': '/v61/img/menopausa-complex-front.png',
  'capelli-pelle-unghie': '/v61/img/capelli-pelle-unghie-front.png',
  'microcircolo-superior': '/v61/img/microcircolo-superior-front.png',
  'multivitaminico-minerali': '/v61/img/multivitaminico-minerali-front.png',
}

export default async function ProdottiPage() {
  const products = await getProducts()

  return (
    <main>
      <section className="page-hero products-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">08 Natural Technology</div>
          <h1 className="v61-title" style={{ color: 'var(--silver-3)', fontSize: 'clamp(2.7rem,6vw,4.9rem)', textTransform: 'uppercase' }}>I Nostri <em style={{ color: 'var(--amber)' }}>Prodotti.</em></h1>
          <p style={{ maxWidth: 720, color: 'rgba(253,246,232,.68)', lineHeight: 1.75, marginTop: 10 }}>Formule pensate per esigenze reali, con ingredienti selezionati.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', paddingTop: 'clamp(3rem,5vw,4.2rem)' }}>
        <div className="v61-inner v61-product-list-shell">
          <div className="v61-product-mobile-carousel">
            {products.map((product) => {
              const image = V61_PRODUCT_IMAGES[product.slug] ?? product.images?.fronte
              return (
                <article key={product.id} className="v61-product-slide" style={{ '--accent': product.line.color } as CSSProperties}>
                  <div className="v61-product-slide-media">
                    {image && <Image src={image} alt={product.name} width={190} height={285} sizes="190px" />}
                  </div>
                  <div className="v61-product-slide-content">
                    <div className="v61-product-slide-kicker">{product.line.name} · Formula mirata</div>
                    <h2>{product.name}</h2>
                    <p>{product.shortDescription}</p>
                    <div className="v61-product-slide-info">
                      <span>{product.capsules} capsule vegetali</span>
                      <span>{product.dosage}</span>
                      <span>{product.days} giorni</span>
                      <Link href={`/prodotti/${product.slug}`}>Scopri</Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="v61-copy" style={{ maxWidth: 900 }}>
            Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano.
            Tenere fuori dalla portata dei bambini. Tutti i prodotti sono notificati al Ministero della Salute della Repubblica Italiana dove indicato.
          </p>
        </div>
      </section>
    </main>
  )
}
