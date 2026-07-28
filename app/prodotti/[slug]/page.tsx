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

type GallerySlide = { src: string; label: string; alt: string }

export const dynamic = 'force-dynamic'

const PRODUCT_KICKERS: Record<string, string> = {
  'menopausa-complex': 'Linea Menopausa - Formula giorno e notte',
  'capelli-pelle-unghie': 'Linea Beauty - Supporto mirato',
  'microcircolo-superior': 'Linea Microcircolo - Complesso flavonoico',
  'multivitaminico-minerali': 'Linea Energia - Formula quotidiana',
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
  const gallerySlides = buildFallbackGallery(images, name)
  const metaPills = [
    capsules ? `${capsules} capsule vegetali` : format,
    days ? `${days} giorni` : null,
    dosage,
    notificationMs,
    'Made in Italy',
  ].filter(Boolean) as string[]

  return (
    <main className="v61-product-detail-page" style={{ '--accent': line.color, '--soft': line.colorLight } as CSSProperties}>
      <div className="v61-product-breadcrumb">
        <span>
          <strong>08 Natural Technology</strong>
          <i>/</i>
          {line.name}
        </span>
        <Link href="/prodotti">Tutti i prodotti</Link>
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
              kicker={PRODUCT_KICKERS[slug] ?? `${line.name} - Formula mirata`}
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
          <DetailCard title="Modo d'uso" color={line.color}>
            <Localized it={usage ?? "Seguire le indicazioni riportate in etichetta."} en={usageEn} />
          </DetailCard>
          <DetailCard title="A chi è rivolto" color={line.color}>
            <Localized it={target ?? 'Pensato per chi cerca un supporto nutrizionale mirato.'} en={targetEn} />
          </DetailCard>
          <DetailCard title="Formato e composizione" color={line.color}>
            <Localized it={format ?? `${capsules ?? ''} capsule vegetali`.trim()} en={formatEn} />
          </DetailCard>
          <DetailCard title="Ingredienti" color={line.color}>
            <Localized it={ingredientsText ?? 'Ingredienti non ancora specificati.'} en={ingredientsTextEn} />
          </DetailCard>
        </div>
      </section>

      <ProductRegulatoryNotice notificationMs={notificationMs} />
    </main>
  )
}

function buildFallbackGallery(images: ProductImages, name: string): GallerySlide[] {
  return [
    images?.fronte && { src: images.fronte, label: 'Fronte', alt: name },
    images?.infografica && { src: images.infografica, label: 'Infografica', alt: `${name} - infografica` },
    images?.lato1 && { src: images.lato1, label: 'Composizione', alt: `${name} - composizione` },
    images?.lato2 && { src: images.lato2, label: 'Retro etichetta', alt: `${name} - retro etichetta` },
    images?.etichetta && { src: images.etichetta, label: 'Etichetta', alt: `${name} - etichetta` },
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
