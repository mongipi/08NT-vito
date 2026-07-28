'use client'

import { useMemo, useState } from 'react'
import { ProductGallery } from './ProductGallery'
import { ProductPurchasePanel } from './ProductPurchasePanel'
import { Localized } from './Localized'
import { ProductTitle } from './ProductTitle'
import type { ProductVariant } from '@/types'

interface GallerySlide {
  src: string
  label: string
  alt: string
}

interface Props {
  productId: string
  slug: string
  name: string
  nameEn?: string | null
  image?: string
  price: number
  comparePrice?: number | null
  stock: number
  variants: ProductVariant[]
  color: string
  slides: GallerySlide[]
  metaPills: string[]
  kicker: string
  description: string
  descriptionEn?: string | null
}

export function ProductPurchaseExperience({
  productId,
  slug,
  name,
  nameEn,
  image,
  price,
  comparePrice,
  stock,
  variants,
  color,
  slides,
  metaPills,
  kicker,
  description,
  descriptionEn,
}: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id)
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0]
  const activeImage = selected?.image ?? image

  const activeSlides = useMemo(() => {
    if (!activeImage) return slides
    if (slides.length === 0) {
      return [{ src: activeImage, label: 'Fronte', alt: name }]
    }
    return slides.map((slide, index) => index === 0 ? { ...slide, src: activeImage } : slide)
  }, [activeImage, name, slides])

  return (
    <div className="v61-product-purchase-grid">
      <div className={`v61-product-purchase-media v61-product-media-${slug}`}>
        <ProductGallery slides={activeSlides} color={color} contained />
      </div>

      <div className="v61-product-purchase-content">
        <div className="v61-product-detail-meta">
          <div className="v61-meta-row">
            {metaPills.map((pill) => <span className="v61-pill" key={pill}>{pill}</span>)}
          </div>
        </div>

        <ProductPurchasePanel
          productId={productId}
          slug={slug}
          name={name}
          image={activeImage}
          price={price}
          comparePrice={comparePrice}
          stock={stock}
          variants={variants}
          color={color}
          selectedId={selected?.id}
          onSelectVariant={setSelectedId}
        />

        <div className="v61-product-detail-copy">
          <div className="v61-detail-kicker">{kicker}</div>
          <h2><ProductTitle name={name} nameEn={nameEn} join /></h2>
          <p className="v61-product-detail-description">
            <Localized it={description} en={descriptionEn} />
          </p>
        </div>
      </div>
    </div>
  )
}
