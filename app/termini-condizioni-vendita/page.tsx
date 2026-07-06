import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Termini e condizioni di vendita',
  description: 'Condizioni applicabili agli acquisti effettuati sul sito 08 Natural Technology.',
}

const sections: LegalSection[] = [
  {
    title: '1. Titolare e ambito di applicazione',
    titleEn: '1. Data Controller and scope of application',
    paragraphs: [
      'Le presenti condizioni disciplinano gli acquisti effettuati sul sito 08 Natural Technology, gestito da VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729, Codice Fiscale 08203650729 e REA BA - 611529.',
      'Le condizioni si applicano agli ordini effettuati da clienti consumatori e, ove compatibili, da professionisti, aziende o rivenditori. Eventuali condizioni particolari concordate per canali B2B o distribuzione prevalgono solo se confermate per iscritto.',
    ],
    paragraphsEn: [
      'These terms and conditions govern purchases made on the 08 Natural Technology website, operated by VIPHARMA di Tatulli Vito & Co. S.A.S., with registered office at Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), Italy, VAT number 08203650729, Tax Code 08203650729 and REA BA - 611529.',
      'These terms apply to orders placed by consumer customers and, where compatible, by professionals, businesses or resellers. Any special terms agreed for B2B or distribution channels prevail only if confirmed in writing.',
    ],
  },
  {
    title: '2. Prodotti',
    titleEn: '2. Products',
    paragraphs: [
      'I prodotti 08 Natural Technology sono integratori alimentari. Le informazioni presenti nelle schede prodotto hanno finalità informative e commerciali e non sostituiscono il parere del medico, del farmacista o di altro professionista sanitario.',
      'Prima dell’utilizzo è necessario leggere etichetta, modalità d’uso, ingredienti e avvertenze riportate sulla confezione. Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano.',
    ],
    paragraphsEn: [
      '08 Natural Technology products are food supplements. The information in the product pages is provided for informational and commercial purposes and does not replace the advice of a doctor, pharmacist or other healthcare professional.',
      'Before use, it is necessary to read the label, instructions for use, ingredients and warnings on the packaging. Food supplements are not a substitute for a varied and balanced diet and a healthy lifestyle.',
    ],
  },
  {
    title: '3. Prezzi e disponibilità',
    titleEn: '3. Prices and availability',
    paragraphs: [
      'I prezzi sono indicati in euro e, salvo diversa indicazione, includono IVA. Eventuali costi di spedizione, supplementi o servizi aggiuntivi sono mostrati durante il checkout prima della conferma dell’ordine.',
      'Prezzi, promozioni e disponibilità possono variare nel tempo. In caso di errore evidente su prezzo, disponibilità o descrizione del prodotto, il Titolare potrà contattare il cliente per correggere l’errore, proporre una soluzione alternativa o annullare l’ordine con eventuale rimborso.',
    ],
    paragraphsEn: [
      'Prices are shown in euros and, unless otherwise stated, include VAT. Any shipping costs, surcharges or additional services are shown at checkout before the order is confirmed.',
      'Prices, promotions and availability may change over time. In the event of an obvious error in price, availability or product description, the Data Controller may contact the customer to correct the error, propose an alternative solution, or cancel the order with any applicable refund.',
    ],
  },
  {
    title: '4. Ordine e conclusione del contratto',
    titleEn: '4. Order and conclusion of the contract',
    paragraphs: [
      'L’ordine viene trasmesso quando il cliente completa la procedura di checkout e conferma i dati richiesti. La ricezione automatica dell’ordine non implica necessariamente accettazione definitiva, che resta subordinata alla verifica dei dati, della disponibilità dei prodotti e del buon esito del pagamento.',
      'Il cliente è responsabile della correttezza dei dati inseriti, inclusi indirizzo di spedizione, recapiti, dati fiscali e informazioni necessarie alla consegna.',
    ],
    paragraphsEn: [
      'The order is submitted when the customer completes the checkout process and confirms the requested details. Automatic receipt of the order does not necessarily imply final acceptance, which remains subject to verification of the data, product availability and successful payment.',
      'The customer is responsible for the accuracy of the information provided, including shipping address, contact details, tax information and information necessary for delivery.',
    ],
  },
  {
    title: '5. Pagamenti',
    titleEn: '5. Payments',
    paragraphs: [
      'Il sito può consentire pagamenti online tramite provider esterni autorizzati, tra cui Stripe, oppure altri metodi eventualmente indicati al checkout, come bonifico bancario o contrassegno se disponibili.',
      'I dati completi degli strumenti di pagamento non vengono conservati direttamente dal sito. In caso di pagamento non completato o non autorizzato, l’ordine non potrà essere evaso.',
    ],
    paragraphsEn: [
      'The site may allow online payments through authorized external providers, including Stripe, or other methods indicated at checkout, such as bank transfer or cash on delivery, where available.',
      'Full payment instrument data is not stored directly by the site. If payment is not completed or authorized, the order cannot be fulfilled.',
    ],
  },
  {
    title: '6. Spedizioni e consegna',
    titleEn: '6. Shipping and delivery',
    paragraphs: [
      'Le spedizioni sono gestite secondo quanto indicato nella pagina “Spedizioni, Resi e Rimborsi”. Tempi e costi di consegna sono mostrati durante il checkout o nelle comunicazioni successive all’ordine, ove disponibili.',
      'Eventuali ritardi dovuti a corrieri, festività, scioperi, condizioni meteo, cause di forza maggiore o dati incompleti non sono direttamente imputabili al Titolare.',
    ],
    paragraphsEn: [
      'Shipments are managed as described in the "Shipping, Returns and Refunds" page. Delivery times and costs are shown at checkout or in communications following the order, where available.',
      'Delays due to couriers, holidays, strikes, weather conditions, force majeure or incomplete data are not directly attributable to the Data Controller.',
    ],
  },
  {
    title: '7. Diritto di recesso, resi e rimborsi',
    titleEn: '7. Right of withdrawal, returns and refunds',
    paragraphs: [
      'Il cliente consumatore può esercitare il diritto di recesso entro 14 giorni dalla ricezione del prodotto, nei limiti e con le condizioni previste dalla normativa applicabile.',
      'Per prodotti sigillati, integratori alimentari, cosmetici, prodotti per l’igiene o articoli destinati all’assunzione, il reso può essere escluso o rifiutato se il prodotto è stato aperto, utilizzato, danneggiato o privato del sigillo originale.',
      'Le modalità operative per richiedere un reso, le condizioni di restituzione e i tempi di rimborso sono descritti nella pagina “Spedizioni, Resi e Rimborsi”.',
    ],
    paragraphsEn: [
      'Consumer customers may exercise the right of withdrawal within 14 days of receiving the product, within the limits and conditions provided for by applicable regulations.',
      'For sealed products, food supplements, cosmetics, hygiene products or items intended for consumption, returns may be excluded or refused if the product has been opened, used, damaged or the original seal removed.',
      'The procedure for requesting a return, the return conditions and refund times are described in the "Shipping, Returns and Refunds" page.',
    ],
  },
  {
    title: '8. Garanzia legale e prodotti non conformi',
    titleEn: '8. Legal warranty and non-conforming products',
    paragraphs: [
      'Restano fermi i diritti riconosciuti al consumatore dalla normativa applicabile in materia di garanzia legale e conformità dei beni.',
      'In caso di prodotto danneggiato, errato, mancante o non conforme, il cliente è invitato a contattare tempestivamente il servizio clienti all’indirizzo 08naturaltechnology@gmail.com, allegando numero d’ordine, descrizione del problema e documentazione fotografica utile.',
    ],
    paragraphsEn: [
      'The rights recognized to consumers by applicable regulations regarding legal warranty and conformity of goods remain unaffected.',
      'In the event of a damaged, incorrect, missing or non-conforming product, customers are invited to promptly contact customer service at 08naturaltechnology@gmail.com, providing the order number, a description of the issue and any useful photographic documentation.',
    ],
  },
  {
    title: '9. Account utente',
    titleEn: '9. User account',
    paragraphs: [
      'Il cliente può acquistare come ospite o, se disponibile, creare un account personale. Le credenziali di accesso devono essere custodite con cura e non condivise con terzi.',
      'Il Titolare potrà sospendere o limitare l’accesso in caso di uso improprio, violazione delle presenti condizioni, tentativi di frode o attività che possano compromettere la sicurezza del sito.',
    ],
    paragraphsEn: [
      'Customers can purchase as guests or, where available, create a personal account. Login credentials must be kept secure and not shared with third parties.',
      'The Data Controller may suspend or restrict access in the event of misuse, violation of these terms, attempted fraud, or activities that could compromise the security of the site.',
    ],
  },
  {
    title: '10. Responsabilità',
    titleEn: '10. Liability',
    paragraphs: [
      'Il Titolare non risponde di danni derivanti da uso improprio dei prodotti, mancato rispetto delle indicazioni riportate in etichetta, informazioni errate fornite dal cliente, impossibilità temporanea di accesso al sito o eventi non direttamente controllabili.',
      'Nessuna disposizione delle presenti condizioni limita i diritti inderogabili riconosciuti al consumatore dalla legge applicabile.',
    ],
    paragraphsEn: [
      'The Data Controller is not liable for damages arising from improper use of the products, failure to follow the instructions on the label, incorrect information provided by the customer, temporary inability to access the site, or events beyond its direct control.',
      'Nothing in these terms limits the mandatory rights granted to consumers by applicable law.',
    ],
  },
  {
    title: '11. Privacy e cookie',
    titleEn: '11. Privacy and cookies',
    paragraphs: [
      'Il trattamento dei dati personali è disciplinato dalla Privacy Policy. L’utilizzo di cookie e strumenti di tracciamento è disciplinato dalla Cookie Policy e dal pannello preferenze cookie disponibile sul sito.',
    ],
    paragraphsEn: [
      'The processing of personal data is governed by the Privacy Policy. The use of cookies and tracking tools is governed by the Cookie Policy and the cookie preferences panel available on the site.',
    ],
  },
  {
    title: '12. Legge applicabile e foro competente',
    titleEn: '12. Applicable law and jurisdiction',
    paragraphs: [
      'Le presenti condizioni sono disciplinate dalla legge italiana. Per i clienti consumatori resta ferma la competenza del foro del luogo di residenza o domicilio del consumatore, ove prevista dalla legge.',
      'Per clienti non qualificabili come consumatori, eventuali controversie saranno devolute al foro competente individuato secondo la normativa italiana vigente.',
    ],
    paragraphsEn: [
      'These terms are governed by Italian law. For consumer customers, jurisdiction of the court in the place of residence or domicile of the consumer remains in place, where provided for by law.',
      'For customers who do not qualify as consumers, any disputes will be referred to the competent court identified in accordance with current Italian law.',
    ],
  },
  {
    title: '13. Modifiche alle condizioni',
    titleEn: '13. Changes to these terms',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare o modificare le presenti condizioni in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
    paragraphsEn: [
      'The Data Controller reserves the right to update or modify these terms at any time. Changes will be published on this page indicating the date of the last update.',
    ],
  },
]

export default function TerminiCondizioniVenditaPage() {
  return (
    <LegalDocument
      eyebrow="Vendita online"
      eyebrowEn="Online sales"
      title="Termini e condizioni di vendita"
      titleEn="Terms and conditions of sale"
      subtitle="Condizioni applicabili agli acquisti effettuati sul sito 08 Natural Technology."
      subtitleEn="Terms applicable to purchases made on the 08 Natural Technology website."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
