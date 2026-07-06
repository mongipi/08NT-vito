import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lavora con noi - 08 Natural Technology',
  description: 'Opportunita di collaborazione con 08 Natural Technology per professionisti, consulenti e partner orientati al benessere.',
}

const AREAS = [
  {
    title: 'Area commerciale',
    body: 'Collaborazioni con figure capaci di raccontare il valore del prodotto con precisione, metodo e attenzione al cliente.',
  },
  {
    title: 'Consulenza e divulgazione',
    body: 'Professionisti interessati a contribuire a un linguaggio chiaro, responsabile e coerente con la qualita 08.',
  },
  {
    title: 'Partner territoriali',
    body: 'Relazioni con realta locali, farmacie, parafarmacie, erboristerie e operatori del benessere.',
  },
]

export default function LavoraConNoiPage() {
  return (
    <main>
      <section className="page-hero products-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">08 Natural Technology</div>
          <h1 className="v61-title" style={{ color: 'var(--silver-3)', fontSize: 'clamp(2.7rem,6vw,4.9rem)' }}>
            Lavora <em style={{ color: 'var(--amber)' }}>con noi.</em>
          </h1>
          <p style={{ maxWidth: 760, color: 'rgba(253,246,232,.68)', lineHeight: 1.75, marginTop: 10 }}>
            Cerchiamo collaborazioni costruite su competenza, fiducia e attenzione reale alla qualita del progetto.
          </p>
        </div>
      </section>

      <section className="section v61-work-section">
        <div className="v61-inner v61-work-intro">
          <div>
            <div className="v61-eyebrow">Crescere con metodo</div>
            <h2 className="v61-title">Un progetto giovane,<br /><em>con standard chiari.</em></h2>
          </div>
          <p>
            08 Natural Technology valuta collaborazioni con persone e realta che condividono un approccio serio,
            chiaro e orientato al benessere quotidiano. Ogni rapporto nasce dal rispetto per il prodotto,
            per il cliente e per il modo in cui il brand viene rappresentato.
          </p>
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
          <h2>Raccontaci il tuo profilo.</h2>
          <p>
            Se pensi di poter contribuire alla crescita di 08 Natural Technology, inviaci una presentazione
            sintetica: esperienze, area di interesse e modalita di collaborazione proposta.
          </p>
          <Link className="v61-button" href="/contatti">Contattaci</Link>
        </div>
      </section>
    </main>
  )
}
