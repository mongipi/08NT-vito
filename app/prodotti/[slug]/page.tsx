import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug } from '@/services/products'
import { ProductPurchaseExperience } from '@/components/ui/ProductPurchaseExperience'
import type { Metadata } from 'next'
import type { ProductImages } from '@/types'
import { IngredientsDisclosure } from '@/components/ui/IngredientsDisclosure'
import { ProductRegulatoryNotice } from '@/components/ui/ProductRegulatoryNotice'
import { Localized } from '@/components/ui/Localized'
import { ProductTitle } from '@/components/ui/ProductTitle'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
type GallerySlide = { src: string; label: string; alt: string }

const PRODUCT_PAGE_TEXTS = {
  breadcrumbBrandLabel: '08 Natural Technology',
  allProductsLabel: 'Tutti i prodotti',
  madeInItalyLabel: 'Made in Italy',
  defaultKickerTemplate: '{line} - Formula mirata',
  galleryFrontLabel: 'Fronte',
  galleryInfographicLabel: 'Infografica',
  galleryCompositionLabel: 'Composizione',
  galleryBackLabel: 'Retro etichetta',
  galleryLabelLabel: 'Etichetta',
  sectionUsageTitle: "Modo d'uso",
  sectionTargetTitle: 'A chi è rivolto',
  sectionFormatTitle: 'Formato e composizione',
  sectionIngredientsTitle: 'Ingredienti',
  fallbackUsageBody: 'Seguire le indicazioni riportate in etichetta.',
  fallbackTargetBody: 'Pensato per chi cerca un supporto nutrizionale mirato.',
  fallbackIngredientsBody: 'Ingredienti non ancora specificati.',
  capsuleSuffix: 'capsule vegetali',
  daysSuffix: 'giorni',
}

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
  const texts = PRODUCT_PAGE_TEXTS
  const gallerySlides = buildFallbackGallery(images, name, texts)
  const kicker = texts.defaultKickerTemplate.replace('{line}', line.name)
  const metaPills = [
    capsules ? `${capsules} ${texts.capsuleSuffix}` : format,
    days ? `${days} ${texts.daysSuffix}` : null,
    dosage,
    notificationMs,
    texts.madeInItalyLabel,
  ].filter(Boolean) as string[]

  return (
    <main className="v61-product-detail-page" style={{ '--accent': line.color, '--soft': line.colorLight } as CSSProperties}>
      <div className="v61-product-breadcrumb">
        <span>
          <strong>{texts.breadcrumbBrandLabel}</strong>
          <i>/</i>
          {line.name}
        </span>
        <Link href="/prodotti">{texts.allProductsLabel}</Link>
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
          {gallerySlides.length > 0 ? (
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
              metaPills={metaPills}
              kicker={kicker}
              description={longDescription || shortDescription}
              descriptionEn={longDescriptionEn || shortDescriptionEn}
            />
          ) : (
            <div className="v61-product-purchase-grid">
              <div className="v61-product-purchase-media">
                <BottleStub color={line.color} colorLight={line.colorLight} label={name} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section v61-ingredients-section">
        <div className="v61-inner v61-narrow">
          <IngredientsDisclosure ingredients={product.ingredients} color={line.color} />
        </div>
      </section>

      <section className="section v61-detail-info-section">
        <div className="v61-inner v61-detail-grid">
          <DetailCard title={texts.sectionUsageTitle} color={line.color}>
            <Localized it={usage ?? texts.fallbackUsageBody} en={usageEn} />
          </DetailCard>
          <DetailCard title={texts.sectionTargetTitle} color={line.color}>
            <Localized it={target ?? texts.fallbackTargetBody} en={targetEn} />
          </DetailCard>
          <DetailCard title={texts.sectionFormatTitle} color={line.color}>
            <Localized it={format ?? `${capsules ?? ''} ${texts.capsuleSuffix}`.trim()} en={formatEn} />
          </DetailCard>
          <DetailCard title={texts.sectionIngredientsTitle} color={line.color}>
            <Localized it={ingredientsText ?? texts.fallbackIngredientsBody} en={ingredientsTextEn} />
          </DetailCard>
        </div>
      </section>

      <ProductRegulatoryNotice notificationMs={notificationMs} />
    </main>
  )
}

function buildFallbackGallery(
  images: ProductImages,
  name: string,
  texts: typeof PRODUCT_PAGE_TEXTS
): GallerySlide[] {
  return [
    images?.fronte && { src: images.fronte, label: texts.galleryFrontLabel, alt: name },
    images?.infografica && {
      src: images.infografica,
      label: texts.galleryInfographicLabel,
      alt: `${name} - ${texts.galleryInfographicLabel.toLowerCase()}`,
    },
    images?.lato1 && {
      src: images.lato1,
      label: texts.galleryCompositionLabel,
      alt: `${name} - ${texts.galleryCompositionLabel.toLowerCase()}`,
    },
    images?.lato2 && {
      src: images.lato2,
      label: texts.galleryBackLabel,
      alt: `${name} - ${texts.galleryBackLabel.toLowerCase()}`,
    },
    images?.etichetta && {
      src: images.etichetta,
      label: texts.galleryLabelLabel,
      alt: `${name} - ${texts.galleryLabelLabel.toLowerCase()}`,
    },
  ].filter(Boolean) as GallerySlide[]
}

function SectionLabel({ children, color }: { children: ReactNode; color: string }) {
  return <div className="v61-section-label" style={{ color, borderBottomColor: `${color}22` }}>{children}</div>
}

function DetailCard({ title, color, children }: { title: string; color: string; children: ReactNode }) {
  return (
    <div className="v61-detail-card">
      <SectionLabel color={color}>{title}</SectionLabel>
      <p>{children}</p>
    </div>
  )
}

function BottleStub({ color, colorLight, label }: { color: string; colorLight: string; label: string }) {
  return (
    <div className="v61-bottle-stub" style={{ color, background: `linear-gradient(150deg, ${colorLight} 0%, #fff 80%)`, borderColor: `${color}20` }}>
      {label}
    </div>
  )
}
