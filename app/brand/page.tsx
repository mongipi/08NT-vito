import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Brand — 08 Natural Technology' }

const VALUES = [
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
    icon: '✦',
    title: 'Serenità',
    body: 'La fiducia di scegliere un prodotto curato, chiaro e sviluppato senza scorciatoie comunicative.',
  },
  {
    icon: '♥',
    title: 'Qualità della vita',
    body: 'Il benessere quotidiano come obiettivo: più consapevolezza, più cura, più attenzione ai dettagli.',
  },
]

const DIFFERENTIATORS = [
  { k: '01', t: 'Formula', b: 'Ogni prodotto nasce da una funzione precisa e da una scelta attenta degli attivi.' },
  { k: '02', t: 'Ingredienti', b: 'La selezione degli ingredienti è uno dei punti centrali dell\'identità 08.' },
  { k: '03', t: 'Conservazione', b: 'Il vetro farmaceutico comunica protezione, qualità e maggiore attenzione alla conservazione.' },
  { k: '04', t: 'Persona', b: 'Il cliente non è un numero: ogni scelta deve trasmettere rispetto, cura e fiducia.' },
]

const PRODUCTS = [
  { line: 'Linea Beauty', name: 'Capelli, Pelle & Unghie', desc: 'Formula dedicata alla bellezza quotidiana.' },
  { line: 'Linea Donna', name: 'MenoPausa Complex', desc: 'Supporto nutrizionale per il benessere femminile.' },
  { line: 'Linea Circolo', name: 'Microcircolo Superior', desc: 'Formula dedicata alla leggerezza delle gambe.' },
  { line: 'Linea Energia', name: 'Multivitaminico & Minerali', desc: 'Supporto quotidiano con vitamine e minerali.' },
  { line: 'In arrivo', name: 'Magnesio NP3', desc: 'Neuro Performance 3: nuova formula in sviluppo.' },
]

