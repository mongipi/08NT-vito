export type ManagedLegalOverrideSection = {
  title: string
  paragraphs?: string[]
  items?: string[]
  subsections?: {
    title: string
    paragraphs: string[]
  }[]
}

export type ManagedLegalOverrideDocument = {
  eyebrow: string
  title: string
  subtitle: string
  updated: string
  sections: ManagedLegalOverrideSection[]
}

export const LEGAL_OVERRIDE_EXAMPLE = JSON.stringify(
  {
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    subtitle: 'Informativa sul trattamento dei dati personali.',
    updated: '30 luglio 2026',
    sections: [
      {
        title: '1. Titolo sezione',
        paragraphs: ['Primo paragrafo.', 'Secondo paragrafo.'],
        items: ['Punto elenco 1', 'Punto elenco 2'],
        subsections: [
          {
            title: 'Sottosezione opzionale',
            paragraphs: ['Testo sottosezione.'],
          },
        ],
      },
    ],
  },
  null,
  2
)

const PRIVACY_OVERRIDE: ManagedLegalOverrideDocument = {
  eyebrow: 'Privacy',
  title: 'Privacy Policy',
  subtitle: 'Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679.',
  updated: '04 luglio 2026',
  sections: [
    {
      title: '1. Titolare del trattamento',
      paragraphs: [
        'Il Titolare del trattamento dei dati personali e VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729 e Codice Fiscale 08203650729.',
        'Per qualsiasi richiesta relativa al trattamento dei dati personali e possibile contattare il Titolare all indirizzo email 08naturaltechnology@gmail.com oppure tramite PEC vipharma@pec.it.',
      ],
    },
    {
      title: '2. Tipologie di dati trattati',
      paragraphs: ['Attraverso il sito 08 Natural Technology possono essere trattate le seguenti categorie di dati:'],
      items: [
        'dati di navigazione, come indirizzo IP, dati tecnici del browser, dispositivo utilizzato, data e ora di accesso e pagine visitate;',
        'dati forniti volontariamente, come nome, cognome, email, numero di telefono e informazioni inserite nei moduli di contatto;',
        'dati relativi agli ordini, inclusi dati anagrafici, indirizzo di spedizione, recapiti, dati di fatturazione, prodotti acquistati e informazioni necessarie alla gestione dell acquisto;',
        'dati di pagamento, gestiti tramite provider esterni autorizzati, tra cui Stripe. Il sito non conserva i dati completi delle carte di pagamento;',
        'dati per comunicazioni commerciali, come indirizzo email e preferenze, solo in caso di consenso espresso dell utente.',
      ],
    },
    {
      title: '3. Finalita del trattamento',
      paragraphs: ['I dati personali sono trattati per le seguenti finalita:'],
      items: [
        'consentire la corretta navigazione e il funzionamento tecnico del sito;',
        'rispondere a richieste inviate tramite moduli di contatto, email o altri canali di comunicazione;',
        'gestire ordini, pagamenti, spedizioni, resi, assistenza clienti e comunicazioni post-vendita;',
        'adempiere a obblighi amministrativi, fiscali, contabili e di legge;',
        'prevenire frodi, abusi, accessi non autorizzati o utilizzi impropri del sito;',
        'inviare comunicazioni promozionali, newsletter o aggiornamenti commerciali solo previo consenso dell utente;',
        'analizzare l utilizzo del sito e migliorare servizi, contenuti e prestazioni, ove previsto anche tramite cookie e strumenti di tracciamento.',
      ],
    },
    {
      title: '4. Base giuridica del trattamento',
      paragraphs: ['Il trattamento dei dati personali si basa, a seconda dei casi, su:'],
      items: [
        'esecuzione di un contratto o misure precontrattuali, per ordini, richieste, assistenza e gestione del rapporto con il cliente;',
        'obbligo di legge, per adempimenti fiscali, contabili e amministrativi;',
        'legittimo interesse del Titolare, per sicurezza del sito, prevenzione frodi, tutela dei diritti e miglioramento dei servizi;',
        'consenso dell utente, per newsletter, marketing, cookie non tecnici e strumenti di profilazione o analisi non anonimizzata.',
      ],
    },
    {
      title: '5. Modalita del trattamento',
      paragraphs: [
        'I dati sono trattati con strumenti informatici, telematici e, ove necessario, cartacei, adottando misure tecniche e organizzative adeguate a proteggerli da accessi non autorizzati, perdita, alterazione, divulgazione o utilizzo improprio.',
        'Il trattamento e effettuato esclusivamente da soggetti autorizzati e istruiti, nel rispetto dei principi di liceita, correttezza, trasparenza, minimizzazione e limitazione della conservazione.',
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
        'piattaforme di email marketing, strumenti di analisi e servizi pubblicitari, solo se utilizzati e nel rispetto delle preferenze espresse dall utente;',
        'autorita pubbliche o soggetti legittimati, quando richiesto dalla legge;',
        'i dati non vengono venduti a terzi.',
      ],
    },
    {
      title: '7. Trasferimento dei dati fuori dallo Spazio Economico Europeo',
      paragraphs: [
        'Alcuni fornitori tecnologici potrebbero trattare dati personali anche al di fuori dello Spazio Economico Europeo. In tali casi, il trasferimento avverra nel rispetto delle garanzie previste dal GDPR, come decisioni di adeguatezza, clausole contrattuali standard o altri strumenti giuridici applicabili.',
      ],
    },
    {
      title: '8. Tempi di conservazione',
      paragraphs: ['I dati personali sono conservati per il tempo strettamente necessario alle finalita per cui sono stati raccolti:'],
      items: [
        'dati relativi agli ordini e alla fatturazione: per il periodo previsto dagli obblighi fiscali e contabili;',
        'dati relativi a richieste di contatto o assistenza: per il tempo necessario alla gestione della richiesta e per eventuali esigenze di tutela;',
        'dati per marketing e newsletter: fino alla revoca del consenso o alla richiesta di cancellazione;',
        'dati tecnici e log di sicurezza: per il tempo necessario alla sicurezza del sito e alla prevenzione di abusi;',
        'cookie e strumenti di tracciamento: secondo quanto indicato nella Cookie Policy.',
      ],
    },
    {
      title: '9. Diritti dell interessato',
      paragraphs: ['L utente puo esercitare, nei casi previsti dalla normativa, i seguenti diritti:'],
      items: [
        'accesso ai dati personali;',
        'rettifica dei dati inesatti o integrazione di quelli incompleti;',
        'cancellazione dei dati;',
        'limitazione del trattamento;',
        'opposizione al trattamento;',
        'portabilita dei dati;',
        'revoca del consenso prestato, senza pregiudicare la liceita del trattamento effettuato prima della revoca;',
        'per esercitare i propri diritti, l utente puo contattare il Titolare all indirizzo 08naturaltechnology@gmail.com.',
      ],
    },
    {
      title: '10. Reclamo all autorita di controllo',
      paragraphs: [
        'L utente che ritenga che il trattamento dei propri dati personali avvenga in violazione della normativa applicabile puo proporre reclamo al Garante per la Protezione dei Dati Personali o rivolgersi all autorita giudiziaria competente.',
      ],
    },
    {
      title: '11. Modifiche alla presente informativa',
      paragraphs: [
        'Il Titolare si riserva il diritto di aggiornare la presente Privacy Policy in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
      ],
    },
  ],
}

