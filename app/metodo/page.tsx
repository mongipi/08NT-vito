import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Qualità 08 - 08 Natural Technology',
  description: 'Qualità 08 Natural Technology: storia, valori, qualità, Made in Italy e promessa del marchio.',
}

const WELLBEING_VALUES = [
  {
    icon: '⚡',
    title: 'Energia',
    body: 'Il desiderio di sostenere la vitalità quotidiana, nei momenti in cui il corpo richiede maggiore attenzione.',
  },
  {
    icon: '⚖',
    title: 'Equilibrio',
    body: 'La ricerca di formule ordinate, sensate e coerenti con le reali esigenze della persona.',
  },
  {
    icon: '☾',
    title: 'Serenità',
    body: 'La fiducia di scegliere un prodotto curato, chiaro e sviluppato senza scorciatoie comunicative.',
  },
  {
    icon: '♡',
    title: 'Qualità della vita',
    body: 'Il benessere quotidiano come obiettivo: più consapevolezza, più cura, più attenzione ai dettagli.',
  },
]

const METHOD_STEPS = [
  {
    n: '01',
    title: 'Formula',
    body: 'Ogni prodotto nasce da una funzione precisa e da una scelta attenta degli attivi.',
  },
  {
    n: '02',
    title: 'Ingredienti',
    body: 'La selezione degli ingredienti è uno dei punti centrali dell’identità 08.',
  },
  {
    n: '03',
    title: 'Conservazione',
    body: 'Il vetro farmaceutico comunica protezione, qualità e maggiore attenzione alla conservazione.',
  },
  {
    n: '04',
    title: 'Persona',
    body: 'Il cliente non è un numero: ogni scelta deve trasmettere rispetto, cura e fiducia.',
  },
]

const FORMULAS = [
  {
    line: 'Linea Beauty',
    name: 'Capelli, Pelle & Unghie',
    body: 'Formula dedicata con attivi selezionati ed estratti secchi naturali per capelli, pelle e unghie.',
    href: '/prodotti/capelli-pelle-unghie',
  },
  {
    line: 'Linea Donna',
    name: 'MenoPausa Complex',
    body: 'Supporto nutrizionale, con estratti secchi naturali, per il benessere femminile, azione giorno e notte.',
    href: '/prodotti/menopausa-complex',
  },
  {
    line: 'Linea Microcircolo',
    name: 'Microcircolo Superior',
    body: 'Formula pensata per il microcircolo e il drenaggio dei liquidi nelle zone periferiche.',
    href: '/prodotti/microcircolo-superior',
  },
  {
    line: 'Linea Energia',
    name: 'Multivitaminico & Minerali',
    body: 'Formula dedicata per supportare energia, vitalità, benessere quotidiano e stress ossidativo.',
    href: '/prodotti/multivitaminico-minerali',
  },
  {
    line: 'In arrivo',
    name: 'Magnesio NP3',
    body: 'Neuro Performance 3: nuova formula in sviluppo.',
  },
]

