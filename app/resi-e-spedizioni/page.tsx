import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Resi e Spedizioni',
  description: 'Informazioni su spedizioni, consegna, diritto di recesso, resi e rimborsi.',
}

const sections: LegalSection[] = [
  {
    title: '1. Titolare del sito',
    paragraphs: [
      'Il sito 08 Natural Technology è gestito da VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729, Codice Fiscale 08203650729 e REA BA - 611529.',
      'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
    ],
  },
  {
    title: '2. Spedizioni',
    paragraphs: [
      'Gli ordini effettuati sul sito 08 Natural Technology vengono preparati e affidati a corrieri o operatori logistici selezionati per garantire una consegna sicura e tracciabile. I vettori utilizzati possono includere GLS, BRT e Poste Italiane, in base alla destinazione e alla modalità disponibile.',
      'I tempi di consegna possono variare in base alla destinazione, alla disponibilità dei prodotti, al periodo dell’anno, a eventuali festività, scioperi, condizioni meteo, cause di forza maggiore o rallentamenti non direttamente imputabili al Titolare.',
      'Le tempistiche indicate sul sito, nel carrello, al checkout o nelle comunicazioni successive all’ordine sono da intendersi come stime e non costituiscono termini essenziali, salvo diversa indicazione espressa.',
    ],
  },
  {
    title: '3. Costi di spedizione',
    paragraphs: [
      'I costi di spedizione sono indicati durante la procedura di acquisto, prima della conferma dell’ordine. L’importo può variare in base alla destinazione, al peso, al volume del pacco, alla modalità di consegna selezionata e a eventuali promozioni attive.',
      'Eventuali soglie per la spedizione gratuita, supplementi per spedizioni estere, consegne particolari o servizi aggiuntivi vengono mostrati, ove previsti, prima della conclusione dell’acquisto.',
    ],
  },
  {
    title: '4. Preparazione ed evasione degli ordini',
    paragraphs: [
      'Gli ordini vengono presi in carico dopo la corretta ricezione della richiesta e, ove previsto, dopo la conferma del pagamento. In caso di pagamento non completato, dati incompleti, indirizzo errato o necessità di verifica, l’evasione dell’ordine potrebbe subire ritardi.',
      'Il Titolare si riserva il diritto di contattare il cliente per correggere dati mancanti o inesatti prima della spedizione.',
    ],
  },
  {
    title: '5. Tracciamento della spedizione',
    paragraphs: [
      'Quando disponibile, il cliente riceverà un codice di tracciamento o una comunicazione relativa allo stato della spedizione. Il tracking potrebbe attivarsi alcune ore dopo l’affidamento del pacco al corriere.',
      'Eventuali aggiornamenti visualizzati sui sistemi del corriere dipendono direttamente dall’operatore logistico incaricato della consegna.',
    ],
  },
  {
    title: '6. Consegna del pacco',
    paragraphs: [
      'La consegna viene effettuata all’indirizzo indicato dal cliente in fase d’ordine. È responsabilità del cliente fornire dati corretti, completi e aggiornati, inclusi nominativo, indirizzo, numero civico, CAP, città, provincia, eventuale interno, scala, citofono e numero di telefono.',
      'In caso di indirizzo errato, destinatario assente, mancato ritiro, giacenza non svincolata o rifiuto del pacco, eventuali costi di riconsegna, giacenza, rientro o nuova spedizione potranno essere addebitati al cliente, salvo responsabilità direttamente imputabile al Titolare.',
    ],
  },
  {
    title: '7. Pacco danneggiato o anomalie alla consegna',
    paragraphs: [
      'Al momento della consegna, il cliente è invitato a verificare l’integrità del pacco. In caso di imballo danneggiato, bagnato, aperto, manomesso o visibilmente alterato, si consiglia di accettare il pacco con riserva specifica, indicando al corriere il tipo di anomalia riscontrata.',
      'Esempi di riserva specifica: “pacco danneggiato”, “pacco aperto”, “imballo bagnato”, “collo schiacciato” o altra descrizione concreta del danno. Una riserva generica potrebbe non essere sufficiente per consentire una corretta gestione della pratica con il corriere.',
      'In caso di problemi alla consegna, il cliente è invitato a contattare tempestivamente il servizio clienti all’indirizzo 08naturaltechnology@gmail.com, allegando foto del pacco, dell’etichetta di spedizione, dell’imballo e dei prodotti ricevuti.',
    ],
  },
  {
    title: '8. Diritto di recesso',
    paragraphs: [
      'Il cliente consumatore ha diritto di recedere dall’acquisto, senza dover fornire alcuna motivazione, entro 14 giorni dal giorno in cui riceve il prodotto.',
      'Il diritto di recesso si applica esclusivamente al cliente consumatore, cioè alla persona fisica che acquista per scopi estranei all’attività imprenditoriale, commerciale, artigianale o professionale eventualmente svolta.',
      'Il diritto di recesso non si applica agli acquisti effettuati da professionisti, aziende, rivenditori o soggetti che acquistano con finalità collegate alla propria attività professionale o commerciale, salvo diverso accordo scritto.',
    ],
  },
  {
    title: '9. Come esercitare il diritto di recesso',
    paragraphs: [
      'Per esercitare il diritto di recesso, il cliente deve comunicare la propria decisione entro 14 giorni dalla consegna del prodotto. La comunicazione può essere inviata tramite email all’indirizzo 08naturaltechnology@gmail.com o tramite PEC all’indirizzo vipharma@pec.it.',
      'Nella comunicazione è necessario indicare nome e cognome del cliente, numero d’ordine, prodotto o prodotti per cui si richiede il recesso, data di ricezione dell’ordine e recapito email o telefonico per eventuali comunicazioni.',
      <>È possibile usare anche il <a href="/moduli/modulo-recesso-08-natural-technology.txt" download>modulo di recesso scaricabile</a> e inviarlo via email o PEC dopo averlo compilato.</>,
      'Procedura consigliata per una gestione più rapida:',
    ],
    items: [
      'inviare la richiesta di recesso indicando numero ordine, dati cliente e prodotti interessati;',
      'attendere la risposta del servizio clienti con le istruzioni operative e l’indirizzo di rientro;',
      'preparare il pacco usando un imballo adeguato e proteggendo i prodotti durante il trasporto;',
      'spedire il reso entro 14 giorni dalla comunicazione di recesso, conservando ricevuta e tracking;',
      'inviare, se disponibile, il codice di tracciamento al servizio clienti per agevolare la verifica del rientro.',
    ],
  },
  {
    title: '10. Condizioni per il reso dei prodotti',
    paragraphs: [
      'I prodotti devono essere restituiti integri, non utilizzati, non danneggiati, completi di confezione originale, etichette, sigilli, accessori e ogni elemento ricevuto con l’ordine.',
      'Per motivi igienici e di tutela della salute, il diritto di recesso può essere escluso per prodotti sigillati che siano stati aperti dopo la consegna e che non si prestino a essere restituiti.',
      'In particolare, gli integratori alimentari, i prodotti destinati all’assunzione, i prodotti cosmetici, i prodotti per l’igiene e altri articoli sigillati potranno essere accettati in reso solo se ancora integri, chiusi, non utilizzati e con sigillo originale non rimosso.',
      'Il cliente è responsabile dell’eventuale diminuzione di valore del prodotto derivante da una manipolazione diversa da quella necessaria per stabilirne natura, caratteristiche e funzionamento.',
    ],
  },
  {
    title: '11. Spedizione del reso',
    paragraphs: [
      'Dopo aver comunicato il recesso, il cliente deve restituire i prodotti entro 14 giorni dalla data in cui ha comunicato la volontà di recedere.',
      'Le spese dirette di restituzione dei prodotti sono a carico del cliente, salvo diverso accordo scritto o diversa indicazione fornita dal Titolare.',
      'Il cliente è invitato a imballare accuratamente i prodotti per evitare danni durante il trasporto. Fino alla ricezione del reso da parte del Titolare, la responsabilità del trasporto resta in capo al cliente.',
      'L’indirizzo di spedizione del reso sarà comunicato dal servizio clienti dopo la ricezione della richiesta di recesso.',
    ],
  },
  {
    title: '12. Rimborso in caso di recesso',
    paragraphs: [
      'In caso di corretto esercizio del diritto di recesso, il Titolare rimborserà i pagamenti ricevuti dal cliente, incluse le spese di consegna standard sostenute per l’ordine, ove dovute secondo la normativa applicabile.',
      'Non saranno rimborsati eventuali costi supplementari derivanti dalla scelta di una modalità di consegna diversa da quella standard o meno costosa proposta al momento dell’acquisto.',
      'In caso di recesso parziale relativo solo ad alcuni prodotti dell’ordine, le spese di spedizione iniziali potranno non essere rimborsate se non direttamente collegate ai prodotti restituiti o se l’ordine residuo mantiene le condizioni originarie di spedizione.',
      'Il rimborso sarà effettuato utilizzando lo stesso metodo di pagamento scelto dal cliente per l’acquisto, salvo diverso accordo espresso. Per i pagamenti online, il rimborso potrà essere gestito tramite il provider di pagamento esterno Stripe.',
      'Il Titolare potrà sospendere il rimborso fino alla ricezione dei prodotti restituiti oppure fino alla dimostrazione da parte del cliente di aver rispedito i prodotti, se precedente.',
    ],
  },
  {
    title: '13. Prodotti danneggiati, errati o non conformi',
    paragraphs: [
      'Se il cliente riceve un prodotto danneggiato, errato, mancante o non conforme rispetto all’ordine effettuato, è invitato a contattare il servizio clienti all’indirizzo 08naturaltechnology@gmail.com.',
      'Per una gestione più rapida della pratica, è consigliabile allegare numero d’ordine, descrizione del problema riscontrato, foto del prodotto ricevuto, foto del lotto e della scadenza se presenti, foto dell’imballo esterno e interno e foto dell’etichetta di spedizione.',
      'Dopo le opportune verifiche, il Titolare potrà proporre, a seconda del caso, la sostituzione del prodotto, l’invio dell’articolo corretto, un rimborso totale o parziale, oppure altra soluzione concordata con il cliente.',
      'Le presenti condizioni non limitano i diritti riconosciuti al consumatore dalla normativa applicabile in materia di garanzia legale e conformità dei beni.',
    ],
  },
  {
    title: '14. Mancato ritiro, indirizzo errato o pacco rientrato',
    paragraphs: [
      'In caso di mancato ritiro del pacco, indirizzo errato, destinatario assente, rifiuto della consegna o rientro della spedizione per cause non imputabili al Titolare, eventuali costi sostenuti per spedizione, giacenza, rientro o nuova consegna potranno essere trattenuti dal rimborso o richiesti al cliente.',
      'Se il cliente desidera una nuova spedizione, il Titolare potrà richiedere il pagamento dei relativi costi prima del nuovo invio.',
    ],
  },
  {
    title: '15. Cambio prodotto',
    paragraphs: [
      'Il cambio prodotto non è garantito automaticamente. Eventuali sostituzioni per cambio articolo, formato o preferenza personale potranno essere valutate dal servizio clienti solo se il prodotto risulta integro, sigillato, non utilizzato e idoneo alla rivendita.',
      'Le eventuali spese di restituzione e nuova spedizione, in caso di cambio per scelta del cliente, saranno a carico del cliente, salvo diversa comunicazione scritta.',
    ],
  },
  {
    title: '16. Contatti per assistenza',
    paragraphs: [
      'Per richieste relative a spedizioni, resi, rimborsi, prodotti danneggiati o non conformi, il cliente può contattare il servizio clienti all’indirizzo email 08naturaltechnology@gmail.com oppure tramite PEC vipharma@pec.it.',
      'Il servizio clienti valuterà la richiesta e fornirà riscontro nel minor tempo possibile, compatibilmente con la complessità della pratica e con i tempi tecnici di verifica con corrieri, magazzino o provider di pagamento.',
    ],
  },
  {
    title: '17. Modifiche alla presente informativa',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare o modificare la presente pagina in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
  },
]

export default function ResiESpedizioniPage() {
  return (
    <LegalDocument
      eyebrow="Assistenza"
      title="Spedizioni, Resi e Rimborsi"
      subtitle="Informazioni sulle modalità di spedizione, consegna, diritto di recesso, resi e rimborsi."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