export default function BrandPage() {
  return (
    <main>
      {/* ── BRAND HERO ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--forest) 0%, #071f10 100%)',
          borderBottom: '1px solid rgba(184,144,60,0.25)',
          minHeight: 560,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="hero-col hero-col-l"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: 760,
          }}
        >
          <Eyebrow light>Brand 08 Natural Technology</Eyebrow>

          <h1
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 300,
              lineHeight: 1.03,
              letterSpacing: '-0.02em',
              color: 'var(--silver-3)',
              marginBottom: 24,
            }}
          >
            L&apos;<em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>Eccellenza</em>
            <br />come Standard.
          </h1>

          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              color: 'rgba(253,246,232,0.66)',
              lineHeight: 1.9,
              maxWidth: 560,
              marginBottom: 30,
            }}
          >
            08 Natural Technology nasce da un sogno: creare qualcosa di cui poter essere
            veramente orgogliosi. Non volevamo semplicemente realizzare degli integratori,
            ma dare vita a prodotti sviluppati con passione, attenzione e rispetto per le
            persone che ogni giorno ripongono la loro fiducia in noi.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/prodotti"
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '13px 26px',
                background: 'var(--amber)',
                color: 'var(--forest)',
                border: '1px solid var(--amber)',
              }}
            >
              Scopri le formule
            </Link>
            <Link
              href="/trasparenza"
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '13px 26px',
                background: 'transparent',
                color: 'rgba(253,246,232,0.78)',
                border: '1px solid rgba(253,246,232,0.22)',
              }}
            >
              Qualità &amp; Trasparenza
            </Link>
          </div>
        </div>
      </section>

      {/* ── LA NOSTRA PROMESSA ── */}
      <section className="section">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10" style={{ marginBottom: 46 }}>
          <div>
            <Eyebrow>La nostra promessa</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
              }}
            >
              Qualità, innovazione<br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>e fiducia.</em>
            </h2>
          </div>
          <p style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9, maxWidth: 480 }}>
            Dietro ogni formula ci sono ricerca, impegno e una scelta accurata degli ingredienti,
            perché crediamo che la qualità non sia un dettaglio, ma un valore fondamentale.
          </p>
        </div>

        {/* Dual panels */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BrandPanel>
            <BrandPanelTitle>Più di un marchio.</BrandPanelTitle>
            <BrandPanelText>
              Per noi il benessere non è una semplice parola: è energia, equilibrio, serenità
              e qualità della vita. È qualcosa di prezioso che merita attenzione e cura.
            </BrandPanelText>
            <BrandPanelText>
              Per questo lavoriamo ogni giorno con lo stesso obiettivo: offrire prodotti che
              uniscano qualità, innovazione e fiducia, mettendo sempre la persona al centro
              di ogni scelta.
            </BrandPanelText>
            <BrandList items={[
              'Formule sviluppate con attenzione.',
              'Ingredienti selezionati con cura.',
              'Comunicazione chiara e responsabile.',
              'Rispetto verso chi sceglie il nostro brand.',
            ]} />
          </BrandPanel>

          <BrandPanel dark>
            <BrandPanelTitle dark>La promessa 08.</BrandPanelTitle>
            <BrandPanelText dark>
              08 Natural Technology è una promessa di impegno, qualità e rispetto verso chi
              ci sceglie.
            </BrandPanelText>
            <BrandPanelText dark>
              Non promettiamo risultati impossibili e non comunichiamo i nostri prodotti come
              soluzioni miracolose. Vogliamo costruire fiducia attraverso serietà, cura
              formulativa e trasparenza.
            </BrandPanelText>
            <BrandList dark items={[
              'Nessuna promessa del "100% funziona".',
              'Nessun claim terapeutico o eccessivo.',
              'Solo comunicazione coerente e verificabile.',
              'Qualità percepita e sostanziale.',
            ]} />
          </BrandPanel>
        </div>
      </section>

      {/* ── I VALORI ── */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <Eyebrow>I valori del benessere</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(22px, 3vw, 44px)',
            fontWeight: 300,
            lineHeight: 1.13,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            marginBottom: 12,
          }}
        >
          Energia, equilibrio,<br />
          <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>serenità e qualità della vita.</em>
        </h2>
        <p style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9, maxWidth: 680, marginBottom: 42 }}>
          Questi sono i concetti che guidano il linguaggio del brand: non solo integratori, ma
          prodotti pensati per accompagnare il benessere quotidiano con attenzione e rispetto.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16 }}>
          {VALUES.map((v) => (
            <div
              key={v.title}
              style={{
                background: '#fff',
                border: '1px solid var(--border-2)',
                padding: '28px 22px',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 14, color: 'var(--amber)' }}>{v.icon}</div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                  marginBottom: 8,
                }}
              >
                {v.title}
              </div>
              <p style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.75 }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COSA CI RENDE DIVERSI ── */}
      <section className="section" style={{ background: 'var(--forest)' }}>
        <Eyebrow light>Cosa ci rende diversi</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(22px, 3vw, 44px)',
            fontWeight: 300,
            lineHeight: 1.13,
            letterSpacing: '-0.01em',
            color: '#f0ede8',
            marginBottom: 12,
          }}
        >
          Alta qualità e attenzione<br />
          <em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>sulle formule.</em>
        </h2>
        <p style={{ fontSize: 12.5, fontWeight: 300, color: 'rgba(253,246,232,0.52)', lineHeight: 1.9, maxWidth: 680, marginBottom: 48 }}>
          Il posizionamento di 08 non nasce dal voler essere "un altro integratore", ma dal
          desiderio di costruire prodotti curati, con formule pensate e ingredienti selezionati
          evitando materie prime di scarsa qualità.
        </p>

        {/* Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: 'rgba(184,144,60,0.12)' }}>
          {DIFFERENTIATORS.map((d) => (
            <div
              key={d.k}
              style={{
                padding: '28px 22px',
                background: 'var(--forest)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 36,
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'rgba(184,144,60,0.3)',
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {d.k}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,237,232,0.75)',
                  marginBottom: 8,
                }}
              >
                {d.t}
              </div>
              <p style={{ fontSize: 11, fontWeight: 300, lineHeight: 1.75, color: 'rgba(253,246,232,0.42)' }}>
                {d.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── A CHI CI RIVOLGIAMO + MADE IN ITALY ── */}
      <section className="section">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BrandPanel>
            <Eyebrow>A chi ci rivolgiamo</Eyebrow>
            <BrandPanelTitle>Per chi cerca un prodotto fatto con serietà.</BrandPanelTitle>
            <BrandPanelText>
              08 Natural Technology si rivolge a chi desidera un integratore alimentare di
              alta qualità, pensato con attenzione e senza ingredienti scelti solo per
              riempire una formula.
            </BrandPanelText>
            <BrandPanelText>
              Il nostro pubblico è composto da persone che cercano prodotti curati, chiari,
              riconoscibili e sviluppati con una logica precisa.
            </BrandPanelText>
            <BrandList items={[
              'Clienti attenti alla qualità.',
              'Persone che cercano prodotti Made in Italy.',
              'Farmacie, parafarmacie ed erboristerie.',
              'Clienti che vogliono chiarezza prima di acquistare.',
            ]} />
          </BrandPanel>

          <BrandPanel>
            <Eyebrow>Made in Italy</Eyebrow>
            <BrandPanelTitle>Un valore centrale, non una decorazione.</BrandPanelTitle>
            <BrandPanelText>
              Il Made in Italy è un elemento fondamentale per 08 Natural Technology. Molti
              clienti, anche dall&apos;estero, cercano prodotti italiani perché li associano
              a qualità, controllo e affidabilità.
            </BrandPanelText>
            <BrandPanelText>
              Il progetto nasce e si sviluppa in Italia. La sede aziendale è a Bitonto, in
              provincia di Bari, ma il brand non vuole legarsi a uno storytelling territoriale
              forzato: l&apos;attenzione deve restare sulla qualità del prodotto e
              sull&apos;identità italiana.
            </BrandPanelText>
            <BrandList items={[
              'Identità italiana chiara.',
              'Sede aziendale in Puglia.',
              'Nessun racconto territoriale artificiale.',
              'Focus su qualità, prodotto e fiducia.',
            ]} />
          </BrandPanel>
        </div>
      </section>

      {/* ── LINEA PRODOTTI ── */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10" style={{ marginBottom: 42 }}>
          <div>
            <Eyebrow>Linea prodotti</Eyebrow>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 44px)',
                fontWeight: 300,
                lineHeight: 1.13,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
              }}
            >
              Oggi quattro formule.<br />
              <em style={{ fontStyle: 'italic', color: 'var(--green-2)' }}>Domani una linea completa.</em>
            </h2>
          </div>
          <p style={{ fontSize: 12.5, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.9, maxWidth: 480 }}>
            08 è all&apos;inizio del proprio percorso. Lo 0 rappresenta la nascita del progetto;
            l&apos;8 rappresenta la volontà di crescere, migliorare e ampliare la linea nel tempo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" style={{ gap: 1, background: 'var(--border)' }}>
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              style={{
                background: '#fff',
                padding: '22px 18px',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-4)',
                  marginBottom: 6,
                }}
              >
                {p.line}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 18,
                  fontWeight: 400,
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {p.name}
              </div>
              <p style={{ fontSize: 11, fontWeight: 300, color: 'var(--ink-3)', lineHeight: 1.7 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND FINALE ── */}
      <section
        className="section"
        style={{ textAlign: 'center', background: 'var(--forest)', borderTop: '1px solid rgba(184,144,60,0.2)' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 300,
            color: '#f0ede8',
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          Qualità, Fiducia<br />e Visione.
        </div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: 'rgba(253,246,232,0.5)',
            lineHeight: 1.9,
            maxWidth: 620,
            margin: '0 auto 28px',
          }}
        >
          &ldquo;L&apos;Eccellenza come Standard&rdquo; è la frase che deve restare impressa: 08 Natural
          Technology non vuole essere percepito come un marchio qualunque, ma come un progetto
          che parte dall&apos;inizio con l&apos;ambizione di costruire qualità, fiducia e
          riconoscibilità nel tempo.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/prodotti"
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '13px 26px',
              background: 'var(--amber)',
              color: 'var(--forest)',
              border: '1px solid var(--amber)',
            }}
          >
            Scopri i prodotti
          </Link>
          <Link
            href="/contatti"
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '13px 26px',
              background: 'transparent',
              color: 'rgba(253,246,232,0.78)',
              border: '1px solid rgba(253,246,232,0.22)',
            }}
          >
            Contattaci
          </Link>
        </div>
      </section>
    </main>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className="mb-3.5 flex items-center gap-2.5"
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: '0.26em',
        textTransform: 'uppercase',
        color: light ? 'rgba(184,144,60,0.72)' : 'var(--amber)',
      }}
    >
      <span
        style={{
          display: 'block',
          width: 22,
          height: '0.5px',
          background: 'var(--amber)',
          opacity: light ? 0.75 : 1,
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  )
}

