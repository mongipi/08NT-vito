'use client'

import { useMemo, useState } from 'react'
import { ProductGallery } from './ProductGallery'
import { ProductPurchasePanel } from './ProductPurchasePanel'
import { Localized } from './Localized'
import { ProductTitle } from './ProductTitle'
import type { ProductVariant } from '@/types'
import type { GallerySlide } from '@/types/gallery'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

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
  lineName: string
  capsules?: number | null
  days?: number | null
  dosage?: string | null
  notificationMs?: string | null
  format?: string | null
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
  lineName,
  capsules,
  days,
  dosage,
  notificationMs,
  format,
  description,
  descriptionEn,
}: Props) {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const [selectedId, setSelectedId] = useState(variants[0]?.id)
  const selected = variants.find((variant) => variant.id === selectedId) ?? variants[0]
  const activeImage = selected?.image ?? image

  const activeSlides = useMemo(() => {
    if (!activeImage) return slides
    if (slides.length === 0) {
      return [{ src: activeImage, kind: 'front' as const }]
    }
    return slides.map((slide, index) => index === 0 ? { ...slide, src: activeImage } : slide)
  }, [activeImage, slides])

  const kicker = t('product_kicker_template', { line: lineName })
  const metaPills = [
    capsules ? `${capsules} ${t('product_capsules_suffix')}` : format,
    days ? `${days} ${t('product_days_suffix')}` : null,
    dosage,
    notificationMs,
    t('product_made_in_italy'),
  ].filter(Boolean) as string[]

  return (
    <div className="v61-product-purchase-grid">
      {/* Senza immagini la colonna non viene renderizzata affatto: il prezzo e il
          pulsante di acquisto restano comunque visibili. */}
      {activeSlides.length > 0 && (
        <div className={`v61-product-purchase-media v61-product-media-${slug}`}>
          <ProductGallery slides={activeSlides} color={color} contained productName={name} />
        </div>
      )}

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
