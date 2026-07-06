import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informativa sull’utilizzo dei cookie e degli strumenti di tracciamento.',
}

const sections: LegalSection[] = [
  {
    title: '1. Cosa sono i cookie',
    paragraphs: [
      'I cookie sono piccoli file di testo che i siti visitati dall’utente inviano al browser utilizzato per la navigazione. Possono essere memorizzati sul dispositivo dell’utente e successivamente ritrasmessi agli stessi siti alla visita successiva.',
      'I cookie possono servire a far funzionare correttamente il sito, migliorare l’esperienza di navigazione, raccogliere statistiche o proporre contenuti e comunicazioni personalizzate, ove consentito.',
    ],
  },
  {
    title: '2. Tipologie di cookie utilizzati',
    subsections: [
      {
        title: 'Cookie tecnici necessari',
        paragraphs: [
          'Sono indispensabili per il corretto funzionamento del sito e per consentire funzioni essenziali come navigazione, gestione del carrello, checkout, sicurezza, autenticazione e salvataggio delle preferenze tecniche. Questi cookie non richiedono il consenso dell’utente.',
        ],
      },
      {
        title: 'Cookie funzionali',
        paragraphs: [
          'Consentono al sito di ricordare alcune preferenze dell’utente, come lingua, area geografica, impostazioni di navigazione o altre opzioni utili a migliorare l’esperienza d’uso.',
        ],
      },
      {
        title: 'Cookie analitici',
        paragraphs: [
          'Consentono di raccogliere informazioni statistiche sull’utilizzo del sito, come pagine visitate, durata della sessione, sorgenti di traffico e interazioni con i contenuti. Se non anonimizzati o se combinati con altri dati identificativi, vengono utilizzati solo previo consenso dell’utente.',
        ],
      },
      {
        title: 'Cookie di marketing e profilazione',
        paragraphs: [
          'Possono essere utilizzati per mostrare contenuti pubblicitari personalizzati, misurare l’efficacia delle campagne e creare segmenti di pubblico in base alle interazioni dell’utente con il sito. Questi strumenti vengono attivati solo previo consenso.',
        ],
      },
      {
        title: 'Cookie di terze parti',
        paragraphs: [
          'Alcuni cookie o strumenti simili possono essere impostati da soggetti terzi, come servizi di analisi, piattaforme pubblicitarie, strumenti social, provider di pagamento, sistemi antifrode o servizi integrati nel sito. L’utilizzo di tali strumenti avviene secondo le rispettive informative privacy e cookie.',
        ],
      },
    ],
  },
  {
    title: '3. Strumenti che potrebbero essere utilizzati sul sito',
    paragraphs: [
      'Il sito può utilizzare, a titolo esemplificativo, strumenti appartenenti alle seguenti categorie. L’effettiva presenza di cookie non tecnici o strumenti di tracciamento dipende dalle funzionalità attivate sul sito.',
    ],
    items: [
      'piattaforma di gestione del sito e funzionalità e-commerce;',
      'strumenti per gestione carrello, checkout e ordini;',
      'provider di pagamento esterno Stripe;',
      'servizi di hosting, sicurezza e protezione da spam o accessi non autorizzati;',
      'strumenti di analisi del traffico, come Google Analytics o servizi equivalenti, se attivi;',
      'strumenti pubblicitari, come Google Ads, Meta Pixel o servizi equivalenti, se attivi;',
      'strumenti per newsletter, automazioni marketing o comunicazioni commerciali, se attivi.',
    ],
  },
  {
    title: '4. Gestione del consenso',
    paragraphs: [
      'I cookie tecnici necessari possono essere utilizzati senza consenso, perché servono al funzionamento del sito.',
      'Qualora vengano attivati cookie analitici non anonimizzati, cookie di marketing, profilazione o altri strumenti non tecnici, l’utente dovrà poter scegliere se accettarli, rifiutarli o personalizzare le proprie preferenze tramite un apposito sistema di gestione del consenso.',
      'Le preferenze possono essere modificate in qualsiasi momento dal pulsante “Preferenze cookie” presente nel footer del sito. Le scelte vengono salvate nel browser dell’utente e possono essere aggiornate o revocate successivamente.',
      'La chiusura di un eventuale banner senza accettazione comporta il mantenimento delle impostazioni predefinite, con attivazione dei soli cookie tecnici necessari.',
    ],
  },
  {
    title: '5. Come disabilitare i cookie dal browser',
    paragraphs: [
      'L’utente può gestire, bloccare o eliminare i cookie anche attraverso le impostazioni del proprio browser. La disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito, come carrello, checkout, accesso all’area personale o salvataggio delle preferenze.',
    ],
  },
  {
    title: '6. Durata dei cookie',
    paragraphs: [
      'I cookie possono essere di sessione, quindi eliminati alla chiusura del browser, oppure persistenti, quindi conservati per un periodo determinato. La durata specifica di ciascun cookie, ove applicabile, deve essere indicata nel pannello di gestione del consenso o nelle informative dei rispettivi fornitori.',
    ],
  },
  {
    title: '7. Aggiornamenti della Cookie Policy',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare la presente Cookie Policy in qualsiasi momento, anche in seguito a modifiche tecniche del sito, introduzione di nuovi strumenti o aggiornamenti normativi.',
    ],
  },
  {
    title: '8. Titolare del trattamento',
    paragraphs: [
      'Il Titolare del trattamento è VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729 e Codice Fiscale 08203650729.',
      'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
    ],
  },
]

export default function CookiePage() {
  return (
    <LegalDocument
      eyebrow="Cookie"
      title="Cookie Policy"
      subtitle="Informativa sull’utilizzo dei cookie e di altri strumenti di tracciamento."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
