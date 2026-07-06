import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'B2B - Diventa Rivenditore' }

const OFFERINGS = [
  'Catalogo prodotti',
  'Schede tecniche PDF',
  'Listino commerciale',
  'Materiale vetrina',
  'Contenuti social',
  'Supporto formazione',
  'Assistenza commerciale',
  'Materiali promozionali',
]

const TRUST_ITEMS = [
  { label: 'Prodotti notificati', body: 'Integratori alimentari notificati al Ministero della Salute della Repubblica Italiana dove indicato.' },
  { label: 'Made in Italy', body: 'Progetto nato a Bitonto, in Puglia. Identità italiana chiara e riconoscibile.' },
  { label: 'Formule curate', body: 'Ingredienti selezionati, dosaggi dichiarati, comunicazione responsabile e trasparente.' },
]

export default function B2BPage() {
  return (
    <main>
      <section className="page-hero v61-b2b-hero">
        <div className="v61-inner">
          <div className="v61-eyebrow light">B2B</div>
          <h1 className="v61-title">Diventa rivenditore<br /><em>08 Natural Technology.</em></h1>
          <p>Pagina dedicata a farmacie, parafarmacie, erboristerie e operatori del settore. Qui il sito raccoglie contatti qualificati e richieste catalogo da partner commerciali interessati alla linea 08 Natural Technology.</p>
          <p>Siamo presenti in farmacia, parafarmacia ed erboristeria. Se sei un operatore del settore e vuoi portare 08 nel tuo punto vendita, contattaci per ricevere il catalogo commerciale e le condizioni di fornitura.</p>
          <Link className="v61-button" href="/contatti">Richiedi informazioni</Link>
        </div>
      </section>

      <section className="section">
        <div className="v61-inner v61-b2b-grid">
          <div className="v61-b2b-box">
            <h2 className="v61-title">Cosa offriamo<br /><em>al rivenditore.</em></h2>
            <div className="v61-check-grid">
              {OFFERINGS.map((item) => <span className="v61-check" key={item}>{item}</span>)}
            </div>
            <div className="v61-b2b-zone">
              <small>Zona di distribuzione</small>
              VIPHARMA di Tatulli Vito &amp; Co. S.A.S.<br />
              Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA)<br />
              Tel. 080 303 1103 · 08naturaltechnology@gmail.com
            </div>
          </div>

          <aside className="v61-b2b-trust">
            <div className="v61-eyebrow">Perché 08</div>
            <h2 className="v61-title">Un marchio che costruisce fiducia<br /><em>nel punto vendita.</em></h2>
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
