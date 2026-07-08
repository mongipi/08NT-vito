import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Resi e Spedizioni',
  description: 'Informazioni su spedizioni, consegna, diritto di recesso, resi e rimborsi.',
}

const sections: LegalSection[] = [
  {
    title: '1. Titolare del sito',
    titleEn: '1. Site owner',
    paragraphs: [
      'Il sito 08 Natural Technology è gestito da VIPHARMA di Tatulli Vito & Co. S.A.S., con sede legale in Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), P. IVA 08203650729, Codice Fiscale 08203650729 e REA BA - 611529.',
      'Email: 08naturaltechnology@gmail.com. PEC: vipharma@pec.it.',
    ],
    paragraphsEn: [
      'The 08 Natural Technology website is operated by VIPHARMA di Tatulli Vito & Co. S.A.S., with registered office at Via Don Luigi Sturzo 44/46/48 - 70032 Bitonto (BA), Italy, VAT number 08203650729, Tax Code 08203650729 and REA BA - 611529.',
      'Email: 08naturaltechnology@gmail.com. Certified email (PEC): vipharma@pec.it.',
    ],
  },
  {
    title: '2. Spedizioni',
    titleEn: '2. Shipping',
    paragraphs: [
      'Gli ordini effettuati sul sito 08 Natural Technology vengono preparati e affidati a corrieri o operatori logistici selezionati per garantire una consegna sicura e tracciabile. I vettori utilizzati possono includere GLS, BRT e Poste Italiane, in base alla destinazione e alla modalità disponibile.',
      'I tempi di consegna possono variare in base alla destinazione, alla disponibilità dei prodotti, al periodo dell’anno, a eventuali festività, scioperi, condizioni meteo, cause di forza maggiore o rallentamenti non direttamente imputabili al Titolare.',
      'Le tempistiche indicate sul sito, nel carrello, al checkout o nelle comunicazioni successive all’ordine sono da intendersi come stime e non costituiscono termini essenziali, salvo diversa indicazione espressa.',
    ],
    paragraphsEn: [
      'Orders placed on the 08 Natural Technology website are prepared and handed over to couriers or logistics operators selected to ensure safe and traceable delivery. Carriers used may include GLS, BRT and Poste Italiane, depending on destination and available delivery method.',
      'Delivery times may vary depending on destination, product availability, time of year, holidays, strikes, weather conditions, force majeure or delays not directly attributable to the Data Controller.',
      'The timeframes indicated on the site, in the cart, at checkout or in communications following the order are to be considered estimates and do not constitute essential terms, unless expressly stated otherwise.',
    ],
  },
  {
    title: '3. Costi di spedizione',
    titleEn: '3. Shipping costs',
    paragraphs: [
      'I costi di spedizione sono indicati durante la procedura di acquisto, prima della conferma dell’ordine. L’importo può variare in base alla destinazione, al peso, al volume del pacco, alla modalità di consegna selezionata e a eventuali promozioni attive.',
      'Eventuali soglie per la spedizione gratuita, supplementi per spedizioni estere, consegne particolari o servizi aggiuntivi vengono mostrati, ove previsti, prima della conclusione dell’acquisto.',
    ],
    paragraphsEn: [
      'Shipping costs are shown during the purchase process, before the order is confirmed. The amount may vary depending on destination, weight, package volume, selected delivery method and any active promotions.',
      'Any free shipping thresholds, surcharges for international shipments, special deliveries or additional services are shown, where applicable, before the purchase is completed.',
    ],
  },
  {
    title: '4. Preparazione ed evasione degli ordini',
    titleEn: '4. Order preparation and fulfillment',
    paragraphs: [
      'Gli ordini vengono presi in carico dopo la corretta ricezione della richiesta e, ove previsto, dopo la conferma del pagamento. In caso di pagamento non completato, dati incompleti, indirizzo errato o necessità di verifica, l’evasione dell’ordine potrebbe subire ritardi.',
      'Il Titolare si riserva il diritto di contattare il cliente per correggere dati mancanti o inesatti prima della spedizione.',
    ],
    paragraphsEn: [
      'Orders are taken in charge after the request has been properly received and, where applicable, after payment confirmation. If payment is not completed, data is incomplete, the address is incorrect, or verification is needed, order fulfillment may be delayed.',
      'The Data Controller reserves the right to contact the customer to correct missing or inaccurate information before shipment.',
    ],
  },
  {
    title: '5. Tracciamento della spedizione',
    titleEn: '5. Shipment tracking',
    paragraphs: [
      'Quando disponibile, il cliente riceverà un codice di tracciamento o una comunicazione relativa allo stato della spedizione. Il tracking potrebbe attivarsi alcune ore dopo l’affidamento del pacco al corriere.',
      'Eventuali aggiornamenti visualizzati sui sistemi del corriere dipendono direttamente dall’operatore logistico incaricato della consegna.',
    ],
    paragraphsEn: [
      'When available, the customer will receive a tracking code or a communication regarding the shipment status. Tracking may become active a few hours after the package is handed over to the courier.',
      'Any updates shown on the courier\'s systems depend directly on the logistics operator responsible for delivery.',
    ],
  },
  {
    title: '6. Consegna del pacco',
    titleEn: '6. Package delivery',
    paragraphs: [
      'La consegna viene effettuata all’indirizzo indicato dal cliente in fase d’ordine. È responsabilità del cliente fornire dati corretti, completi e aggiornati, inclusi nominativo, indirizzo, numero civico, CAP, città, provincia, eventuale interno, scala, citofono e numero di telefono.',
      'In caso di indirizzo errato, destinatario assente, mancato ritiro, giacenza non svincolata o rifiuto del pacco, eventuali costi di riconsegna, giacenza, rientro o nuova spedizione potranno essere addebitati al cliente, salvo responsabilità direttamente imputabile al Titolare.',
    ],
    paragraphsEn: [
      'Delivery is made to the address provided by the customer when placing the order. It is the customer\'s responsibility to provide correct, complete and up-to-date information, including name, address, house number, postal code, city, province, apartment number, floor, intercom and phone number.',
      'In the event of an incorrect address, absent recipient, failed pickup, unclaimed parcel or refusal of the package, any costs for redelivery, storage, return or new shipment may be charged to the customer, unless directly attributable to the Data Controller.',
    ],
  },
  {
    title: '7. Pacco danneggiato o anomalie alla consegna',
    titleEn: '7. Damaged package or delivery issues',
    paragraphs: [
      'Al momento della consegna, il cliente è invitato a verificare l’integrità del pacco. In caso di imballo danneggiato, bagnato, aperto, manomesso o visibilmente alterato, si consiglia di accettare il pacco con riserva specifica, indicando al corriere il tipo di anomalia riscontrata.',
      'Esempi di riserva specifica: “pacco danneggiato”, “pacco aperto”, “imballo bagnato”, “collo schiacciato” o altra descrizione concreta del danno. Una riserva generica potrebbe non essere sufficiente per consentire una corretta gestione della pratica con il corriere.',
      'In caso di problemi alla consegna, il cliente è invitato a contattare tempestivamente il servizio clienti all’indirizzo 08naturaltechnology@gmail.com, allegando foto del pacco, dell’etichetta di spedizione, dell’imballo e dei prodotti ricevuti.',
    ],
    paragraphsEn: [
      'At the time of delivery, customers are invited to check the integrity of the package. If the packaging is damaged, wet, open, tampered with or visibly altered, it is recommended to accept the package with a specific note, indicating to the courier the type of issue found.',
      'Examples of specific notes: "damaged package", "open package", "wet packaging", "crushed parcel" or another concrete description of the damage. A generic note may not be sufficient to properly handle the case with the courier.',
      'In the event of delivery issues, customers are invited to promptly contact customer service at 08naturaltechnology@gmail.com, attaching photos of the package, the shipping label, the packaging and the products received.',
    ],
  },
  {
    title: '8. Diritto di recesso',
    titleEn: '8. Right of withdrawal',
    paragraphs: [
      'Il cliente consumatore ha diritto di recedere dall’acquisto, senza dover fornire alcuna motivazione, entro 14 giorni dal giorno in cui riceve il prodotto.',
      'Il diritto di recesso si applica esclusivamente al cliente consumatore, cioè alla persona fisica che acquista per scopi estranei all’attività imprenditoriale, commerciale, artigianale o professionale eventualmente svolta.',
      'Il diritto di recesso non si applica agli acquisti effettuati da professionisti, aziende, rivenditori o soggetti che acquistano con finalità collegate alla propria attività professionale o commerciale, salvo diverso accordo scritto.',
    ],
    paragraphsEn: [
      'Consumer customers have the right to withdraw from the purchase, without giving any reason, within 14 days from the day they receive the product.',
      'The right of withdrawal applies exclusively to consumer customers, i.e. individuals purchasing for purposes unrelated to any business, commercial, craft or professional activity they may carry out.',
      'The right of withdrawal does not apply to purchases made by professionals, businesses, resellers or parties purchasing for purposes related to their professional or commercial activity, unless otherwise agreed in writing.',
    ],
  },
  {
    title: '9. Come esercitare il diritto di recesso',
    titleEn: '9. How to exercise the right of withdrawal',
    paragraphs: [
      'Per esercitare il diritto di recesso, il cliente deve comunicare la propria decisione entro 14 giorni dalla consegna del prodotto. La comunicazione può essere inviata tramite email all’indirizzo 08naturaltechnology@gmail.com o tramite PEC all’indirizzo vipharma@pec.it.',
      'Nella comunicazione è necessario indicare nome e cognome del cliente, numero d’ordine, prodotto o prodotti per cui si richiede il recesso, data di ricezione dell’ordine e recapito email o telefonico per eventuali comunicazioni.',
      <>È possibile usare anche il <a href="/moduli/modulo-recesso-08-natural-technology.txt" download>modulo di recesso scaricabile</a> e inviarlo via email o PEC dopo averlo compilato.</>,
      'Procedura consigliata per una gestione più rapida:',
    ],
    paragraphsEn: [
      'To exercise the right of withdrawal, customers must communicate their decision within 14 days of receiving the product. The communication can be sent by email to 08naturaltechnology@gmail.com or by certified email (PEC) to vipharma@pec.it.',
      'The communication must include the customer\'s first and last name, order number, product(s) for which withdrawal is requested, date the order was received, and an email or phone contact for further communications.',
      <>You can also use the <a href="/moduli/modulo-recesso-08-natural-technology.txt" download>downloadable withdrawal form</a> and send it by email or PEC after filling it out.</>,
      'Recommended procedure for faster handling:',
    ],
    items: [
      'inviare la richiesta di recesso indicando numero ordine, dati cliente e prodotti interessati;',
      'attendere la risposta del servizio clienti con le istruzioni operative e l’indirizzo di rientro;',
      'preparare il pacco usando un imballo adeguato e proteggendo i prodotti durante il trasporto;',
      'spedire il reso entro 14 giorni dalla comunicazione di recesso, conservando ricevuta e tracking;',
      'inviare, se disponibile, il codice di tracciamento al servizio clienti per agevolare la verifica del rientro.',
    ],
    itemsEn: [
      'send the withdrawal request indicating order number, customer details and products involved;',
      'wait for customer service\'s response with operating instructions and the return address;',
      'prepare the package using adequate packaging and protecting the products during transport;',
      'ship the return within 14 days of the withdrawal communication, keeping the receipt and tracking number;',
      'send, if available, the tracking code to customer service to facilitate verification of the return.',
    ],
  },
  {
    title: '10. Condizioni per il reso dei prodotti',
    titleEn: '10. Conditions for product returns',
    paragraphs: [
      'I prodotti devono essere restituiti integri, non utilizzati, non danneggiati, completi di confezione originale, etichette, sigilli, accessori e ogni elemento ricevuto con l’ordine.',
      'Per motivi igienici e di tutela della salute, il diritto di recesso può essere escluso per prodotti sigillati che siano stati aperti dopo la consegna e che non si prestino a essere restituiti.',
      'In particolare, gli integratori alimentari, i prodotti destinati all’assunzione, i prodotti cosmetici, i prodotti per l’igiene e altri articoli sigillati potranno essere accettati in reso solo se ancora integri, chiusi, non utilizzati e con sigillo originale non rimosso.',
      'Il cliente è responsabile dell’eventuale diminuzione di valore del prodotto derivante da una manipolazione diversa da quella necessaria per stabilirne natura, caratteristiche e funzionamento.',
    ],
    paragraphsEn: [
      'Products must be returned intact, unused, undamaged, complete with original packaging, labels, seals, accessories and every item received with the order.',
      'For hygiene and health protection reasons, the right of withdrawal may be excluded for sealed products that have been opened after delivery and are not suitable for return.',
      'In particular, food supplements, products intended for consumption, cosmetic products, hygiene products and other sealed items can only be accepted for return if still intact, closed, unused and with the original seal not removed.',
      'The customer is responsible for any diminished value of the product resulting from handling other than what is necessary to establish its nature, characteristics and functioning.',
    ],
  },
  {
    title: '11. Spedizione del reso',
    titleEn: '11. Shipping the return',
    paragraphs: [
      'Dopo aver comunicato il recesso, il cliente deve restituire i prodotti entro 14 giorni dalla data in cui ha comunicato la volontà di recedere.',
      'Le spese dirette di restituzione dei prodotti sono a carico del cliente, salvo diverso accordo scritto o diversa indicazione fornita dal Titolare.',
      'Il cliente è invitato a imballare accuratamente i prodotti per evitare danni durante il trasporto. Fino alla ricezione del reso da parte del Titolare, la responsabilità del trasporto resta in capo al cliente.',
      'L’indirizzo di spedizione del reso sarà comunicato dal servizio clienti dopo la ricezione della richiesta di recesso.',
    ],
    paragraphsEn: [
      'After communicating the withdrawal, customers must return the products within 14 days from the date they communicated their intention to withdraw.',
      'The direct cost of returning the products is borne by the customer, unless otherwise agreed in writing or otherwise indicated by the Data Controller.',
      'Customers are invited to carefully package the products to avoid damage during transport. Until the return is received by the Data Controller, responsibility for transport remains with the customer.',
      'The return shipping address will be communicated by customer service after receiving the withdrawal request.',
    ],
  },
  {
    title: '12. Rimborso in caso di recesso',
    titleEn: '12. Refund in case of withdrawal',
    paragraphs: [
      'In caso di corretto esercizio del diritto di recesso, il Titolare rimborserà i pagamenti ricevuti dal cliente, incluse le spese di consegna standard sostenute per l’ordine, ove dovute secondo la normativa applicabile.',
      'Non saranno rimborsati eventuali costi supplementari derivanti dalla scelta di una modalità di consegna diversa da quella standard o meno costosa proposta al momento dell’acquisto.',
      'In caso di recesso parziale relativo solo ad alcuni prodotti dell’ordine, le spese di spedizione iniziali potranno non essere rimborsate se non direttamente collegate ai prodotti restituiti o se l’ordine residuo mantiene le condizioni originarie di spedizione.',
      'Il rimborso sarà effettuato utilizzando lo stesso metodo di pagamento scelto dal cliente per l’acquisto, salvo diverso accordo espresso. Per i pagamenti online, il rimborso potrà essere gestito tramite il provider di pagamento esterno Stripe.',
      'Il Titolare potrà sospendere il rimborso fino alla ricezione dei prodotti restituiti oppure fino alla dimostrazione da parte del cliente di aver rispedito i prodotti, se precedente.',
    ],
    paragraphsEn: [
      'If the right of withdrawal is correctly exercised, the Data Controller will refund the payments received from the customer, including standard delivery costs incurred for the order, where due under applicable regulations.',
      'Any additional costs resulting from choosing a delivery method other than the standard or least expensive one offered at the time of purchase will not be refunded.',
      'In case of partial withdrawal relating to only some products in the order, the initial shipping costs may not be refunded if not directly related to the returned products or if the remaining order retains the original shipping conditions.',
      'The refund will be made using the same payment method chosen by the customer for the purchase, unless otherwise expressly agreed. For online payments, the refund may be processed through the external payment provider Stripe.',
      'The Data Controller may withhold the refund until the returned products are received, or until the customer provides proof of having shipped the products back, whichever comes first.',
    ],
  },
  {
    title: '13. Prodotti danneggiati, errati o non conformi',
    titleEn: '13. Damaged, incorrect or non-conforming products',
    paragraphs: [
      'Se il cliente riceve un prodotto danneggiato, errato, mancante o non conforme rispetto all’ordine effettuato, è invitato a contattare il servizio clienti all’indirizzo 08naturaltechnology@gmail.com.',
      'Per una gestione più rapida della pratica, è consigliabile allegare numero d’ordine, descrizione del problema riscontrato, foto del prodotto ricevuto, foto del lotto e della scadenza se presenti, foto dell’imballo esterno e interno e foto dell’etichetta di spedizione.',
      'Dopo le opportune verifiche, il Titolare potrà proporre, a seconda del caso, la sostituzione del prodotto, l’invio dell’articolo corretto, un rimborso totale o parziale, oppure altra soluzione concordata con il cliente.',
      'Le presenti condizioni non limitano i diritti riconosciuti al consumatore dalla normativa applicabile in materia di garanzia legale e conformità dei beni.',
    ],
    paragraphsEn: [
      'If the customer receives a product that is damaged, incorrect, missing or non-conforming to the order placed, they are invited to contact customer service at 08naturaltechnology@gmail.com.',
      'For faster handling, it is recommended to attach the order number, a description of the issue found, a photo of the product received, a photo of the batch and expiry date if present, photos of the outer and inner packaging and a photo of the shipping label.',
      'After appropriate checks, the Data Controller may offer, depending on the case, product replacement, shipment of the correct item, a full or partial refund, or another solution agreed with the customer.',
      'These terms do not limit the rights recognized to consumers by applicable regulations regarding legal warranty and conformity of goods.',
    ],
  },
  {
    title: '14. Mancato ritiro, indirizzo errato o pacco rientrato',
    titleEn: '14. Failed pickup, incorrect address or returned package',
    paragraphs: [
      'In caso di mancato ritiro del pacco, indirizzo errato, destinatario assente, rifiuto della consegna o rientro della spedizione per cause non imputabili al Titolare, eventuali costi sostenuti per spedizione, giacenza, rientro o nuova consegna potranno essere trattenuti dal rimborso o richiesti al cliente.',
      'Se il cliente desidera una nuova spedizione, il Titolare potrà richiedere il pagamento dei relativi costi prima del nuovo invio.',
    ],
    paragraphsEn: [
      'In the event of failed package pickup, incorrect address, absent recipient, refusal of delivery, or return of the shipment for reasons not attributable to the Data Controller, any costs incurred for shipping, storage, return or new delivery may be withheld from the refund or requested from the customer.',
      'If the customer wants a new shipment, the Data Controller may request payment of the related costs before the new shipment.',
    ],
  },
  {
    title: '15. Cambio prodotto',
    titleEn: '15. Product exchange',
    paragraphs: [
      'Il cambio prodotto non è garantito automaticamente. Eventuali sostituzioni per cambio articolo, formato o preferenza personale potranno essere valutate dal servizio clienti solo se il prodotto risulta integro, sigillato, non utilizzato e idoneo alla rivendita.',
      'Le eventuali spese di restituzione e nuova spedizione, in caso di cambio per scelta del cliente, saranno a carico del cliente, salvo diversa comunicazione scritta.',
    ],
    paragraphsEn: [
      'Product exchange is not automatically guaranteed. Any exchanges for a different item, format or personal preference may be considered by customer service only if the product is intact, sealed, unused and suitable for resale.',
      'Any costs for return and new shipment, in case of an exchange requested by the customer, will be borne by the customer, unless otherwise communicated in writing.',
    ],
  },
  {
    title: '16. Contatti per assistenza',
    titleEn: '16. Support contacts',
    paragraphs: [
      'Per richieste relative a spedizioni, resi, rimborsi, prodotti danneggiati o non conformi, il cliente può contattare il servizio clienti all’indirizzo email 08naturaltechnology@gmail.com oppure tramite PEC vipharma@pec.it.',
      'Il servizio clienti valuterà la richiesta e fornirà riscontro nel minor tempo possibile, compatibilmente con la complessità della pratica e con i tempi tecnici di verifica con corrieri, magazzino o provider di pagamento.',
    ],
    paragraphsEn: [
      'For requests regarding shipping, returns, refunds, damaged or non-conforming products, customers can contact customer service by email at 08naturaltechnology@gmail.com or via certified email (PEC) at vipharma@pec.it.',
      'Customer service will review the request and respond as quickly as possible, depending on the complexity of the case and the technical time needed to verify with couriers, warehouse or payment providers.',
    ],
  },
  {
    title: '17. Modifiche alla presente informativa',
    titleEn: '17. Changes to this notice',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare o modificare la presente pagina in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
    paragraphsEn: [
      'The Data Controller reserves the right to update or modify this page at any time. Changes will be published on this page indicating the date of the last update.',
    ],
  },
]

export default function ResiESpedizioniPage() {
  return (
    <LegalDocument
      eyebrow="Assistenza"
      eyebrowEn="Support"
      title="Spedizioni, Resi e Rimborsi"
      titleEn="Shipping, Returns and Refunds"
      subtitle="Informazioni sulle modalità di spedizione, consegna, diritto di recesso, resi e rimborsi."
      subtitleEn="Information on shipping, delivery, right of withdrawal, returns and refunds."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
