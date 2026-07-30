import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali di 08 Natural Technology.',
}

const sections: LegalSection[] = [
  {
    title: '1. Titolare del trattamento',
    titleEn: '1. Data Controller',
    paragraphs: [
      'Il Titolare del trattamento dei dati personali è VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729 e Codice Fiscale 08203650729.',
      'Per qualsiasi richiesta relativa al trattamento dei dati personali è possibile contattare il Titolare all’indirizzo email 08naturaltechnology@gmail.com oppure tramite PEC vipharma@pec.it.',
    ],
    paragraphsEn: [
      'The Data Controller for the processing of personal data is VIPHARMA di Tatulli Vito & Co. S.A.S., with registered office at Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), Italy, VAT number 08203650729 and Tax Code 08203650729.',
      'For any request regarding the processing of personal data, the Data Controller can be contacted at 08naturaltechnology@gmail.com or via certified email (PEC) at vipharma@pec.it.',
    ],
  },
  {
    title: '2. Tipologie di dati trattati',
    titleEn: '2. Types of data processed',
    paragraphs: ['Attraverso il sito 08 Natural Technology possono essere trattate le seguenti categorie di dati:'],
    paragraphsEn: ['Through the 08 Natural Technology website, the following categories of data may be processed:'],
    items: [
      'dati di navigazione, come indirizzo IP, dati tecnici del browser, dispositivo utilizzato, data e ora di accesso e pagine visitate;',
      'dati forniti volontariamente, come nome, cognome, email, numero di telefono e informazioni inserite nei moduli di contatto;',
      'dati relativi agli ordini, inclusi dati anagrafici, indirizzo di spedizione, recapiti, dati di fatturazione, prodotti acquistati e informazioni necessarie alla gestione dell’acquisto;',
      'dati di pagamento, gestiti tramite provider esterni autorizzati, tra cui Stripe. Il sito non conserva i dati completi delle carte di pagamento;',
      'dati per comunicazioni commerciali, come indirizzo email e preferenze, solo in caso di consenso espresso dell’utente.',
    ],
    itemsEn: [
      'browsing data, such as IP address, technical browser data, device used, date and time of access and pages visited;',
      'data voluntarily provided, such as first name, last name, email, phone number and information entered in contact forms;',
      'order-related data, including personal details, shipping address, contact details, billing information, purchased products and information necessary to manage the purchase;',
      'payment data, managed through authorized external providers, including Stripe. The site does not store full payment card data;',
      'data for commercial communications, such as email address and preferences, only with the user\'s express consent.',
    ],
  },
  {
    title: '3. Finalità del trattamento',
    titleEn: '3. Purposes of processing',
    paragraphs: ['I dati personali sono trattati per le seguenti finalità:'],
    paragraphsEn: ['Personal data is processed for the following purposes:'],
    items: [
      'consentire la corretta navigazione e il funzionamento tecnico del sito;',
      'rispondere a richieste inviate tramite moduli di contatto, email o altri canali di comunicazione;',
      'gestire ordini, pagamenti, spedizioni, resi, assistenza clienti e comunicazioni post-vendita;',
      'adempiere a obblighi amministrativi, fiscali, contabili e di legge;',
      'prevenire frodi, abusi, accessi non autorizzati o utilizzi impropri del sito;',
      'inviare comunicazioni promozionali, newsletter o aggiornamenti commerciali solo previo consenso dell’utente;',
      'analizzare l’utilizzo del sito e migliorare servizi, contenuti e prestazioni, ove previsto anche tramite cookie e strumenti di tracciamento.',
    ],
    itemsEn: [
      'enable proper browsing and technical operation of the site;',
      'respond to requests sent through contact forms, email or other communication channels;',
      'manage orders, payments, shipments, returns, customer support and post-sale communications;',
      'fulfil administrative, tax, accounting and legal obligations;',
      'prevent fraud, abuse, unauthorized access or improper use of the site;',
      'send promotional communications, newsletters or commercial updates only with prior user consent;',
      'analyze site usage and improve services, content and performance, including through cookies and tracking tools where applicable.',
    ],
  },
  {
    title: '4. Base giuridica del trattamento',
    titleEn: '4. Legal basis for processing',
    paragraphs: ['Il trattamento dei dati personali si basa, a seconda dei casi, su:'],
    paragraphsEn: ['The processing of personal data is based, depending on the case, on:'],
    items: [
      'esecuzione di un contratto o misure precontrattuali, per ordini, richieste, assistenza e gestione del rapporto con il cliente;',
      'obbligo di legge, per adempimenti fiscali, contabili e amministrativi;',
      'legittimo interesse del Titolare, per sicurezza del sito, prevenzione frodi, tutela dei diritti e miglioramento dei servizi;',
      'consenso dell’utente, per newsletter, marketing, cookie non tecnici e strumenti di profilazione o analisi non anonimizzata.',
    ],
    itemsEn: [
      'performance of a contract or pre-contractual measures, for orders, requests, support and management of the customer relationship;',
      'legal obligation, for tax, accounting and administrative compliance;',
      'legitimate interest of the Data Controller, for site security, fraud prevention, protection of rights and improvement of services;',
      'user consent, for newsletters, marketing, non-technical cookies and profiling or non-anonymized analytics tools.',
    ],
  },
  {
    title: '5. Modalità del trattamento',
    titleEn: '5. Processing methods',
    paragraphs: [
      'I dati sono trattati con strumenti informatici, telematici e, ove necessario, cartacei, adottando misure tecniche e organizzative adeguate a proteggerli da accessi non autorizzati, perdita, alterazione, divulgazione o utilizzo improprio.',
      'Il trattamento è effettuato esclusivamente da soggetti autorizzati e istruiti, nel rispetto dei principi di liceità, correttezza, trasparenza, minimizzazione e limitazione della conservazione.',
    ],
    paragraphsEn: [
      'Data is processed using IT, telematic and, where necessary, paper-based tools, adopting technical and organizational measures adequate to protect it from unauthorized access, loss, alteration, disclosure or improper use.',
      'Processing is carried out exclusively by authorized and trained personnel, in compliance with the principles of lawfulness, fairness, transparency, data minimization and storage limitation.',
    ],
  },
  {
    title: '6. Comunicazione dei dati a terzi',
    titleEn: '6. Disclosure of data to third parties',
    paragraphs: ['I dati personali possono essere comunicati, nei limiti necessari, a:'],
    paragraphsEn: ['Personal data may be disclosed, to the extent necessary, to:'],
    items: [
      'fornitori di servizi hosting, manutenzione tecnica e sicurezza informatica;',
      'provider di pagamento, tra cui Stripe, e sistemi antifrode;',
      'corrieri, operatori logistici e soggetti coinvolti nella spedizione degli ordini;',
      'consulenti fiscali, amministrativi, legali e contabili;',
      'piattaforme di email marketing, strumenti di analisi e servizi pubblicitari, solo se utilizzati e nel rispetto delle preferenze espresse dall’utente;',
      'autorità pubbliche o soggetti legittimati, quando richiesto dalla legge.',
      'I dati non vengono venduti a terzi.',
    ],
    itemsEn: [
      'hosting providers, technical maintenance and IT security services;',
      'payment providers, including Stripe, and anti-fraud systems;',
      'couriers, logistics operators and parties involved in shipping orders;',
      'tax, administrative, legal and accounting consultants;',
      'email marketing platforms, analytics tools and advertising services, only if used and in compliance with the preferences expressed by the user;',
      'public authorities or authorized parties, when required by law.',
      'Data is not sold to third parties.',
    ],
  },
  {
    title: '7. Trasferimento dei dati fuori dallo Spazio Economico Europeo',
    titleEn: '7. Transfer of data outside the European Economic Area',
    paragraphs: [
      'Alcuni fornitori tecnologici potrebbero trattare dati personali anche al di fuori dello Spazio Economico Europeo. In tali casi, il trasferimento avverrà nel rispetto delle garanzie previste dal GDPR, come decisioni di adeguatezza, clausole contrattuali standard o altri strumenti giuridici applicabili.',
    ],
    paragraphsEn: [
      'Some technology providers may process personal data outside the European Economic Area. In such cases, the transfer will take place in compliance with the safeguards provided for by the GDPR, such as adequacy decisions, standard contractual clauses or other applicable legal instruments.',
    ],
  },
  {
    title: '8. Tempi di conservazione',
    titleEn: '8. Data retention periods',
    paragraphs: ['I dati personali sono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti:'],
    paragraphsEn: ['Personal data is stored for the time strictly necessary for the purposes for which it was collected:'],
    items: [
      'dati relativi agli ordini e alla fatturazione: per il periodo previsto dagli obblighi fiscali e contabili;',
      'dati relativi a richieste di contatto o assistenza: per il tempo necessario alla gestione della richiesta e per eventuali esigenze di tutela;',
      'dati per marketing e newsletter: fino alla revoca del consenso o alla richiesta di cancellazione;',
      'dati tecnici e log di sicurezza: per il tempo necessario alla sicurezza del sito e alla prevenzione di abusi;',
      'cookie e strumenti di tracciamento: secondo quanto indicato nella Cookie Policy.',
    ],
    itemsEn: [
      'order and invoicing data: for the period required by tax and accounting obligations;',
      'contact or support request data: for the time necessary to manage the request and for any protection needs;',
      'marketing and newsletter data: until consent is withdrawn or deletion is requested;',
      'technical data and security logs: for the time necessary for site security and abuse prevention;',
      'cookies and tracking tools: as indicated in the Cookie Policy.',
    ],
  },
  {
    title: '9. Diritti dell’interessato',
    titleEn: '9. Rights of the data subject',
    paragraphs: ['L’utente può esercitare, nei casi previsti dalla normativa, i seguenti diritti:'],
    paragraphsEn: ['Where provided for by law, users may exercise the following rights:'],
    items: [
      'accesso ai dati personali;',
      'rettifica dei dati inesatti o integrazione di quelli incompleti;',
      'cancellazione dei dati;',
      'limitazione del trattamento;',
      'opposizione al trattamento;',
      'portabilità dei dati;',
      'revoca del consenso prestato, senza pregiudicare la liceità del trattamento effettuato prima della revoca.',
      'Per esercitare i propri diritti, l’utente può contattare il Titolare all’indirizzo 08naturaltechnology@gmail.com.',
    ],
    itemsEn: [
      'access to personal data;',
      'rectification of inaccurate data or completion of incomplete data;',
      'erasure of data;',
      'restriction of processing;',
      'objection to processing;',
      'data portability;',
      'withdrawal of consent given, without affecting the lawfulness of processing carried out before withdrawal.',
      'To exercise these rights, users can contact the Data Controller at 08naturaltechnology@gmail.com.',
    ],
  },
  {
    title: '10. Reclamo all’autorità di controllo',
    titleEn: '10. Complaint to the supervisory authority',
    paragraphs: [
      'L’utente che ritenga che il trattamento dei propri dati personali avvenga in violazione della normativa applicabile può proporre reclamo al Garante per la Protezione dei Dati Personali o rivolgersi all’autorità giudiziaria competente.',
    ],
    paragraphsEn: [
      'Users who believe that the processing of their personal data violates applicable regulations may lodge a complaint with the Italian Data Protection Authority (Garante per la Protezione dei Dati Personali) or refer the matter to the competent judicial authority.',
    ],
  },
  {
    title: '11. Modifiche alla presente informativa',
    titleEn: '11. Changes to this notice',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare la presente Privacy Policy in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
    paragraphsEn: [
      'The Data Controller reserves the right to update this Privacy Policy at any time. Changes will be published on this page indicating the date of the last update.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDocument
      documentKey="privacy"
      eyebrow="Privacy"
      title="Privacy Policy"
      subtitle="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679."
      subtitleEn="Notice on the processing of personal data pursuant to EU Regulation 2016/679."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
