'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { Localized } from '@/components/ui/Localized'
import { ProductTitle } from '@/components/ui/ProductTitle'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'

export function ProdottiContent({ products }: { products: Product[] }) {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  return (
    <main>
      <section className="page-hero products-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">08 Natural Technology</div>
          <h1 className="v61-title" style={{ color: 'var(--silver-3)', fontSize: 'clamp(2.7rem,6vw,4.9rem)', textTransform: 'uppercase' }}>
            {richText(t('products_hero_title'))}
          </h1>
          <p style={{ maxWidth: 720, color: 'rgba(253,246,232,.68)', lineHeight: 1.75, marginTop: 10 }}>{t('products_hero_body')}</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', paddingTop: 'clamp(3rem,5vw,4.2rem)' }}>
        <div className="v61-inner v61-product-list-shell">
          <div className="v61-product-mobile-carousel">
            {products.map((product) => {
              const image = product.images?.fronte
              return (
                <article key={product.id} className="v61-product-slide" style={{ '--accent': product.line.color } as CSSProperties}>
                  <div className="v61-product-slide-media">
                    {image && <Image src={image} alt={product.name} width={190} height={285} sizes="190px" />}
                  </div>
                  <div className="v61-product-slide-content">
                    <div className="v61-product-slide-kicker">{product.line.name} · {t('products_slide_kicker_suffix')}</div>
                    <h2><ProductTitle name={product.name} nameEn={product.nameEn} join /></h2>
                    <p><Localized it={product.shortDescription} en={product.shortDescriptionEn} /></p>
                    <div className="v61-product-slide-info">
                      <span>{t('products_capsules', { n: String(product.capsules ?? '') })}</span>
                      <span>{product.dosage}</span>
                      <span>{t('products_days', { n: String(product.days ?? '') })}</span>
                      <Link href={`/prodotti/${product.slug}`}>{t('products_discover')}</Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="v61-copy" style={{ maxWidth: 900 }}>
            {t('products_disclaimer')}
          </p>
        </div>
      </section>
    </main>
  )
}
