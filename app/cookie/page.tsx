import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informativa sull’utilizzo dei cookie e degli strumenti di tracciamento.',
}

const sections: LegalSection[] = [
  {
    title: '1. Cosa sono i cookie',
    titleEn: '1. What cookies are',
    paragraphs: [
      'I cookie sono piccoli file di testo che i siti visitati dall’utente inviano al browser utilizzato per la navigazione. Possono essere memorizzati sul dispositivo dell’utente e successivamente ritrasmessi agli stessi siti alla visita successiva.',
      'I cookie possono servire a far funzionare correttamente il sito, migliorare l’esperienza di navigazione, raccogliere statistiche o proporre contenuti e comunicazioni personalizzate, ove consentito.',
    ],
    paragraphsEn: [
      'Cookies are small text files that the websites you visit send to the browser you use for browsing. They can be stored on your device and later sent back to the same sites on your next visit.',
      'Cookies can be used to make the site work correctly, improve the browsing experience, collect statistics, or offer personalized content and communications, where permitted.',
    ],
  },
  {
    title: '2. Tipologie di cookie utilizzati',
    titleEn: '2. Types of cookies used',
    subsections: [
      {
        title: 'Cookie tecnici necessari',
        titleEn: 'Necessary technical cookies',
        paragraphs: [
          'Sono indispensabili per il corretto funzionamento del sito e per consentire funzioni essenziali come navigazione, gestione del carrello, checkout, sicurezza, autenticazione e salvataggio delle preferenze tecniche. Questi cookie non richiedono il consenso dell’utente.',
        ],
        paragraphsEn: [
          'These are essential for the proper functioning of the site and to enable core functions such as browsing, cart management, checkout, security, authentication and saving technical preferences. These cookies do not require user consent.',
        ],
      },
      {
        title: 'Cookie funzionali',
        titleEn: 'Functional cookies',
        paragraphs: [
          'Consentono al sito di ricordare alcune preferenze dell’utente, come lingua, area geografica, impostazioni di navigazione o altre opzioni utili a migliorare l’esperienza d’uso.',
        ],
        paragraphsEn: [
          'These allow the site to remember certain user preferences, such as language, geographic area, browsing settings or other options useful for improving the user experience.',
        ],
      },
      {
        title: 'Cookie analitici',
        titleEn: 'Analytics cookies',
        paragraphs: [
          'Consentono di raccogliere informazioni statistiche sull’utilizzo del sito, come pagine visitate, durata della sessione, sorgenti di traffico e interazioni con i contenuti. Se non anonimizzati o se combinati con altri dati identificativi, vengono utilizzati solo previo consenso dell’utente.',
        ],
        paragraphsEn: [
          'These collect statistical information on site usage, such as pages visited, session duration, traffic sources and interactions with content. If not anonymized or combined with other identifying data, they are used only with the user\'s prior consent.',
        ],
      },
      {
        title: 'Cookie di marketing e profilazione',
        titleEn: 'Marketing and profiling cookies',
        paragraphs: [
          'Possono essere utilizzati per mostrare contenuti pubblicitari personalizzati, misurare l’efficacia delle campagne e creare segmenti di pubblico in base alle interazioni dell’utente con il sito. Questi strumenti vengono attivati solo previo consenso.',
        ],
        paragraphsEn: [
          'These may be used to show personalized advertising content, measure the effectiveness of campaigns and create audience segments based on user interactions with the site. These tools are activated only with prior consent.',
        ],
      },
      {
        title: 'Cookie di terze parti',
        titleEn: 'Third-party cookies',
        paragraphs: [
          'Alcuni cookie o strumenti simili possono essere impostati da soggetti terzi, come servizi di analisi, piattaforme pubblicitarie, strumenti social, provider di pagamento, sistemi antifrode o servizi integrati nel sito. L’utilizzo di tali strumenti avviene secondo le rispettive informative privacy e cookie.',
        ],
        paragraphsEn: [
          'Some cookies or similar tools may be set by third parties, such as analytics services, advertising platforms, social tools, payment providers, anti-fraud systems or services integrated into the site. The use of these tools is governed by their respective privacy and cookie notices.',
        ],
      },
    ],
  },
  {
    title: '3. Strumenti che potrebbero essere utilizzati sul sito',
    titleEn: '3. Tools that may be used on the site',
    paragraphs: [
      'Il sito può utilizzare, a titolo esemplificativo, strumenti appartenenti alle seguenti categorie. L’effettiva presenza di cookie non tecnici o strumenti di tracciamento dipende dalle funzionalità attivate sul sito.',
    ],
    paragraphsEn: [
      'The site may use, for example, tools belonging to the following categories. The actual presence of non-technical cookies or tracking tools depends on the features activated on the site.',
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
    itemsEn: [
      'website management platform and e-commerce features;',
      'tools for cart, checkout and order management;',
      'external payment provider Stripe;',
      'hosting, security and spam/unauthorized access protection services;',
      'traffic analytics tools, such as Google Analytics or equivalent services, if active;',
      'advertising tools, such as Google Ads, Meta Pixel or equivalent services, if active;',
      'tools for newsletters, marketing automation or commercial communications, if active.',
    ],
  },
  {
    title: '4. Gestione del consenso',
    titleEn: '4. Consent management',
    paragraphs: [
      'I cookie tecnici necessari possono essere utilizzati senza consenso, perché servono al funzionamento del sito.',
      'Qualora vengano attivati cookie analitici non anonimizzati, cookie di marketing, profilazione o altri strumenti non tecnici, l’utente dovrà poter scegliere se accettarli, rifiutarli o personalizzare le proprie preferenze tramite un apposito sistema di gestione del consenso.',
      'Le preferenze possono essere modificate in qualsiasi momento dal pulsante “Preferenze cookie” presente nel footer del sito. Le scelte vengono salvate nel browser dell’utente e possono essere aggiornate o revocate successivamente.',
      'La chiusura di un eventuale banner senza accettazione comporta il mantenimento delle impostazioni predefinite, con attivazione dei soli cookie tecnici necessari.',
    ],
    paragraphsEn: [
      'Necessary technical cookies can be used without consent, as they are needed for the site to function.',
      'If non-anonymized analytics cookies, marketing cookies, profiling or other non-technical tools are activated, users must be able to choose whether to accept them, reject them, or customize their preferences through a dedicated consent management system.',
      'Preferences can be changed at any time via the "Cookie preferences" button in the site footer. Choices are saved in the user\'s browser and can be updated or withdrawn later.',
      'Closing a banner without accepting results in the default settings being kept, activating only the necessary technical cookies.',
    ],
  },
  {
    title: '5. Come disabilitare i cookie dal browser',
    titleEn: '5. How to disable cookies from your browser',
    paragraphs: [
      'L’utente può gestire, bloccare o eliminare i cookie anche attraverso le impostazioni del proprio browser. La disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito, come carrello, checkout, accesso all’area personale o salvataggio delle preferenze.',
    ],
    paragraphsEn: [
      'Users can manage, block or delete cookies through their browser settings. Disabling technical cookies may impair some site features, such as the cart, checkout, access to the personal area or saving preferences.',
    ],
  },
  {
    title: '6. Durata dei cookie',
    titleEn: '6. Cookie duration',
    paragraphs: [
      'I cookie possono essere di sessione, quindi eliminati alla chiusura del browser, oppure persistenti, quindi conservati per un periodo determinato. La durata specifica di ciascun cookie, ove applicabile, deve essere indicata nel pannello di gestione del consenso o nelle informative dei rispettivi fornitori.',
    ],
    paragraphsEn: [
      'Cookies can be session cookies, deleted when the browser is closed, or persistent cookies, stored for a set period. The specific duration of each cookie, where applicable, is indicated in the consent management panel or in the respective providers\' notices.',
    ],
  },
  {
    title: '7. Aggiornamenti della Cookie Policy',
    titleEn: '7. Updates to the Cookie Policy',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare la presente Cookie Policy in qualsiasi momento, anche in seguito a modifiche tecniche del sito, introduzione di nuovi strumenti o aggiornamenti normativi.',
    ],
    paragraphsEn: [
      'The Data Controller reserves the right to update this Cookie Policy at any time, including as a result of technical changes to the site, the introduction of new tools or regulatory updates.',
    ],
  },
  {
    title: '8. Titolare del trattamento',
    titleEn: '8. Data Controller',
    paragraphs: [
      'Il Titolare del trattamento è VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729 e Codice Fiscale 08203650729.',
      'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
    ],
    paragraphsEn: [
      'The Data Controller is VIPHARMA di Tatulli Vito & Co. S.A.S., with registered office at Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), Italy, VAT number 08203650729 and Tax Code 08203650729.',
      'Email: 08naturaltechnology@gmail.com. Certified email (PEC): vipharma@pec.it.',
    ],
  },
]

export default function CookiePage() {
  return (
    <LegalDocument
      eyebrow="Cookie"
      title="Cookie Policy"
      subtitle="Informativa sull’utilizzo dei cookie e di altri strumenti di tracciamento."
      subtitleEn="Notice on the use of cookies and other tracking tools."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