const COOKIE_OVERRIDE: ManagedLegalOverrideDocument = {
  eyebrow: 'Cookie',
  title: 'Cookie Policy',
  subtitle: 'Informativa sull utilizzo dei cookie e di altri strumenti di tracciamento.',
  updated: '04 luglio 2026',
  sections: [
    {
      title: '1. Cosa sono i cookie',
      paragraphs: [
        'I cookie sono piccoli file di testo che i siti visitati dall utente inviano al browser utilizzato per la navigazione. Possono essere memorizzati sul dispositivo dell utente e successivamente ritrasmessi agli stessi siti alla visita successiva.',
        'I cookie possono servire a far funzionare correttamente il sito, migliorare l esperienza di navigazione, raccogliere statistiche o proporre contenuti e comunicazioni personalizzate, ove consentito.',
      ],
    },
    {
      title: '2. Tipologie di cookie utilizzati',
      subsections: [
        {
          title: 'Cookie tecnici necessari',
          paragraphs: [
            'Sono indispensabili per il corretto funzionamento del sito e per consentire funzioni essenziali come navigazione, gestione del carrello, checkout, sicurezza, autenticazione e salvataggio delle preferenze tecniche. Questi cookie non richiedono il consenso dell utente.',
          ],
        },
        {
          title: 'Cookie funzionali',
          paragraphs: [
            'Consentono al sito di ricordare alcune preferenze dell utente, come lingua, area geografica, impostazioni di navigazione o altre opzioni utili a migliorare l esperienza d uso.',
          ],
        },
        {
          title: 'Cookie analitici',
          paragraphs: [
            'Consentono di raccogliere informazioni statistiche sull utilizzo del sito, come pagine visitate, durata della sessione, sorgenti di traffico e interazioni con i contenuti. Se non anonimizzati o se combinati con altri dati identificativi, vengono utilizzati solo previo consenso dell utente.',
          ],
        },
        {
          title: 'Cookie di marketing e profilazione',
          paragraphs: [
            'Possono essere utilizzati per mostrare contenuti pubblicitari personalizzati, misurare l efficacia delle campagne e creare segmenti di pubblico in base alle interazioni dell utente con il sito. Questi strumenti vengono attivati solo previo consenso.',
          ],
        },
        {
          title: 'Cookie di terze parti',
          paragraphs: [
            'Alcuni cookie o strumenti simili possono essere impostati da soggetti terzi, come servizi di analisi, piattaforme pubblicitarie, strumenti social, provider di pagamento, sistemi antifrode o servizi integrati nel sito. L utilizzo di tali strumenti avviene secondo le rispettive informative privacy e cookie.',
          ],
        },
      ],
    },
    {
      title: '3. Strumenti che potrebbero essere utilizzati sul sito',
      paragraphs: [
        'Il sito puo utilizzare, a titolo esemplificativo, strumenti appartenenti alle seguenti categorie. L effettiva presenza di cookie non tecnici o strumenti di tracciamento dipende dalle funzionalita attivate sul sito.',
      ],
      items: [
        'piattaforma di gestione del sito e funzionalita e-commerce;',
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
        'I cookie tecnici necessari possono essere utilizzati senza consenso, perche servono al funzionamento del sito.',
        'Qualora vengano attivati cookie analitici non anonimizzati, cookie di marketing, profilazione o altri strumenti non tecnici, l utente dovra poter scegliere se accettarli, rifiutarli o personalizzare le proprie preferenze tramite un apposito sistema di gestione del consenso.',
        'Le preferenze possono essere modificate in qualsiasi momento dal pulsante Preferenze cookie presente nel footer del sito. Le scelte vengono salvate nel browser dell utente e possono essere aggiornate o revocate successivamente.',
        'La chiusura di un eventuale banner senza accettazione comporta il mantenimento delle impostazioni predefinite, con attivazione dei soli cookie tecnici necessari.',
      ],
    },
    {
      title: '5. Come disabilitare i cookie dal browser',
      paragraphs: [
        'L utente puo gestire, bloccare o eliminare i cookie anche attraverso le impostazioni del proprio browser. La disattivazione dei cookie tecnici potrebbe compromettere alcune funzionalita del sito, come carrello, checkout, accesso all area personale o salvataggio delle preferenze.',
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
        'Il Titolare del trattamento e VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729 e Codice Fiscale 08203650729.',
        'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
      ],
    },
  ],
}

