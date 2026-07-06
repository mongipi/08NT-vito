import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  variant?: 'home' | 'catalog'
}

const V61_PRODUCT_IMAGES: Record<string, string> = {
  'menopausa-complex': '/v61/img/menopausa-complex-front.png',
  'capelli-pelle-unghie': '/v61/img/capelli-pelle-unghie-front.png',
  'microcircolo-superior': '/v61/img/microcircolo-superior-front.png',
  'multivitaminico-minerali': '/v61/img/multivitaminico-minerali-front.png',
}

export function ProductCard({ product, variant = 'home' }: ProductCardProps) {
  const { line, name, shortDescription, ingredients, capsules, days, dosage, notificationMs, slug, images } = product
  const isCatalog = variant === 'catalog'
  const imageSrc = V61_PRODUCT_IMAGES[slug] ?? images?.fronte
  const detailText = isCatalog && notificationMs
    ? `${capsules} capsule · ${dosage} · ${notificationMs}`
    : `${capsules} capsule · ${days} giorni`

  return (
    <article className="v61-product-card" style={{ '--accent': line.color, '--soft': line.colorLight } as CSSProperties}>
      <div className="v61-product-band" />
      <div className="v61-product-image">
        <span className="v61-product-tag">{line.name}</span>
        {imageSrc ? (
          <Image src={imageSrc} alt={name} width={isCatalog ? 190 : 168} height={isCatalog ? 285 : 222} sizes="190px" />
        ) : (
          <div className="v61-product-placeholder">08</div>
        )}
      </div>
      <div className="v61-product-content">
        <h3>{name}</h3>
        <p>{shortDescription}</p>
        <div className="v61-product-chips">
          {ingredients.slice(0, isCatalog ? 4 : 3).map((ing, i) => <span key={`${ing.name}-${i}`}>{ing.name}</span>)}
        </div>
        <div className="v61-product-foot">
          <span>{detailText}</span>
          <Link href={`/prodotti/${slug}`}>{isCatalog ? 'Scheda completa' : 'Scopri'} →</Link>
        </div>
      </div>
    </article>
  )
}
