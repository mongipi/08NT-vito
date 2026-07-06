'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'

export function LavoraConNoiContent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  const AREAS = [
    { title: t('work_area_1_title'), body: t('work_area_1_body') },
    { title: t('work_area_2_title'), body: t('work_area_2_body') },
    { title: t('work_area_3_title'), body: t('work_area_3_body') },
  ]

  return (
    <main>
      <section className="page-hero products-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">08 Natural Technology</div>
          <h1 className="v61-title" style={{ color: 'var(--silver-3)', fontSize: 'clamp(2.7rem,6vw,4.9rem)' }}>
            {richText(t('work_hero_title'))}
          </h1>
          <p style={{ maxWidth: 760, color: 'rgba(253,246,232,.68)', lineHeight: 1.75, marginTop: 10 }}>
            {t('work_hero_body')}
          </p>
        </div>
      </section>

      <section className="section v61-work-section">
        <div className="v61-inner v61-work-intro">
          <div>
            <div className="v61-eyebrow">{t('work_eyebrow')}</div>
            <h2 className="v61-title">{richText(t('work_title'))}</h2>
          </div>
          <p>{t('work_intro')}</p>
        </div>

        <div className="v61-inner v61-work-grid">
          {AREAS.map((item) => (
            <article className="v61-work-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section v61-work-cta-section">
        <div className="v61-inner v61-work-cta">
          <h2>{t('work_cta_title')}</h2>
          <p>{t('work_cta_body')}</p>
          <Link className="v61-button" href="/contatti">{t('work_cta_button')}</Link>
        </div>
      </section>
    </main>
  )
}
