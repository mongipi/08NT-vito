import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug } from '@/services/products'
import { ProductPurchaseExperience } from '@/components/ui/ProductPurchaseExperience'
import type { Metadata } from 'next'
import type { ProductImages } from '@/types'
import type { GallerySlide } from '@/types/gallery'
import { IngredientsDisclosure } from '@/components/ui/IngredientsDisclosure'
import { ProductRegulatoryNotice } from '@/components/ui/ProductRegulatoryNotice'
import { Localized } from '@/components/ui/Localized'
import { ProductTitle } from '@/components/ui/ProductTitle'
import { T } from '@/components/ui/T'
import { translate } from '@/lib/i18n/data'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return { title: `${product.name} - 08 Natural Technology` }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const {
    line, name, shortDescription, longDescription,
    usage, target, capsules, days,
    dosage, notificationMs, format, ingredientsText,
    nameEn, shortDescriptionEn, longDescriptionEn, usageEn, targetEn, formatEn, ingredientsTextEn,
  } = product

  const images = product.images as ProductImages
  const gallerySlides = buildFallbackGallery(images)

  return (
    <main className="v61-product-detail-page" style={{ '--accent': line.color, '--soft': line.colorLight } as CSSProperties}>
      <div className="v61-product-breadcrumb">
        <span>
          <strong>08 Natural Technology</strong>
          <i>/</i>
          {line.name}
        </span>
        <Link href="/prodotti"><T k="product_all_products" /></Link>
      </div>

      <section className="page-hero product-single-hero">
        <div className="v61-inner">
          <div>
            <div className="v61-eyebrow light">{line.name}</div>
            <h1 className="v61-title v61-product-detail-title">
              <ProductTitle name={name} nameEn={nameEn} />
            </h1>
            <p><Localized it={shortDescription} en={shortDescriptionEn} /></p>
          </div>
        </div>
      </section>

      <section className="section v61-product-detail-section">
        <div className="v61-inner">
          <ProductPurchaseExperience
            productId={product.id}
            slug={product.slug}
            name={product.name}
            nameEn={nameEn}
            image={images.fronte}
            price={product.price}
            comparePrice={product.comparePrice}
            stock={product.stock}
            variants={product.variants}
            color={line.color}
            slides={gallerySlides}
            lineName={line.name}
            capsules={capsules}
            days={days}
            dosage={dosage}
            notificationMs={notificationMs}
            format={format}
            description={longDescription || shortDescription}
            descriptionEn={longDescriptionEn || shortDescriptionEn}
          />
        </div>
      </section>

      <section className="section v61-ingredients-section">
        <div className="v61-inner v61-narrow">
          <IngredientsDisclosure ingredients={product.ingredients} color={line.color} />
        </div>
      </section>

      <section className="section v61-detail-info-section">
        <div className="v61-inner v61-detail-grid">
          <DetailCard title={<T k="product_section_usage" />} color={line.color}>
            <Localized
              it={usage ?? translate('it', 'product_fallback_usage')}
              en={usageEn ?? translate('en', 'product_fallback_usage')}
            />
          </DetailCard>
          <DetailCard title={<T k="product_section_target" />} color={line.color}>
            <Localized
              it={target ?? translate('it', 'product_fallback_target')}
              en={targetEn ?? translate('en', 'product_fallback_target')}
            />
          </DetailCard>
          <DetailCard title={<T k="product_section_format" />} color={line.color}>
            <Localized
              it={format ?? `${capsules ?? ''} ${translate('it', 'product_capsules_suffix')}`.trim()}
              en={formatEn ?? (capsules ? `${capsules} ${translate('en', 'product_capsules_suffix')}` : null)}
            />
          </DetailCard>
          <DetailCard title={<T k="product_section_ingredients" />} color={line.color}>
            <Localized
              it={ingredientsText ?? translate('it', 'product_fallback_ingredients')}
              en={ingredientsTextEn ?? translate('en', 'product_fallback_ingredients')}
            />
          </DetailCard>
        </div>
      </section>

      <ProductRegulatoryNotice notificationMs={notificationMs} />
    </main>
  )
}

function buildFallbackGallery(images: ProductImages): GallerySlide[] {
  return [
    images?.fronte && { src: images.fronte, kind: 'front' as const },
    images?.infografica && { src: images.infografica, kind: 'infographic' as const },
    images?.lato1 && { src: images.lato1, kind: 'composition' as const },
    images?.lato2 && { src: images.lato2, kind: 'back' as const },
    images?.etichetta && { src: images.etichetta, kind: 'label' as const },
  ].filter(Boolean) as GallerySlide[]
}

function SectionLabel({ children, color }: { children: ReactNode; color: string }) {
  return <div className="v61-section-label" style={{ color, borderBottomColor: `${color}22` }}>{children}</div>
}

function DetailCard({ title, color, children }: { title: ReactNode; color: string; children: ReactNode }) {
  return (
    <div className="v61-detail-card">
      <SectionLabel color={color}>{title}</SectionLabel>
      <p>{children}</p>
    </div>
  )
}

