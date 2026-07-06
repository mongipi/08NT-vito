import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug } from '@/services/products'
import { ProductGallery } from '@/components/ui/ProductGallery'
import { ProductPurchasePanel } from '@/components/ui/ProductPurchasePanel'
import type { Metadata } from 'next'
import type { ProductImages } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

type GallerySlide = { src: string; label: string; alt: string }

export const dynamic = 'force-dynamic'

const V61_PRODUCT_GALLERIES: Record<string, GallerySlide[]> = {
  'menopausa-complex': [
    { src: '/v61/img/menopausa-complex-front.png', label: 'Fronte', alt: 'Menopausa Complex' },
    { src: '/v61/img/menopausa-complex-composition.png', label: 'Composizione', alt: 'Menopausa Complex - composizione' },
    { src: '/v61/img/menopausa-complex-retro.png', label: 'Retro etichetta', alt: 'Menopausa Complex - retro etichetta' },
  ],
  'capelli-pelle-unghie': [
    { src: '/v61/img/capelli-pelle-unghie-front.png', label: 'Fronte', alt: 'Capelli, Pelle e Unghie' },
    { src: '/v61/img/capelli-pelle-unghie-composition.png', label: 'Composizione', alt: 'Capelli, Pelle e Unghie - composizione' },
    { src: '/v61/img/capelli-pelle-unghie-retro.png', label: 'Retro etichetta', alt: 'Capelli, Pelle e Unghie - retro etichetta' },
  ],
  'microcircolo-superior': [
    { src: '/v61/img/microcircolo-superior-front.png', label: 'Fronte', alt: 'Microcircolo Superior' },
    { src: '/v61/img/microcircolo-superior-composition.png', label: 'Composizione', alt: 'Microcircolo Superior - composizione' },
    { src: '/v61/img/microcircolo-superior-retro.png', label: 'Retro etichetta', alt: 'Microcircolo Superior - retro etichetta' },
  ],
  'multivitaminico-minerali': [
    { src: '/v61/img/multivitaminico-minerali-front.png', label: 'Fronte', alt: 'Multivitaminico e Minerali' },
    { src: '/v61/img/multivitaminico-minerali-composition.png', label: 'Composizione', alt: 'Multivitaminico e Minerali - composizione' },
    { src: '/v61/img/multivitaminico-minerali-retro.png', label: 'Retro etichetta', alt: 'Multivitaminico e Minerali - retro etichetta' },
  ],
}

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
    dosage, notificationMs, format,
  } = product

  const images = product.images as ProductImages
  const gallerySlides = V61_PRODUCT_GALLERIES[slug] ?? buildFallbackGallery(images, name)
  const productImage = gallerySlides[0]?.src ?? images?.fronte
  const [mainName, emphasizedName] = splitProductName(name)
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
          <div className="v61-eyebrow light">{line.name}</div>
          <h1 className="v61-title v61-product-detail-title">
            {mainName} {emphasizedName && <em>{emphasizedName}.</em>}
          </h1>
          <p>{shortDescription}</p>
        </div>
      </section>

      <section className="section v61-product-detail-section">
        <div className="v61-inner">
          <div className="v61-product-detail-meta">
            <div className="v61-meta-row">
              {metaPills.map((pill) => <span className="v61-pill" key={pill}>{pill}</span>)}
            </div>
          </div>

          {/* Prezzo + varianti + Aggiungi al carrello */}
          <div style={{ marginTop: '1.75rem' }}>
            <ProductPurchasePanel
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={images.fronte}
              price={product.price}
              comparePrice={product.comparePrice}
              stock={product.stock}
              variants={product.variants}
              color={line.color}
            />
          </div>
        </div>

            <div className="v61-product-detail-copy">
              <div className="v61-detail-kicker">{PRODUCT_KICKERS[slug] ?? `${line.name} - Formula mirata`}</div>
              <h2>{name}</h2>
              <p className="v61-product-detail-description">{longDescription || shortDescription}</p>

              <div className="v61-product-purchase">
                <div className="v61-price-row">
                  <span>€ {product.price.toFixed(2).replace('.', ',')}</span>
                  {product.comparePrice && <del>€ {product.comparePrice.toFixed(2).replace('.', ',')}</del>}
                </div>

                <AddToCartButton
                  item={{
                    productId: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    comparePrice: product.comparePrice ?? undefined,
                    image: productImage,
                  }}
                  color={line.color}
                  stock={product.stock}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section v61-ingredients-section">
        <div className="v61-inner v61-narrow">
          <IngredientsDisclosure ingredients={product.ingredients} color={line.color} />
        </div>
      </section>

      <section className="section v61-detail-info-section">
        <div className="v61-inner v61-detail-grid">
          <DetailCard title="Modo d'uso" color={line.color}>{usage ?? 'Seguire le indicazioni riportate in etichetta.'}</DetailCard>
          <DetailCard title="A chi è rivolto" color={line.color}>{target ?? 'Pensato per chi cerca un supporto nutrizionale mirato.'}</DetailCard>
          <DetailCard title="Formato e composizione" color={line.color}>{format ?? `${capsules ?? ''} capsule vegetali`.trim()}</DetailCard>
        </div>
      </section>

      <div className="v61-regulatory-notice">
        <div>
          Integratore alimentare notificato al Ministero della Salute della Repubblica Italiana
          {notificationMs ? ` (${notificationMs})` : ''}. Non superare la dose giornaliera consigliata.
          Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano.
          Tenere fuori dalla portata dei bambini.
        </div>
      </div>
    </main>
  )
}

function buildFallbackGallery(images: ProductImages, name: string): GallerySlide[] {
  return [
    images?.fronte && { src: images.fronte, label: 'Fronte', alt: name },
    images?.lato1 && { src: images.lato1, label: 'Composizione', alt: `${name} - composizione` },
    images?.lato2 && { src: images.lato2, label: 'Retro etichetta', alt: `${name} - retro etichetta` },
    images?.etichetta && { src: images.etichetta, label: 'Etichetta', alt: `${name} - etichetta` },
  ].filter(Boolean) as GallerySlide[]
}

function splitProductName(name: string): [string, string] {
  const words = name.split(' ')
  if (words.length < 2) return [name, '']
  return [words.slice(0, -1).join(' '), words[words.length - 1]]
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
