import type { CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { Localized } from '@/components/ui/Localized'
import { ProductTitle } from '@/components/ui/ProductTitle'

interface ProductCardProps {
  product: Product
  variant?: 'home' | 'catalog'
}

export function ProductCard({ product, variant = 'home' }: ProductCardProps) {
  const { line, name, nameEn, shortDescription, shortDescriptionEn, ingredients, capsules, days, dosage, notificationMs, slug, images } = product
  const isCatalog = variant === 'catalog'
  const imageSrc = images?.fronte
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
        <h3><ProductTitle name={name} nameEn={nameEn} join /></h3>
        <p><Localized it={shortDescription} en={shortDescriptionEn} /></p>
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
