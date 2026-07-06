import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Note Legali',
  description: 'Informazioni legali relative all’utilizzo del sito 08 Natural Technology.',
}

const sections: LegalSection[] = [
  {
    title: '1. Informazioni sul titolare del sito',
    paragraphs: [
      'Il sito 08 Natural Technology è gestito da VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729, Codice Fiscale 08203650729 e REA BA - 611529.',
      'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
    ],
  },
  {
    title: '2. Accesso e utilizzo del sito',
    paragraphs: [
      'L’accesso e l’utilizzo del sito comportano l’accettazione delle presenti Note Legali. L’utente si impegna a utilizzare il sito in modo lecito, corretto e conforme alla normativa applicabile, evitando qualsiasi comportamento che possa danneggiare, compromettere o limitare il funzionamento del sito stesso.',
    ],
  },
  {
    title: '3. Proprietà intellettuale',
    paragraphs: [
      'Tutti i contenuti presenti sul sito, inclusi testi, immagini, fotografie, grafiche, loghi, marchi, elementi visuali, layout, descrizioni prodotto e materiali informativi, sono di proprietà del Titolare o concessi in uso da soggetti terzi autorizzati.',
      'È vietata la riproduzione, distribuzione, modifica, pubblicazione, copia o utilizzo dei contenuti del sito senza preventiva autorizzazione scritta del Titolare.',
    ],
  },
  {
    title: '4. Marchio 08 Natural Technology',
    paragraphs: [
      'Il marchio 08 Natural Technology, il relativo logo, l’identità visiva e i materiali collegati rappresentano elementi distintivi del brand. Qualsiasi utilizzo non autorizzato del marchio o dei suoi elementi grafici è vietato.',
    ],
  },
  {
    title: '5. Informazioni sui prodotti',
    paragraphs: [
      'Le informazioni presenti sul sito hanno finalità informative e commerciali. I prodotti 08 Natural Technology sono integratori alimentari e non devono essere intesi come medicinali né come strumenti destinati a diagnosticare, trattare, curare o prevenire malattie.',
      'Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano. Prima dell’utilizzo, si raccomanda di leggere attentamente l’etichetta, le modalità d’uso e le avvertenze riportate sulla confezione.',
      'In caso di gravidanza, allattamento, patologie, terapie farmacologiche in corso o dubbi specifici, è consigliabile consultare il medico o il farmacista prima dell’assunzione.',
    ],
  },
  {
    title: '6. Accuratezza delle informazioni',
    paragraphs: [
      'Il Titolare si impegna a mantenere aggiornate e corrette le informazioni pubblicate sul sito. Tuttavia, non può essere esclusa la presenza di errori materiali, refusi, imprecisioni tecniche, variazioni di disponibilità, immagini puramente illustrative o aggiornamenti non ancora recepiti.',
      'Il Titolare si riserva il diritto di modificare, aggiornare o correggere in qualsiasi momento contenuti, descrizioni, immagini, prezzi, disponibilità e caratteristiche dei prodotti, senza obbligo di preavviso.',
    ],
  },
  {
    title: '7. Prezzi, disponibilità e ordini',
    paragraphs: [
      'Prezzi, promozioni e disponibilità dei prodotti possono variare nel tempo. L’eventuale conferma automatica della ricezione dell’ordine non implica necessariamente accettazione definitiva dello stesso, che resta subordinata alla verifica della disponibilità, della correttezza dei dati e del buon esito del pagamento.',
      'In caso di errore evidente su prezzo, disponibilità o descrizione del prodotto, il Titolare si riserva il diritto di contattare il cliente per proporre una soluzione alternativa, correggere l’errore o annullare l’ordine con eventuale rimborso.',
    ],
  },
  {
    title: '8. Pagamenti',
    paragraphs: [
      'I pagamenti online possono essere gestiti tramite provider esterni autorizzati, tra cui Stripe. I dati completi relativi agli strumenti di pagamento non vengono conservati direttamente dal sito, ma trattati dai rispettivi provider secondo le proprie condizioni e informative privacy.',
    ],
  },
  {
    title: '9. Link esterni',
    paragraphs: [
      'Il sito può contenere collegamenti a siti, piattaforme o servizi di terze parti. Il Titolare non è responsabile dei contenuti, delle informative privacy, delle condizioni di utilizzo o delle pratiche adottate da siti esterni non gestiti direttamente.',
    ],
  },
  {
    title: '10. Limitazione di responsabilità',
    paragraphs: [
      'Il Titolare non garantisce che il sito sia sempre disponibile, privo di errori, interruzioni, vulnerabilità o malfunzionamenti tecnici. Nei limiti consentiti dalla legge, il Titolare non risponde di eventuali danni derivanti da uso improprio del sito, impossibilità temporanea di accesso, problemi tecnici, errori dell’utente o utilizzo non conforme delle informazioni pubblicate.',
    ],
  },
  {
    title: '11. Privacy e cookie',
    paragraphs: [
      'Il trattamento dei dati personali degli utenti è disciplinato dalla Privacy Policy del sito. L’utilizzo di cookie e strumenti di tracciamento è disciplinato dalla Cookie Policy. L’utente è invitato a consultare entrambe le informative per maggiori dettagli.',
    ],
  },
  {
    title: '12. Risoluzione delle controversie',
    paragraphs: [
      'Per eventuali reclami o segnalazioni, l’utente può contattare il Titolare ai recapiti indicati nella presente pagina. Il Titolare valuterà la richiesta e fornirà riscontro entro tempi ragionevoli.',
      'La piattaforma europea per la risoluzione online delle controversie dei consumatori, nota come piattaforma ODR, è stata dismessa dal 20 luglio 2025. Restano fermi gli eventuali strumenti di tutela previsti dalla normativa vigente, inclusi gli organismi ADR competenti, ove applicabili.',
    ],
  },
  {
    title: '13. Legge applicabile e foro competente',
    paragraphs: [
      'Le presenti Note Legali sono disciplinate dalla legge italiana. Per gli utenti consumatori restano fermi i diritti inderogabili previsti dalla normativa applicabile, inclusa la competenza del foro del luogo di residenza o domicilio del consumatore, ove prevista dalla legge.',
      'Per gli utenti non qualificabili come consumatori, eventuali controversie saranno devolute al foro competente individuato secondo la normativa italiana vigente.',
    ],
  },
  {
    title: '14. Modifiche alle Note Legali',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare o modificare le presenti Note Legali in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
  },
]

export default function NoteLegaliPage() {
  return (
    <LegalDocument
      eyebrow="Legale"
      title="Note Legali"
      subtitle="Informazioni legali relative all’utilizzo del sito 08 Natural Technology."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
