'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, pickLocalized } from '@/contexts/LocaleContext'
import { NewsletterSignup } from '@/components/ui/NewsletterSignup'
import { HomeHeroCarousel } from '@/components/ui/HomeHeroCarousel'
import { useTranslation } from '@/lib/i18n/dictionary'
import { richText } from '@/lib/i18n/richText'
import { formatDate } from '@/lib/utils'

const HOME_FEATURES = [
  {
    id: 'home-feature-1',
    icon: 'IT',
    title: 'ECCELLENZA ITALIANA',
    body: 'Identità italiana, cura del dettaglio e standard elevati in ogni scelta.',
  },
  {
    id: 'home-feature-2',
    icon: '🌿',
    title: 'INGREDIENTI DI ALTA QUALITÀ',
    body: 'Materie prime selezionate con attenzione e formule coerenti.',
  },
  {
    id: 'home-feature-3',
    icon: '🔬',
    title: 'RICERCA E INNOVAZIONE',
    body: 'Soluzioni nutrizionali moderne, ad alta biodisponibilità.',
  },
  {
    id: 'home-feature-4',
    icon: '✨',
    title: 'BENESSERE E RISULTATI CONCRETI',
    body: 'Soluzioni concrete, pensate per esigenze mirate.',
  },
]

const HOME_FORMULAS = {
  eyebrow: 'Le nostre formule',
  title: 'Prodotti pensati\n**per esigenze reali.**',
  body: 'Dai prodotti per microcircolo e gambe leggere, fino al supporto vitaminico, alla bellezza di capelli, pelle e unghie e all’equilibrio femminile in menopausa: 08 Natural Technology propone soluzioni nutrizionali pensate per esigenze concrete e quotidiane.',
  ctaLabel: 'Scopri i prodotti',
  ctaHref: '/prodotti',
}

const HOME_BLOG = {
  eyebrow: 'Blog 08',
  title: 'Approfondimenti e benessere quotidiano',
  body: 'Scopri consigli, ingredienti e articoli utili per orientarti meglio tra formule, esigenze e scelte quotidiane.',
}

export interface HomeArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  tag: string
  publishedAt: string
  readingTime?: number | null
  titleEn?: string | null
  excerptEn?: string | null
}

export function HomeContent({ articles }: { articles: HomeArticle[] }) {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  return (
    <main>
      <section className="v61-hero">
        <div className="v61-hero-bg">
          <HomeHeroCarousel />
        </div>
        <div className="v61-hero-inner">
          <div className="v61-hero-copy">
            <h1>{richText(t('home_hero_title'))}</h1>
            <p>{t('home_hero_body')}</p>
            <div className="v61-hero-actions">
              <Link className="v61-button" href="/prodotti">
                {t('home_hero_cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="v61-feature-strip">
        <div className="v61-feature-grid">
          {HOME_FEATURES.map((item) => (
            <div className="v61-feature" key={item.id}>
              <div className="ico">{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="v61-inner v61-about-grid">
          <div className="v61-showcase">
            <Image
              src="/v61/img/founder-lab-08.png"
              alt="Laboratorio 08 Natural Technology"
              width={520}
              height={340}
            />
          </div>
          <div>
            <div className="v61-eyebrow">{t('home_about_eyebrow')}</div>
            <span className="v61-script">{t('home_about_script')}</span>
            <h2 className="v61-title">{richText(t('home_about_title'))}</h2>
            <blockquote className="v61-quote">&ldquo;{t('home_about_quote')}&rdquo;</blockquote>
            <p className="v61-copy" style={{ marginBottom: 14 }}>
              {richText(t('home_about_p1'))}
            </p>
            <p className="v61-copy">{t('home_about_p2')}</p>
            <div className="v61-script" style={{ marginTop: 18 }}>
              {t('home_about_signature')}
            </div>
          </div>
        </div>
      </section>

      <section className="section v61-formulas-intro">
        <div className="v61-inner v61-formulas-intro-inner">
          <div className="v61-eyebrow">{HOME_FORMULAS.eyebrow}</div>
          <h2 className="v61-title">{richText(HOME_FORMULAS.title)}</h2>
          <p>{HOME_FORMULAS.body}</p>
          <Link className="v61-button green" href={HOME_FORMULAS.ctaHref}>
            {HOME_FORMULAS.ctaLabel}
          </Link>
        </div>
      </section>

      <section className="section v61-home-newsletter-section">
        <div className="v61-inner">
          <NewsletterSignup />
        </div>
      </section>

      <section className="section">
        <div className="v61-inner">
          <div className="v61-section-head">
            <div>
              <div className="v61-eyebrow">{HOME_BLOG.eyebrow}</div>
              <h2 className="v61-title">{HOME_BLOG.title}</h2>
            </div>
            <p>{HOME_BLOG.body}</p>
          </div>
          <div className="v61-blog-carousel">
            {articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="v61-article-card">
                <span className="cat">{article.tag}</span>
                <h2>{pickLocalized(locale, article.title, article.titleEn)}</h2>
                <p>{pickLocalized(locale, article.excerpt, article.excerptEn)}</p>
                <span className="date">
                  {formatDate(article.publishedAt)} · {article.readingTime ?? 5}{' '}
                  {t('home_reading_time')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
