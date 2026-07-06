import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali di 08 Natural Technology.',
}

const sections: LegalSection[] = [
  {
    title: '1. Titolare del trattamento',
    paragraphs: [
      'Il Titolare del trattamento dei dati personali è VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729 e Codice Fiscale 08203650729.',
      'Per qualsiasi richiesta relativa al trattamento dei dati personali è possibile contattare il Titolare all’indirizzo email 08naturaltechnology@gmail.com oppure tramite PEC vipharma@pec.it.',
    ],
  },
  {
    title: '2. Tipologie di dati trattati',
    paragraphs: ['Attraverso il sito 08 Natural Technology possono essere trattate le seguenti categorie di dati:'],
    items: [
      'dati di navigazione, come indirizzo IP, dati tecnici del browser, dispositivo utilizzato, data e ora di accesso e pagine visitate;',
      'dati forniti volontariamente, come nome, cognome, email, numero di telefono e informazioni inserite nei moduli di contatto;',
      'dati relativi agli ordini, inclusi dati anagrafici, indirizzo di spedizione, recapiti, dati di fatturazione, prodotti acquistati e informazioni necessarie alla gestione dell’acquisto;',
      'dati di pagamento, gestiti tramite provider esterni autorizzati, tra cui Stripe. Il sito non conserva i dati completi delle carte di pagamento;',
      'dati per comunicazioni commerciali, come indirizzo email e preferenze, solo in caso di consenso espresso dell’utente.',
    ],
  },
  {
    title: '3. Finalità del trattamento',
    paragraphs: ['I dati personali sono trattati per le seguenti finalità:'],
    items: [
      'consentire la corretta navigazione e il funzionamento tecnico del sito;',
      'rispondere a richieste inviate tramite moduli di contatto, email o altri canali di comunicazione;',
      'gestire ordini, pagamenti, spedizioni, resi, assistenza clienti e comunicazioni post-vendita;',
      'adempiere a obblighi amministrativi, fiscali, contabili e di legge;',
      'prevenire frodi, abusi, accessi non autorizzati o utilizzi impropri del sito;',
      'inviare comunicazioni promozionali, newsletter o aggiornamenti commerciali solo previo consenso dell’utente;',
      'analizzare l’utilizzo del sito e migliorare servizi, contenuti e prestazioni, ove previsto anche tramite cookie e strumenti di tracciamento.',
    ],
  },
  {
    title: '4. Base giuridica del trattamento',
    paragraphs: ['Il trattamento dei dati personali si basa, a seconda dei casi, su:'],
    items: [
      'esecuzione di un contratto o misure precontrattuali, per ordini, richieste, assistenza e gestione del rapporto con il cliente;',
      'obbligo di legge, per adempimenti fiscali, contabili e amministrativi;',
      'legittimo interesse del Titolare, per sicurezza del sito, prevenzione frodi, tutela dei diritti e miglioramento dei servizi;',
      'consenso dell’utente, per newsletter, marketing, cookie non tecnici e strumenti di profilazione o analisi non anonimizzata.',
    ],
  },
  {
    title: '5. Modalità del trattamento',
    paragraphs: [
      'I dati sono trattati con strumenti informatici, telematici e, ove necessario, cartacei, adottando misure tecniche e organizzative adeguate a proteggerli da accessi non autorizzati, perdita, alterazione, divulgazione o utilizzo improprio.',
      'Il trattamento è effettuato esclusivamente da soggetti autorizzati e istruiti, nel rispetto dei principi di liceità, correttezza, trasparenza, minimizzazione e limitazione della conservazione.',
    ],
  },
  {
    title: '6. Comunicazione dei dati a terzi',
    paragraphs: ['I dati personali possono essere comunicati, nei limiti necessari, a:'],
    items: [
      'fornitori di servizi hosting, manutenzione tecnica e sicurezza informatica;',
      'provider di pagamento, tra cui Stripe, e sistemi antifrode;',
      'corrieri, operatori logistici e soggetti coinvolti nella spedizione degli ordini;',
      'consulenti fiscali, amministrativi, legali e contabili;',
      'piattaforme di email marketing, strumenti di analisi e servizi pubblicitari, solo se utilizzati e nel rispetto delle preferenze espresse dall’utente;',
      'autorità pubbliche o soggetti legittimati, quando richiesto dalla legge.',
      'I dati non vengono venduti a terzi.',
    ],
  },
  {
    title: '7. Trasferimento dei dati fuori dallo Spazio Economico Europeo',
    paragraphs: [
      'Alcuni fornitori tecnologici potrebbero trattare dati personali anche al di fuori dello Spazio Economico Europeo. In tali casi, il trasferimento avverrà nel rispetto delle garanzie previste dal GDPR, come decisioni di adeguatezza, clausole contrattuali standard o altri strumenti giuridici applicabili.',
    ],
  },
  {
    title: '8. Tempi di conservazione',
    paragraphs: ['I dati personali sono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti:'],
    items: [
      'dati relativi agli ordini e alla fatturazione: per il periodo previsto dagli obblighi fiscali e contabili;',
      'dati relativi a richieste di contatto o assistenza: per il tempo necessario alla gestione della richiesta e per eventuali esigenze di tutela;',
      'dati per marketing e newsletter: fino alla revoca del consenso o alla richiesta di cancellazione;',
      'dati tecnici e log di sicurezza: per il tempo necessario alla sicurezza del sito e alla prevenzione di abusi;',
      'cookie e strumenti di tracciamento: secondo quanto indicato nella Cookie Policy.',
    ],
  },
  {
    title: '9. Diritti dell’interessato',
    paragraphs: ['L’utente può esercitare, nei casi previsti dalla normativa, i seguenti diritti:'],
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
  },
  {
    title: '10. Reclamo all’autorità di controllo',
    paragraphs: [
      'L’utente che ritenga che il trattamento dei propri dati personali avvenga in violazione della normativa applicabile può proporre reclamo al Garante per la Protezione dei Dati Personali o rivolgersi all’autorità giudiziaria competente.',
    ],
  },
  {
    title: '11. Modifiche alla presente informativa',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare la presente Privacy Policy in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalDocument
      eyebrow="Privacy"
      title="Privacy Policy"
      subtitle="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