const LEGAL_NOTES_OVERRIDE: ManagedLegalOverrideDocument = {
  eyebrow: 'Legale',
  title: 'Note Legali',
  subtitle: 'Informazioni legali relative all utilizzo del sito 08 Natural Technology.',
  updated: '04 luglio 2026',
  sections: [
    {
      title: '1. Informazioni sul titolare del sito',
      paragraphs: [
        'Il sito 08 Natural Technology e gestito da VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729, Codice Fiscale 08203650729 e REA BA - 611529.',
        'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
      ],
    },
    {
      title: '2. Accesso e utilizzo del sito',
      paragraphs: [
        'L accesso e l utilizzo del sito comportano l accettazione delle presenti Note Legali. L utente si impegna a utilizzare il sito in modo lecito, corretto e conforme alla normativa applicabile, evitando qualsiasi comportamento che possa danneggiare, compromettere o limitare il funzionamento del sito stesso.',
      ],
    },
    {
      title: '3. Proprieta intellettuale',
      paragraphs: [
        'Tutti i contenuti presenti sul sito, inclusi testi, immagini, fotografie, grafiche, loghi, marchi, elementi visuali, layout, descrizioni prodotto e materiali informativi, sono di proprieta del Titolare o concessi in uso da soggetti terzi autorizzati.',
        'E vietata la riproduzione, distribuzione, modifica, pubblicazione, copia o utilizzo dei contenuti del sito senza preventiva autorizzazione scritta del Titolare.',
      ],
    },
    {
      title: '4. Marchio 08 Natural Technology',
      paragraphs: [
        'Il marchio 08 Natural Technology, il relativo logo, l identita visiva e i materiali collegati rappresentano elementi distintivi del brand. Qualsiasi utilizzo non autorizzato del marchio o dei suoi elementi grafici e vietato.',
      ],
    },
    {
      title: '5. Informazioni sui prodotti',
      paragraphs: [
        'Le informazioni presenti sul sito hanno finalita informative e commerciali. I prodotti 08 Natural Technology sono integratori alimentari e non devono essere intesi come medicinali ne come strumenti destinati a diagnosticare, trattare, curare o prevenire malattie.',
        'Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano. Prima dell utilizzo, si raccomanda di leggere attentamente l etichetta, le modalita d uso e le avvertenze riportate sulla confezione.',
        'In caso di gravidanza, allattamento, patologie, terapie farmacologiche in corso o dubbi specifici, e consigliabile consultare il medico o il farmacista prima dell assunzione.',
      ],
    },
    {
      title: '6. Accuratezza delle informazioni',
      paragraphs: [
        'Il Titolare si impegna a mantenere aggiornate e corrette le informazioni pubblicate sul sito. Tuttavia, non puo essere esclusa la presenza di errori materiali, refusi, imprecisioni tecniche, variazioni di disponibilita, immagini puramente illustrative o aggiornamenti non ancora recepiti.',
        'Il Titolare si riserva il diritto di modificare, aggiornare o correggere in qualsiasi momento contenuti, descrizioni, immagini, prezzi, disponibilita e caratteristiche dei prodotti, senza obbligo di preavviso.',
      ],
    },
    {
      title: '7. Prezzi, disponibilita e ordini',
      paragraphs: [
        'Prezzi, promozioni e disponibilita dei prodotti possono variare nel tempo. L eventuale conferma automatica della ricezione dell ordine non implica necessariamente accettazione definitiva dello stesso, che resta subordinata alla verifica della disponibilita, della correttezza dei dati e del buon esito del pagamento.',
        'In caso di errore evidente su prezzo, disponibilita o descrizione del prodotto, il Titolare si riserva il diritto di contattare il cliente per proporre una soluzione alternativa, correggere l errore o annullare l ordine con eventuale rimborso.',
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
        'Il sito puo contenere collegamenti a siti, piattaforme o servizi di terze parti. Il Titolare non e responsabile dei contenuti, delle informative privacy, delle condizioni di utilizzo o delle pratiche adottate da siti esterni non gestiti direttamente.',
      ],
    },
    {
      title: '10. Limitazione di responsabilita',
      paragraphs: [
        'Il Titolare non garantisce che il sito sia sempre disponibile, privo di errori, interruzioni, vulnerabilita o malfunzionamenti tecnici. Nei limiti consentiti dalla legge, il Titolare non risponde di eventuali danni derivanti da uso improprio del sito, impossibilita temporanea di accesso, problemi tecnici, errori dell utente o utilizzo non conforme delle informazioni pubblicate.',
      ],
    },
    {
      title: '11. Privacy e cookie',
      paragraphs: [
        'Il trattamento dei dati personali degli utenti e disciplinato dalla Privacy Policy del sito. L utilizzo di cookie e strumenti di tracciamento e disciplinato dalla Cookie Policy. L utente e invitato a consultare entrambe le informative per maggiori dettagli.',
      ],
    },
    {
      title: '12. Risoluzione delle controversie',
      paragraphs: [
        'Per eventuali reclami o segnalazioni, l utente puo contattare il Titolare ai recapiti indicati nella presente pagina. Il Titolare valutera la richiesta e fornira riscontro entro tempi ragionevoli.',
        'La piattaforma europea per la risoluzione online delle controversie dei consumatori, nota come piattaforma ODR, e stata dismessa dal 20 luglio 2025. Restano fermi gli eventuali strumenti di tutela previsti dalla normativa vigente, inclusi gli organismi ADR competenti, ove applicabili.',
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
  ],
}

const TERMS_OVERRIDE: ManagedLegalOverrideDocument = {
  eyebrow: 'Vendita online',
  title: 'Termini e condizioni di vendita',
  subtitle: 'Condizioni applicabili agli acquisti effettuati sul sito 08 Natural Technology.',
  updated: '04 luglio 2026',
  sections: [
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
        'I prodotti 08 Natural Technology sono integratori alimentari. Le informazioni presenti nelle schede prodotto hanno finalita informative e commerciali e non sostituiscono il parere del medico, del farmacista o di altro professionista sanitario.',
        'Prima dell utilizzo e necessario leggere etichetta, modalita d uso, ingredienti e avvertenze riportate sulla confezione. Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano.',
      ],
    },
    {
      title: '3. Prezzi e disponibilita',
      paragraphs: [
        'I prezzi sono indicati in euro e, salvo diversa indicazione, includono IVA. Eventuali costi di spedizione, supplementi o servizi aggiuntivi sono mostrati durante il checkout prima della conferma dell ordine.',
        'Prezzi, promozioni e disponibilita possono variare nel tempo. In caso di errore evidente su prezzo, disponibilita o descrizione del prodotto, il Titolare potra contattare il cliente per correggere l errore, proporre una soluzione alternativa o annullare l ordine con eventuale rimborso.',
      ],
    },
    {
      title: '4. Ordine e conclusione del contratto',
      paragraphs: [
        'L ordine viene trasmesso quando il cliente completa la procedura di checkout e conferma i dati richiesti. La ricezione automatica dell ordine non implica necessariamente accettazione definitiva, che resta subordinata alla verifica dei dati, della disponibilita dei prodotti e del buon esito del pagamento.',
        'Il cliente e responsabile della correttezza dei dati inseriti, inclusi indirizzo di spedizione, recapiti, dati fiscali e informazioni necessarie alla consegna.',
      ],
    },
    {
      title: '5. Pagamenti',
      paragraphs: [
        'Il sito puo consentire pagamenti online tramite provider esterni autorizzati, tra cui Stripe, oppure altri metodi eventualmente indicati al checkout, come bonifico bancario o contrassegno se disponibili.',
        'I dati completi degli strumenti di pagamento non vengono conservati direttamente dal sito. In caso di pagamento non completato o non autorizzato, l ordine non potra essere evaso.',
      ],
    },
    {
      title: '6. Spedizioni e consegna',
      paragraphs: [
        'Le spedizioni sono gestite secondo quanto indicato nella pagina Spedizioni, Resi e Rimborsi. Tempi e costi di consegna sono mostrati durante il checkout o nelle comunicazioni successive all ordine, ove disponibili.',
        'Eventuali ritardi dovuti a corrieri, festivita, scioperi, condizioni meteo, cause di forza maggiore o dati incompleti non sono direttamente imputabili al Titolare.',
      ],
    },
    {
      title: '7. Diritto di recesso, resi e rimborsi',
      paragraphs: [
        'Il cliente consumatore puo esercitare il diritto di recesso entro 14 giorni dalla ricezione del prodotto, nei limiti e con le condizioni previste dalla normativa applicabile.',
        'Per prodotti sigillati, integratori alimentari, cosmetici, prodotti per l igiene o articoli destinati all assunzione, il reso puo essere escluso o rifiutato se il prodotto e stato aperto, utilizzato, danneggiato o privato del sigillo originale.',
        'Le modalita operative per richiedere un reso, le condizioni di restituzione e i tempi di rimborso sono descritti nella pagina Spedizioni, Resi e Rimborsi.',
      ],
    },
    {
      title: '8. Garanzia legale e prodotti non conformi',
      paragraphs: [
        'Restano fermi i diritti riconosciuti al consumatore dalla normativa applicabile in materia di garanzia legale e conformita dei beni.',
        'In caso di prodotto danneggiato, errato, mancante o non conforme, il cliente e invitato a contattare tempestivamente il servizio clienti all indirizzo 08naturaltechnology@gmail.com, allegando numero d ordine, descrizione del problema e documentazione fotografica utile.',
      ],
    },
    {
      title: '9. Account utente',
      paragraphs: [
        'Il cliente puo acquistare come ospite o, se disponibile, creare un account personale. Le credenziali di accesso devono essere custodite con cura e non condivise con terzi.',
        'Il Titolare potra sospendere o limitare l accesso in caso di uso improprio, violazione delle presenti condizioni, tentativi di frode o attivita che possano compromettere la sicurezza del sito.',
      ],
    },
    {
      title: '10. Responsabilita',
      paragraphs: [
        'Il Titolare non risponde di danni derivanti da uso improprio dei prodotti, mancato rispetto delle indicazioni riportate in etichetta, informazioni errate fornite dal cliente, impossibilita temporanea di accesso al sito o eventi non direttamente controllabili.',
        'Nessuna disposizione delle presenti condizioni limita i diritti inderogabili riconosciuti al consumatore dalla legge applicabile.',
      ],
    },
    {
      title: '11. Privacy e cookie',
      paragraphs: [
        'Il trattamento dei dati personali e disciplinato dalla Privacy Policy. L utilizzo di cookie e strumenti di tracciamento e disciplinato dalla Cookie Policy e dal pannello preferenze cookie disponibile sul sito.',
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
  ],
}

export const DEFAULT_PRIVACY_OVERRIDE_JSON = JSON.stringify(PRIVACY_OVERRIDE, null, 2)
export const DEFAULT_COOKIE_OVERRIDE_JSON = JSON.stringify(COOKIE_OVERRIDE, null, 2)
export const DEFAULT_LEGAL_NOTES_OVERRIDE_JSON = JSON.stringify(LEGAL_NOTES_OVERRIDE, null, 2)
export const DEFAULT_TERMS_OVERRIDE_JSON = JSON.stringify(TERMS_OVERRIDE, null, 2)

export function normalizeManagedLegalOverride(
  raw: string | undefined
): ManagedLegalOverrideDocument | null {
  if (!raw?.trim()) return null

  try {
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.eyebrow !== 'string' ||
      typeof parsed?.title !== 'string' ||
      typeof parsed?.subtitle !== 'string' ||
      typeof parsed?.updated !== 'string' ||
      !Array.isArray(parsed?.sections)
    ) {
      return null
    }

    const sections = parsed.sections
      .map((section: unknown) => {
        const source = section as Record<string, unknown>
        if (typeof source?.title !== 'string' || !source.title.trim()) return null

        const paragraphs = normalizeStringArray(source.paragraphs)
        const items = normalizeStringArray(source.items)
        const subsections = Array.isArray(source.subsections)
          ? source.subsections
              .map((subsection: unknown) => {
                const sub = subsection as Record<string, unknown>
                if (typeof sub?.title !== 'string' || !sub.title.trim()) return null
                const subParagraphs = normalizeStringArray(sub.paragraphs)
                if (subParagraphs.length === 0) return null
                return {
                  title: sub.title.trim(),
                  paragraphs: subParagraphs,
                }
              })
              .filter(Boolean)
          : undefined

        return {
          title: source.title.trim(),
          paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
          items: items.length > 0 ? items : undefined,
          subsections:
            subsections && subsections.length > 0
              ? (subsections as { title: string; paragraphs: string[] }[])
              : undefined,
        }
      })
      .filter(Boolean) as ManagedLegalOverrideSection[]

    if (sections.length === 0) return null

    return {
      eyebrow: parsed.eyebrow.trim(),
      title: parsed.title.trim(),
      subtitle: parsed.subtitle.trim(),
      updated: parsed.updated.trim(),
      sections,
    }
  } catch {
    return null
  }
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}
