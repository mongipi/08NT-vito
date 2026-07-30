'use client'

import type { ReactNode } from 'react'
import { useLocale, pickLocalized } from '@/contexts/LocaleContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { useTranslation } from '@/lib/i18n/dictionary'

export interface LegalSection {
  title: string
  titleEn?: string
  paragraphs?: ReactNode[]
  paragraphsEn?: ReactNode[]
  items?: ReactNode[]
  itemsEn?: ReactNode[]
  subsections?: {
    title: string
    titleEn?: string
    paragraphs: ReactNode[]
    paragraphsEn?: ReactNode[]
  }[]
}

interface LegalDocumentProps {
  documentKey?: 'privacy' | 'cookie' | 'legal-notes' | 'terms'
  eyebrow: string
  eyebrowEn?: string
  title: string
  titleEn?: string
  subtitle: string
  subtitleEn?: string
  updated: string
  sections: LegalSection[]
}

export function LegalDocument({
  documentKey,
  eyebrow,
  eyebrowEn,
  title,
  titleEn,
  subtitle,
  subtitleEn,
  updated,
  sections,
}: LegalDocumentProps) {
  const { locale } = useLocale()
  const siteSettings = useSiteSettings()
  const t = useTranslation(locale)
  const en = locale === 'en'

  const override =
    locale === 'it'
      ? documentKey === 'privacy'
        ? siteSettings.legalPrivacyOverride
        : documentKey === 'cookie'
          ? siteSettings.legalCookieOverride
          : documentKey === 'legal-notes'
            ? siteSettings.legalNotesOverride
            : documentKey === 'terms'
              ? siteSettings.legalTermsOverride
              : null
      : null

  const activeEyebrow = override?.eyebrow ?? pickLocalized(locale, eyebrow, eyebrowEn)
  const activeTitle = override?.title ?? pickLocalized(locale, title, titleEn)
  const activeSubtitle = override?.subtitle ?? pickLocalized(locale, subtitle, subtitleEn)
  const activeUpdated = override?.updated ?? updated
  const activeSections = override?.sections ?? sections

  return (
    <main className="v61-legal-page">
      <section className="v61-legal-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">{activeEyebrow}</div>
          <h1>{activeTitle}</h1>
          <p>{activeSubtitle}</p>
          <span>
            {t('legal_last_updated')}: {activeUpdated}
          </span>
        </div>
      </section>

      <section className="section v61-legal-section">
        <div className="v61-legal-layout">
          <aside className="v61-legal-index" aria-label={t('legal_index')}>
            <p>{t('legal_index')}</p>
            <ol>
              {activeSections.map((section) => {
                const sectionTitle =
                  !override && en && 'titleEn' in section && section.titleEn
                    ? section.titleEn
                    : section.title
                return (
                  <li key={section.title}>
                    <a href={`#${slugify(section.title)}`}>{sectionTitle.replace(/^\d+\.\s*/, '')}</a>
                  </li>
                )
              })}
            </ol>
          </aside>

          <div className="v61-legal-content">
            {activeSections.map((section) => {
              const sectionTitle =
                !override && en && 'titleEn' in section && section.titleEn
                  ? section.titleEn
                  : section.title
              const paragraphs =
                !override && en && 'paragraphsEn' in section && section.paragraphsEn
                  ? section.paragraphsEn
                  : section.paragraphs
              const items =
                !override && en && 'itemsEn' in section && section.itemsEn
                  ? section.itemsEn
                  : section.items

              return (
                <article key={section.title} id={slugify(section.title)}>
                  <h2>{sectionTitle}</h2>
                  {paragraphs?.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {items && (
                    <ul>
                      {items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.subsections?.map((subsection) => {
                    const subTitle =
                      !override && en && 'titleEn' in subsection && subsection.titleEn
                        ? subsection.titleEn
                        : subsection.title
                    const subParagraphs =
                      !override && en && 'paragraphsEn' in subsection && subsection.paragraphsEn
                        ? subsection.paragraphsEn
                        : subsection.paragraphs

                    return (
                      <div key={subsection.title} className="v61-legal-subsection">
                        <h3>{subTitle}</h3>
                        {subParagraphs.map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    )
                  })}
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
