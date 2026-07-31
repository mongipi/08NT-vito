'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

export function B2BContent() {
  const { locale } = useLocale()
  const t = useTranslation(locale)
  const siteSettings = useSiteSettings()

  const OFFERINGS = [
    t('b2b_offer_1'), t('b2b_offer_2'), t('b2b_offer_3'), t('b2b_offer_4'),
    t('b2b_offer_5'), t('b2b_offer_6'), t('b2b_offer_7'), t('b2b_offer_8'),
  ]

  const TRUST_ITEMS = [
    { label: t('b2b_trust_1_label'), body: t('b2b_trust_1_body') },
    { label: t('b2b_trust_2_label'), body: t('b2b_trust_2_body') },
    { label: t('b2b_trust_3_label'), body: t('b2b_trust_3_body') },
  ]

  return (
    <main>
      <section className="page-hero v61-b2b-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">{t('b2b_eyebrow')}</div>
          <h1 className="v61-title">{richText(t('b2b_hero_title'))}</h1>
          <p>{t('b2b_hero_p1')}</p>
          <p>{t('b2b_hero_p2')}</p>
          <Link className="v61-button" href="/contatti">{t('b2b_hero_cta')}</Link>
        </div>
      </section>

      <section className="section">
        <div className="v61-inner v61-b2b-grid">
          <div className="v61-b2b-box">
            <h2 className="v61-title">{richText(t('b2b_offer_title'))}</h2>
            <div className="v61-check-grid">
              {OFFERINGS.map((item) => <span className="v61-check" key={item}>{item}</span>)}
            </div>
            <div className="v61-b2b-zone">
              <small>{t('b2b_zone_label')}</small>
              {siteSettings.companyLegalName}<br />
              {siteSettings.companyAddress}<br />
              Tel. {siteSettings.companyPhone} · {siteSettings.companyEmail}
            </div>
          </div>

          <aside className="v61-b2b-trust">
            <div className="v61-eyebrow">{t('b2b_why_eyebrow')}</div>
            <h2 className="v61-title">{richText(t('b2b_why_title'))}</h2>
            {TRUST_ITEMS.map((item) => (
              <div className="v61-b2b-trust-item" key={item.label}>
                <h3>{item.label}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </main>
  )
}
