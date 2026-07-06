export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { getArticles } from '@/services/articles'
import { formatDate } from '@/lib/utils'

const FEATURES = [
  { icon: 'IT', title: 'Eccellenza italiana', body: 'Identità italiana, cura del dettaglio e standard elevati in ogni scelta.' },
  { icon: '🌿', title: 'Ingredienti di alta qualità', body: 'Materie prime selezionate con attenzione e formule coerenti.' },
  { icon: '🔬', title: 'Ricerca e innovazione', body: 'Soluzioni nutrizionali moderne, ad alta biodisponibilità.' },
  { icon: '✨', title: 'Benessere e risultati concreti', body: 'Soluzioni concrete, pensate per esigenze mirate.' },
]

export default async function HomePage() {
  const articles = await getArticles()

  return (
    <main>
      <section className="v61-hero">
        <div className="v61-hero-bg">
          <Image src="/v61/img/hero_home_bg.jpg" alt="08 Natural Technology" fill priority unoptimized sizes="100vw" />
        </div>
        <div className="v61-hero-inner">
          <div className="v61-hero-copy">
            <h1>L&apos;<em>Eccellenza</em><br />come Standard.</h1>
            <p>
              08 Natural Technology nasce da un sogno: creare qualcosa di cui poter essere veramente orgogliosi.
              Non volevamo semplicemente realizzare degli integratori, ma dare vita a prodotti sviluppati con
              passione, attenzione e rispetto per le persone che ogni giorno ripongono la loro fiducia in noi.
            </p>
            <div className="v61-hero-actions">
              <Link className="v61-button" href="/prodotti">Scopri le formule</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="v61-feature-strip">
        <div className="v61-feature-grid">
          {FEATURES.map((item) => (
            <div className="v61-feature" key={item.title}>
              <div className="ico">{item.icon}</div>
              <div><h3>{item.title}</h3><p>{item.body}</p></div>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="v61-inner v61-about-grid">
          <div className="v61-showcase">
            <Image src="/v61/img/founder-lab-08.png" alt="Laboratorio 08 Natural Technology" width={520} height={340} />
          </div>
          <div>
            <div className="v61-eyebrow">Chi siamo</div>
            <span className="v61-script">Lettera del Fondatore</span>
            <h2 className="v61-title">Un sogno diventato <em>promessa quotidiana.</em></h2>
            <blockquote className="v61-quote">&ldquo;Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita.&rdquo;</blockquote>
            <p className="v61-copy" style={{ marginBottom: 14 }}>
              <strong>08 Natural Technology</strong> nasce dal desiderio di creare integratori alimentari curati nei dettagli,
              con formule comprensibili, ingredienti selezionati e un&apos;identità italiana riconoscibile.
            </p>
            <p className="v61-copy">Non volevamo realizzare semplicemente prodotti, ma un marchio con formule capaci di trasmettere fiducia, attenzione e rispetto verso chi ogni giorno sceglie di prendersi cura di sé.</p>
            <div className="v61-script" style={{ marginTop: 18 }}>Vito Tatulli</div>
          </div>
        </div>
      </section>

      <section className="section v61-formulas-intro">
        <div className="v61-inner v61-formulas-intro-inner">
          <div className="v61-eyebrow">Le nostre formule</div>
          <h2 className="v61-title">Prodotti pensati<br /><em>per esigenze reali.</em></h2>
          <p>
            Dai prodotti per microcircolo e gambe leggere, fino al supporto vitaminico, alla bellezza di capelli,
            pelle e unghie e all&apos;equilibrio femminile in menopausa: 08 Natural Technology propone soluzioni
            nutrizionali pensate per esigenze concrete e quotidiane.
          </p>
          <Link className="v61-button green" href="/prodotti">Scopri i prodotti</Link>
        </div>
      </section>

      <section className="section">
        <div className="v61-inner">
          <div className="v61-section-head">
            <div>
              <div className="v61-eyebrow">Approfondimenti</div>
              <h2 className="v61-title">Dossier, principi attivi e qualità.</h2>
            </div>
            <p>Il blog diventa uno strumento SEO e di autorevolezza: articoli sugli ingredienti, guide d&apos;uso, consigli e spiegazioni semplici.</p>
          </div>
          <div className="v61-blog-carousel">
            {articles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="v61-article-card">
                <span className="cat">{article.tag}</span>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <span className="date">{formatDate(article.publishedAt)} · {article.readingTime ?? 5} min di lettura</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