function BrandPanel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      style={{
        background: dark ? 'var(--forest)' : '#fff',
        border: dark ? '1px solid rgba(184,144,60,0.2)' : '1px solid var(--border-2)',
        padding: 32,
      }}
    >
      {children}
    </div>
  )
}

function BrandPanelTitle({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-cormorant), Georgia, serif',
        fontSize: 28,
        fontWeight: 400,
        color: dark ? '#f0ede8' : 'var(--ink)',
        marginBottom: 14,
        lineHeight: 1.2,
      }}
    >
      {children}
    </h3>
  )
}

function BrandPanelText({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 300,
        lineHeight: 1.85,
        color: dark ? 'rgba(253,246,232,0.52)' : 'var(--ink-3)',
        marginBottom: 14,
      }}
    >
      {children}
    </p>
  )
}

function BrandList({ items, dark }: { items: string[]; dark?: boolean }) {
  return (
    <ul style={{ listStyle: 'none', marginTop: 4 }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 11,
            fontWeight: 300,
            color: dark ? 'rgba(253,246,232,0.55)' : 'var(--ink-3)',
            borderTop: `0.5px solid ${dark ? 'rgba(184,144,60,0.12)' : 'var(--border)'}`,
            padding: '9px 0',
          }}
        >
          <span style={{ color: dark ? 'var(--amber)' : 'var(--green-2)', marginRight: 8 }}>•</span>
          {item}
        </li>
      ))}
    </ul>
  )
}