export default function MetodoPage() {
  return (
    <main className="v61-quality-page">
      <section className="v61-brand-hero v61-quality-hero">
        <div className="v61-brand-hero-bg">
          <Image src="/v61/img/qualita08-hero-sunset-contact.png" alt="Qualità 08 Natural Technology" fill priority sizes="100vw" />
        </div>
        <div className="v61-brand-hero-inner">
          <div className="v61-eyebrow light">Qualità 08</div>
          <h1>L&apos;<em>Eccellenza</em><br />come Standard.</h1>
          <p>
            08 Natural Technology nasce da un sogno: creare qualcosa di cui poter essere veramente orgogliosi.
            Non volevamo semplicemente realizzare degli integratori, ma dare vita a prodotti sviluppati con
            passione, attenzione e rispetto per le persone che ogni giorno ripongono la loro fiducia in noi.
          </p>
          <div className="v61-quality-hero-actions">
            <Link className="v61-button v61-button-rounded" href="/prodotti">Scopri le formule</Link>
          </div>
        </div>
      </section>

      <section className="section v61-quality-section">
        <div className="v61-inner v61-quality-section-head">
          <div>
            <div className="v61-eyebrow">La nostra promessa</div>
            <h2 className="v61-title">Qualità, innovazione<br /><em>e fiducia.</em></h2>
          </div>
          <p>Dietro ogni formula ci sono ricerca, impegno e una scelta accurata degli ingredienti, perché crediamo che la qualità non sia un dettaglio, ma un valore fondamentale.</p>
        </div>
        <div className="v61-inner v61-quality-duo">
          <article className="v61-quality-panel">
            <h3>Più di un marchio.</h3>
            <p>Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità e qualità della vita. È qualcosa di prezioso che merita attenzione e cura.</p>
            <p>Per questo lavoriamo ogni giorno con lo stesso obiettivo: offrire prodotti che uniscano qualità, innovazione e fiducia, mettendo sempre la persona al centro di ogni scelta.</p>
            <ul className="v61-brand-list">
              <li>Formule sviluppate con attenzione.</li>
              <li>Ingredienti selezionati con cura.</li>
              <li>Comunicazione chiara e responsabile.</li>
              <li>Rispetto verso chi sceglie il nostro brand.</li>
            </ul>
          </article>
          <article className="v61-quality-panel dark">
            <h3>La promessa 08.</h3>
            <p>La qualità, per noi, non è solo un obiettivo: è un metodo.</p>
            <p>Ogni formula 08 Natural Technology viene sviluppata con attenzione alla composizione, alla selezione degli ingredienti e alla chiarezza delle informazioni.</p>
            <p>Vogliamo costruire un rapporto di fiducia attraverso prodotti curati, comunicazione trasparente e un’identità coerente con i valori del benessere quotidiano.</p>
            <ul className="v61-brand-list">
              <li>Processi chiari, pensati per garantire coerenza.</li>
              <li>Standard elevati, in ogni fase del percorso.</li>
              <li>Una visione orientata alla qualità, al valore e alla fiducia.</li>
              <li>Qualità percepita e sostanziale.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section v61-quality-values-section">
        <div className="v61-inner v61-quality-copy-block">
          <div className="v61-eyebrow">I valori del benessere</div>
          <h2 className="v61-title">Energia, equilibrio,<br /><em>serenità e qualità della vita.</em></h2>
          <p>Questi sono i concetti che guidano il linguaggio di 08 Natural Technology: non semplici integratori, ma prodotti pensati per accompagnare il benessere quotidiano con attenzione, qualità e rispetto.</p>
          <div className="v61-quality-card-grid">
            {WELLBEING_VALUES.map((item) => (
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
          <div className="v61-eyebrow light">Cosa ci rende diversi</div>
          <h2 className="v61-title">Alta qualità e attenzione<br /><em>sulle formule.</em></h2>
          <p className="v61-quality-dark-copy">Il posizionamento di 08 non nasce dal voler essere “un altro integratore”, ma dal desiderio di costruire prodotti curati, con formule pensate e ingredienti selezionati evitando materie prime di scarsa qualità.</p>
          <div className="v61-quality-method-grid">
            {METHOD_STEPS.map((item) => (
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
            <div className="v61-eyebrow">A chi ci rivolgiamo</div>
            <h3>Per chi riconosce il valore della qualità.</h3>
            <p>08 Natural Technology si rivolge a chi cerca integratori alimentari curati, chiari e sviluppati con una logica formulativa precisa.</p>
            <p>Ogni prodotto nasce per accompagnare il benessere quotidiano con attenzione, coerenza e rispetto verso chi sceglie il brand.</p>
            <ul className="v61-brand-list">
              <li>Persone che cercano prodotti affidabili e riconoscibili.</li>
              <li>Chi desidera formule curate e facili da comprendere.</li>
              <li>Chi vuole scegliere con maggiore consapevolezza.</li>
            </ul>
          </article>
          <article className="v61-quality-panel">
            <div className="v61-eyebrow">Made in Italy</div>
            <h3>Un valore centrale, non una decorazione.</h3>
            <p>Il Made in Italy rappresenta un elemento distintivo dell’identità di 08 Natural Technology.</p>
            <p>Ogni prodotto nasce in Italia, in un contesto orientato alla qualità, alla cura del dettaglio e alla coerenza del brand.</p>
            <p>Più che un semplice riferimento d’origine, è un valore che accompagna il progetto e ne rafforza l’affidabilità.</p>
            <ul className="v61-brand-list">
              <li>Identità italiana riconoscibile.</li>
              <li>Qualità e coerenza in ogni scelta.</li>
              <li>Un’origine che valorizza il prodotto.</li>
              <li>Un approccio fondato su fiducia e credibilità.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section v61-quality-values-section" id="formule">
        <div className="v61-inner v61-quality-section-head">
          <div>
            <div className="v61-eyebrow">Linea prodotti</div>
            <h2 className="v61-title">Le nostre formule,<br /><em>in continuo sviluppo.</em></h2>
          </div>
          <p>08 è all’inizio del proprio percorso. Lo 0 rappresenta la nascita del progetto; l’8 rappresenta la volontà di crescere, migliorare e ampliare la linea nel tempo.</p>
        </div>
        <div className="v61-inner v61-quality-products-grid">
          {FORMULAS.map((item) => (
            <article className="v61-quality-product-card" key={item.name}>
              <small>{item.line}</small>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
              {item.href ? <Link href={item.href}>Scopri <span>→</span></Link> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section v61-quality-vision-section">
        <div className="v61-inner v61-quality-vision">
          <h2>Vision.</h2>
          <p><strong>L&apos;Eccellenza come Standard</strong> è il principio che definisce la visione di 08 Natural Technology.</p>
          <p>Un modo di intendere il benessere che parte dalla qualità, dalla coerenza e dalla cura di ogni dettaglio, con l’obiettivo di costruire un’identità riconoscibile e duratura.</p>
          <p>Ogni formula diventa parte di un progetto più ampio: creare prodotti affidabili, curati e distintivi, pensati per accompagnare il quotidiano con serietà e valore.</p>
          <div className="v61-quality-vision-actions">
            <Link className="v61-button" href="/prodotti">Scopri i prodotti</Link>
            <Link className="v61-button dark" href="/contatti">Contattaci</Link>
          </div>
        </div>
      </section>
    </main>
  )
}