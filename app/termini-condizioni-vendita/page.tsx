import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Termini e condizioni di vendita',
  description: 'Condizioni applicabili agli acquisti effettuati sul sito 08 Natural Technology.',
}

const sections: LegalSection[] = [
  {
    title: '1. Titolare e ambito di applicazione',
    paragraphs: [
      'Le presenti condizioni disciplinano gli acquisti effettuati sul sito 08 Natural Technology, gestito da VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729, Codice Fiscale 08203650729 e REA BA - 611529.',
      'Le condizioni si applicano agli ordini effettuati da clienti consumatori e, ove compatibili, da professionisti, aziende o rivenditori. Eventuali condizioni particolari concordate per canali B2B o distribuzione prevalgono solo se confermate per iscritto.',
    ],
  },
  {
    title: '2. Prodotti',
    paragraphs: [
      'I prodotti 08 Natural Technology sono integratori alimentari. Le informazioni presenti nelle schede prodotto hanno finalità informative e commerciali e non sostituiscono il parere del medico, del farmacista o di altro professionista sanitario.',
      'Prima dell’utilizzo è necessario leggere etichetta, modalità d’uso, ingredienti e avvertenze riportate sulla confezione. Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano.',
    ],
  },
  {
    title: '3. Prezzi e disponibilità',
    paragraphs: [
      'I prezzi sono indicati in euro e, salvo diversa indicazione, includono IVA. Eventuali costi di spedizione, supplementi o servizi aggiuntivi sono mostrati durante il checkout prima della conferma dell’ordine.',
      'Prezzi, promozioni e disponibilità possono variare nel tempo. In caso di errore evidente su prezzo, disponibilità o descrizione del prodotto, il Titolare potrà contattare il cliente per correggere l’errore, proporre una soluzione alternativa o annullare l’ordine con eventuale rimborso.',
    ],
  },
  {
    title: '4. Ordine e conclusione del contratto',
    paragraphs: [
      'L’ordine viene trasmesso quando il cliente completa la procedura di checkout e conferma i dati richiesti. La ricezione automatica dell’ordine non implica necessariamente accettazione definitiva, che resta subordinata alla verifica dei dati, della disponibilità dei prodotti e del buon esito del pagamento.',
      'Il cliente è responsabile della correttezza dei dati inseriti, inclusi indirizzo di spedizione, recapiti, dati fiscali e informazioni necessarie alla consegna.',
    ],
  },
  {
    title: '5. Pagamenti',
    paragraphs: [
      'Il sito può consentire pagamenti online tramite provider esterni autorizzati, tra cui Stripe, oppure altri metodi eventualmente indicati al checkout, come bonifico bancario o contrassegno se disponibili.',
      'I dati completi degli strumenti di pagamento non vengono conservati direttamente dal sito. In caso di pagamento non completato o non autorizzato, l’ordine non potrà essere evaso.',
    ],
  },
  {
    title: '6. Spedizioni e consegna',
    paragraphs: [
      'Le spedizioni sono gestite secondo quanto indicato nella pagina “Spedizioni, Resi e Rimborsi”. Tempi e costi di consegna sono mostrati durante il checkout o nelle comunicazioni successive all’ordine, ove disponibili.',
      'Eventuali ritardi dovuti a corrieri, festività, scioperi, condizioni meteo, cause di forza maggiore o dati incompleti non sono direttamente imputabili al Titolare.',
    ],
  },
  {
    title: '7. Diritto di recesso, resi e rimborsi',
    paragraphs: [
      'Il cliente consumatore può esercitare il diritto di recesso entro 14 giorni dalla ricezione del prodotto, nei limiti e con le condizioni previste dalla normativa applicabile.',
      'Per prodotti sigillati, integratori alimentari, cosmetici, prodotti per l’igiene o articoli destinati all’assunzione, il reso può essere escluso o rifiutato se il prodotto è stato aperto, utilizzato, danneggiato o privato del sigillo originale.',
      'Le modalità operative per richiedere un reso, le condizioni di restituzione e i tempi di rimborso sono descritti nella pagina “Spedizioni, Resi e Rimborsi”.',
    ],
  },
  {
    title: '8. Garanzia legale e prodotti non conformi',
    paragraphs: [
      'Restano fermi i diritti riconosciuti al consumatore dalla normativa applicabile in materia di garanzia legale e conformità dei beni.',
      'In caso di prodotto danneggiato, errato, mancante o non conforme, il cliente è invitato a contattare tempestivamente il servizio clienti all’indirizzo 08naturaltechnology@gmail.com, allegando numero d’ordine, descrizione del problema e documentazione fotografica utile.',
    ],
  },
  {
    title: '9. Account utente',
    paragraphs: [
      'Il cliente può acquistare come ospite o, se disponibile, creare un account personale. Le credenziali di accesso devono essere custodite con cura e non condivise con terzi.',
      'Il Titolare potrà sospendere o limitare l’accesso in caso di uso improprio, violazione delle presenti condizioni, tentativi di frode o attività che possano compromettere la sicurezza del sito.',
    ],
  },
  {
    title: '10. Responsabilità',
    paragraphs: [
      'Il Titolare non risponde di danni derivanti da uso improprio dei prodotti, mancato rispetto delle indicazioni riportate in etichetta, informazioni errate fornite dal cliente, impossibilità temporanea di accesso al sito o eventi non direttamente controllabili.',
      'Nessuna disposizione delle presenti condizioni limita i diritti inderogabili riconosciuti al consumatore dalla legge applicabile.',
    ],
  },
  {
    title: '11. Privacy e cookie',
    paragraphs: [
      'Il trattamento dei dati personali è disciplinato dalla Privacy Policy. L’utilizzo di cookie e strumenti di tracciamento è disciplinato dalla Cookie Policy e dal pannello preferenze cookie disponibile sul sito.',
    ],
  },
  {
    title: '12. Legge applicabile e foro competente',
    paragraphs: [
      'Le presenti condizioni sono disciplinate dalla legge italiana. Per i clienti consumatori resta ferma la competenza del foro del luogo di residenza o domicilio del consumatore, ove prevista dalla legge.',
      'Per clienti non qualificabili come consumatori, eventuali controversie saranno devolute al foro competente individuato secondo la normativa italiana vigente.',
    ],
  },
  {
    title: '13. Modifiche alle condizioni',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare o modificare le presenti condizioni in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
  },
]

export default function TerminiCondizioniVenditaPage() {
  return (
    <LegalDocument
      eyebrow="Vendita online"
      title="Termini e condizioni di vendita"
      subtitle="Condizioni applicabili agli acquisti effettuati sul sito 08 Natural Technology."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
