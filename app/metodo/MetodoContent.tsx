'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'
import { DEFAULT_METHOD_PAGE_CONTENT } from '@/lib/method-page'

export function MetodoContent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const managed = DEFAULT_METHOD_PAGE_CONTENT
  const useManaged = locale === 'it'

  const wellbeingValues = useManaged
    ? managed.values.cards
    : [
        { icon: '⚡', title: t('method_value1_title'), body: t('method_value1_body') },
        { icon: '⚖', title: t('method_value2_title'), body: t('method_value2_body') },
        { icon: '☾', title: t('method_value3_title'), body: t('method_value3_body') },
        { icon: '♡', title: t('method_value4_title'), body: t('method_value4_body') },
      ]

  const methodSteps = useManaged
    ? managed.difference.steps
    : [
        { n: '01', title: t('method_step1_title'), body: t('method_step1_body') },
        { n: '02', title: t('method_step2_title'), body: t('method_step2_body') },
        { n: '03', title: t('method_step3_title'), body: t('method_step3_body') },
        { n: '04', title: t('method_step4_title'), body: t('method_step4_body') },
      ]

  const formulas = useManaged
    ? managed.lineup.formulas
    : [
        {
          line: t('method_formula1_line'),
          name: t('method_formula1_name'),
          body: t('method_formula1_body'),
          href: '/prodotti/capelli-pelle-unghie',
        },
        {
          line: t('method_formula2_line'),
          name: t('method_formula2_name'),
          body: t('method_formula2_body'),
          href: '/prodotti/menopausa-complex',
        },
        {
          line: t('method_formula3_line'),
          name: t('method_formula3_name'),
          body: t('method_formula3_body'),
          href: '/prodotti/microcircolo-superior',
        },
        {
          line: t('method_formula4_line'),
          name: t('method_formula4_name'),
          body: t('method_formula4_body'),
          href: '/prodotti/multivitaminico-minerali',
        },
        {
          line: t('method_formula5_line'),
          name: t('method_formula5_name'),
          body: t('method_formula5_body'),
        },
      ]

  return (
    <main className="v61-quality-page">
      <section className="v61-brand-hero v61-quality-hero">
        <div className="v61-brand-hero-bg">
          <Image
            src={useManaged ? managed.hero.imageSrc : '/v61/img/qualita08-hero-sunset-contact.png'}
            alt={useManaged ? managed.hero.imageAlt : 'Qualità 08 Natural Technology'}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="v61-brand-hero-inner">
          <div className="v61-eyebrow light">
            {useManaged ? managed.hero.eyebrow : t('method_eyebrow')}
          </div>
          <h1>{richText(useManaged ? managed.hero.title : t('method_hero_title'))}</h1>
          <p>{useManaged ? managed.hero.body : t('method_hero_body')}</p>
          <div className="v61-quality-hero-actions">
            <Link className="v61-button v61-button-rounded" href={useManaged ? managed.hero.ctaHref : '/prodotti'}>
              {useManaged ? managed.hero.ctaLabel : t('method_hero_cta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section v61-quality-section">
        <div className="v61-inner v61-quality-section-head">
          <div>
            <div className="v61-eyebrow">
              {useManaged ? managed.promise.eyebrow : t('method_promise_eyebrow')}
            </div>
            <h2 className="v61-title">
              {richText(useManaged ? managed.promise.title : t('method_promise_title'))}
            </h2>
          </div>
          <p>{useManaged ? managed.promise.body : t('method_promise_body')}</p>
        </div>
        <div className="v61-inner v61-quality-duo">
          <article className="v61-quality-panel">
            <h3>{useManaged ? managed.promise.panel1.title : t('method_panel1_title')}</h3>
            {(useManaged ? managed.promise.panel1.paragraphs : [t('method_panel1_p1'), t('method_panel1_p2')]).map(
              (paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              )
            )}
            <ul className="v61-brand-list">
              {(useManaged
                ? managed.promise.panel1.items
                : [t('method_panel1_li1'), t('method_panel1_li2'), t('method_panel1_li3'), t('method_panel1_li4')]).map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
          </article>
          <article className="v61-quality-panel dark">
            <h3>{useManaged ? managed.promise.panel2.title : t('method_panel2_title')}</h3>
            {(useManaged
              ? managed.promise.panel2.paragraphs
              : [t('method_panel2_p1'), t('method_panel2_p2'), t('method_panel2_p3')]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="v61-brand-list">
              {(useManaged
                ? managed.promise.panel2.items
                : [t('method_panel2_li1'), t('method_panel2_li2'), t('method_panel2_li3'), t('method_panel2_li4')]).map(
                (item) => (
                  <li key={item}>{item}</li>
                )
              )}
            </ul>
          </article>
        </div>
      </section>

      <section className="section v61-quality-values-section">
        <div className="v61-inner v61-quality-copy-block">
          <div className="v61-eyebrow">
            {useManaged ? managed.values.eyebrow : t('method_values_eyebrow')}
          </div>
          <h2 className="v61-title">
            {richText(useManaged ? managed.values.title : t('method_values_title'))}
          </h2>
          <p>{useManaged ? managed.values.body : t('method_values_body')}</p>
          <div className="v61-quality-card-grid">
            {wellbeingValues.map((item) => (
              <article className="v61-quality-card" key={item.title}>
                <span>{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section v61-quality-method-section">
        <div className="v61-inner">
          <div className="v61-eyebrow light">
            {useManaged ? managed.difference.eyebrow : t('method_different_eyebrow')}
          </div>
          <h2 className="v61-title">
            {richText(useManaged ? managed.difference.title : t('method_different_title'))}
          </h2>
          <p className="v61-quality-dark-copy">
            {useManaged ? managed.difference.body : t('method_different_body')}
          </p>
          <div className="v61-quality-method-grid">
            {methodSteps.map((item) => (
              <article className="v61-quality-method-card" key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section v61-quality-section">
        <div className="v61-inner v61-quality-duo">
          <article className="v61-quality-panel">
            <div className="v61-eyebrow">
              {useManaged ? managed.positioning.audience.eyebrow : t('method_audience_eyebrow')}
            </div>
            <h3>{useManaged ? managed.positioning.audience.title : t('method_audience_title')}</h3>
            {(useManaged
              ? managed.positioning.audience.paragraphs
              : [t('method_audience_p1'), t('method_audience_p2')]).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="v61-brand-list">
              {(useManaged
                ? managed.positioning.audience.items
                : [t('method_audience_li1'), t('method_audience_li2'), t('method_audience_li3')]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="v61-quality-panel">
            <div className="v61-eyebrow">
              {useManaged
                ? managed.positioning.madeInItaly.eyebrow
                : t('method_madeinitaly_eyebrow')}
            </div>
            <h3>
              {useManaged ? managed.positioning.madeInItaly.title : t('method_madeinitaly_title')}
            </h3>
            {(useManaged
              ? managed.positioning.madeInItaly.paragraphs
              : [t('method_madeinitaly_p1'), t('method_madeinitaly_p2'), t('method_madeinitaly_p3')]).map(
              (paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              )
            )}
            <ul className="v61-brand-list">
              {(useManaged
                ? managed.positioning.madeInItaly.items
                : [
                    t('method_madeinitaly_li1'),
                    t('method_madeinitaly_li2'),
                    t('method_madeinitaly_li3'),
                    t('method_madeinitaly_li4'),
                  ]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section v61-quality-values-section" id="formule">
        <div className="v61-inner v61-quality-section-head">
          <div>
            <div className="v61-eyebrow">
              {useManaged ? managed.lineup.eyebrow : t('method_lineup_eyebrow')}
            </div>
            <h2 className="v61-title">
              {richText(useManaged ? managed.lineup.title : t('method_lineup_title'))}
            </h2>
          </div>
          <p>{useManaged ? managed.lineup.body : t('method_lineup_body')}</p>
        </div>
        <div className="v61-inner v61-quality-products-grid">
          {formulas.map((item) => (
            <article className="v61-quality-product-card" key={item.name}>
              <small>{item.line}</small>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
              {item.href ? (
                <Link href={item.href}>
                  {useManaged ? managed.lineup.discoverLabel : t('method_formula_discover')} <span>→</span>
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section v61-quality-vision-section">
        <div className="v61-inner v61-quality-vision">
          <h2>{useManaged ? managed.vision.title : t('method_vision_title')}</h2>
          <p>{richText(useManaged ? managed.vision.p1 : t('method_vision_p1'))}</p>
          <p>{useManaged ? managed.vision.p2 : t('method_vision_p2')}</p>
          <p>{useManaged ? managed.vision.p3 : t('method_vision_p3')}</p>
          <div className="v61-quality-vision-actions">
            <Link
              className="v61-button"
              href={useManaged ? managed.vision.ctaPrimaryHref : '/prodotti'}
            >
              {useManaged ? managed.vision.ctaPrimaryLabel : t('method_vision_cta1')}
            </Link>
            <Link
              className="v61-button dark"
              href={useManaged ? managed.vision.ctaSecondaryHref : '/contatti'}
            >
              {useManaged ? managed.vision.ctaSecondaryLabel : t('method_vision_cta2')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
