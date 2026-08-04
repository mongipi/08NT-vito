import type { Metadata } from 'next'
import { LegalDocument, type LegalSection } from '@/components/ui/LegalDocument'

export const metadata: Metadata = {
  title: 'Note Legali',
  description: 'Informazioni legali relative all’utilizzo del sito 08 Natural Technology.',
}

const sections: LegalSection[] = [
  {
    title: '1. Informazioni sul titolare del sito',
    titleEn: '1. Site owner information',
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
    title: '2. Accesso e utilizzo del sito',
    titleEn: '2. Access and use of the site',
    paragraphs: [
      'L’accesso e l’utilizzo del sito comportano l’accettazione delle presenti Note Legali. L’utente si impegna a utilizzare il sito in modo lecito, corretto e conforme alla normativa applicabile, evitando qualsiasi comportamento che possa danneggiare, compromettere o limitare il funzionamento del sito stesso.',
    ],
    paragraphsEn: [
      'Accessing and using the site implies acceptance of this Legal Notice. Users agree to use the site lawfully, correctly and in compliance with applicable regulations, avoiding any conduct that could damage, compromise or limit the operation of the site.',
    ],
  },
  {
    title: '3. Proprietà intellettuale',
    titleEn: '3. Intellectual property',
    paragraphs: [
      'Tutti i contenuti presenti sul sito, inclusi testi, immagini, fotografie, grafiche, loghi, marchi, elementi visuali, layout, descrizioni prodotto e materiali informativi, sono di proprietà del Titolare o concessi in uso da soggetti terzi autorizzati.',
      'È vietata la riproduzione, distribuzione, modifica, pubblicazione, copia o utilizzo dei contenuti del sito senza preventiva autorizzazione scritta del Titolare.',
    ],
    paragraphsEn: [
      'All content on the site, including text, images, photographs, graphics, logos, trademarks, visual elements, layout, product descriptions and informational materials, is owned by the Data Controller or licensed by authorized third parties.',
      'Reproduction, distribution, modification, publication, copying or use of the site\'s content without prior written authorization from the Data Controller is prohibited.',
    ],
  },
  {
    title: '4. Marchio 08 Natural Technology',
    titleEn: '4. 08 Natural Technology trademark',
    paragraphs: [
      'Il marchio 08 Natural Technology, il relativo logo, l’identità visiva e i materiali collegati rappresentano elementi distintivi del brand. Qualsiasi utilizzo non autorizzato del marchio o dei suoi elementi grafici è vietato.',
    ],
    paragraphsEn: [
      'The 08 Natural Technology trademark, its logo, visual identity and related materials are distinctive elements of the brand. Any unauthorized use of the trademark or its graphic elements is prohibited.',
    ],
  },
  {
    title: '5. Informazioni sui prodotti',
    titleEn: '5. Product information',
    paragraphs: [
      'Le informazioni presenti sul sito hanno finalità informative e commerciali. I prodotti 08 Natural Technology sono integratori alimentari e non devono essere intesi come medicinali né come strumenti destinati a diagnosticare, trattare, curare o prevenire malattie.',
      'Gli integratori alimentari non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano. Prima dell’utilizzo, si raccomanda di leggere attentamente l’etichetta, le modalità d’uso e le avvertenze riportate sulla confezione.',
      'In caso di gravidanza, allattamento, patologie, terapie farmacologiche in corso o dubbi specifici, è consigliabile consultare il medico o il farmacista prima dell’assunzione.',
    ],
    paragraphsEn: [
      'The information on the site is provided for informational and commercial purposes. 08 Natural Technology products are food supplements and should not be understood as medicines or as tools intended to diagnose, treat, cure or prevent diseases.',
      'Food supplements are not a substitute for a varied and balanced diet and a healthy lifestyle. Before use, it is recommended to carefully read the label, instructions for use and warnings on the packaging.',
      'In case of pregnancy, breastfeeding, medical conditions, ongoing drug therapies or specific concerns, it is advisable to consult a doctor or pharmacist before use.',
    ],
  },
  {
    title: '6. Accuratezza delle informazioni',
    titleEn: '6. Accuracy of information',
    paragraphs: [
      'Il Titolare si impegna a mantenere aggiornate e corrette le informazioni pubblicate sul sito. Tuttavia, non può essere esclusa la presenza di errori materiali, refusi, imprecisioni tecniche, variazioni di disponibilità, immagini puramente illustrative o aggiornamenti non ancora recepiti.',
      'Il Titolare si riserva il diritto di modificare, aggiornare o correggere in qualsiasi momento contenuti, descrizioni, immagini, prezzi, disponibilità e caratteristiche dei prodotti, senza obbligo di preavviso.',
    ],
    paragraphsEn: [
      'The Data Controller strives to keep the information published on the site up to date and accurate. However, the presence of material errors, typos, technical inaccuracies, availability changes, purely illustrative images or updates not yet reflected cannot be excluded.',
      'The Data Controller reserves the right to modify, update or correct content, descriptions, images, prices, availability and product characteristics at any time, without prior notice.',
    ],
  },
  {
    title: '7. Prezzi, disponibilità e ordini',
    titleEn: '7. Prices, availability and orders',
    paragraphs: [
      'Prezzi, promozioni e disponibilità dei prodotti possono variare nel tempo. L’eventuale conferma automatica della ricezione dell’ordine non implica necessariamente accettazione definitiva dello stesso, che resta subordinata alla verifica della disponibilità, della correttezza dei dati e del buon esito del pagamento.',
      'In caso di errore evidente su prezzo, disponibilità o descrizione del prodotto, il Titolare si riserva il diritto di contattare il cliente per proporre una soluzione alternativa, correggere l’errore o annullare l’ordine con eventuale rimborso.',
    ],
    paragraphsEn: [
      'Prices, promotions and product availability may change over time. Automatic confirmation of order receipt does not necessarily imply final acceptance of the order, which remains subject to verification of availability, accuracy of data and successful payment.',
      'In the event of an obvious error in price, availability or product description, the Data Controller reserves the right to contact the customer to propose an alternative solution, correct the error, or cancel the order with any applicable refund.',
    ],
  },
  {
    title: '8. Pagamenti',
    titleEn: '8. Payments',
    paragraphs: [
      'I pagamenti online possono essere gestiti tramite provider esterni autorizzati, tra cui Stripe. I dati completi relativi agli strumenti di pagamento non vengono conservati direttamente dal sito, ma trattati dai rispettivi provider secondo le proprie condizioni e informative privacy.',
    ],
    paragraphsEn: [
      'Online payments may be processed through authorized external providers, including Stripe. Full payment instrument data is not stored directly by the site, but is processed by the respective providers according to their own terms and privacy notices.',
    ],
  },
  {
    title: '9. Link esterni',
    titleEn: '9. External links',
    paragraphs: [
      'Il sito può contenere collegamenti a siti, piattaforme o servizi di terze parti. Il Titolare non è responsabile dei contenuti, delle informative privacy, delle condizioni di utilizzo o delle pratiche adottate da siti esterni non gestiti direttamente.',
    ],
    paragraphsEn: [
      'The site may contain links to third-party sites, platforms or services. The Data Controller is not responsible for the content, privacy notices, terms of use or practices adopted by external sites not directly operated by it.',
    ],
  },
  {
    title: '10. Limitazione di responsabilità',
    titleEn: '10. Limitation of liability',
    paragraphs: [
      'Il Titolare non garantisce che il sito sia sempre disponibile, privo di errori, interruzioni, vulnerabilità o malfunzionamenti tecnici. Nei limiti consentiti dalla legge, il Titolare non risponde di eventuali danni derivanti da uso improprio del sito, impossibilità temporanea di accesso, problemi tecnici, errori dell’utente o utilizzo non conforme delle informazioni pubblicate.',
    ],
    paragraphsEn: [
      'The Data Controller does not guarantee that the site will always be available, error-free, or free from interruptions, vulnerabilities or technical malfunctions. To the extent permitted by law, the Data Controller is not liable for any damages arising from improper use of the site, temporary inability to access it, technical issues, user errors or non-compliant use of the published information.',
    ],
  },
  {
    title: '11. Privacy e cookie',
    titleEn: '11. Privacy and cookies',
    paragraphs: [
      'Il trattamento dei dati personali degli utenti è disciplinato dalla Privacy Policy del sito. L’utilizzo di cookie e strumenti di tracciamento è disciplinato dalla Cookie Policy. L’utente è invitato a consultare entrambe le informative per maggiori dettagli.',
    ],
    paragraphsEn: [
      'The processing of users\' personal data is governed by the site\'s Privacy Policy. The use of cookies and tracking tools is governed by the Cookie Policy. Users are invited to review both notices for further details.',
    ],
  },
  {
    title: '12. Risoluzione delle controversie',
    titleEn: '12. Dispute resolution',
    paragraphs: [
      'Per eventuali reclami o segnalazioni, l’utente può contattare il Titolare ai recapiti indicati nella presente pagina. Il Titolare valuterà la richiesta e fornirà riscontro entro tempi ragionevoli.',
      'La piattaforma europea per la risoluzione online delle controversie dei consumatori, nota come piattaforma ODR, è stata dismessa dal 20 luglio 2025. Restano fermi gli eventuali strumenti di tutela previsti dalla normativa vigente, inclusi gli organismi ADR competenti, ove applicabili.',
    ],
    paragraphsEn: [
      'For any complaints or reports, users can contact the Data Controller using the contact details provided on this page. The Data Controller will review the request and respond within a reasonable time.',
      'The European platform for online consumer dispute resolution, known as the ODR platform, was decommissioned on 20 July 2025. Any protection mechanisms provided for by current regulations remain in place, including the competent ADR bodies, where applicable.',
    ],
  },
  {
    title: '13. Legge applicabile e foro competente',
    titleEn: '13. Applicable law and jurisdiction',
    paragraphs: [
      'Le presenti Note Legali sono disciplinate dalla legge italiana. Per gli utenti consumatori restano fermi i diritti inderogabili previsti dalla normativa applicabile, inclusa la competenza del foro del luogo di residenza o domicilio del consumatore, ove prevista dalla legge.',
      'Per gli utenti non qualificabili come consumatori, eventuali controversie saranno devolute al foro competente individuato secondo la normativa italiana vigente.',
    ],
    paragraphsEn: [
      'This Legal Notice is governed by Italian law. For consumer users, the mandatory rights provided for by applicable regulations remain in place, including jurisdiction of the court in the place of residence or domicile of the consumer, where provided for by law.',
      'For users who do not qualify as consumers, any disputes will be referred to the competent court identified in accordance with current Italian law.',
    ],
  },
  {
    title: '14. Modifiche alle Note Legali',
    titleEn: '14. Changes to this Legal Notice',
    paragraphs: [
      'Il Titolare si riserva il diritto di aggiornare o modificare le presenti Note Legali in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
    paragraphsEn: [
      'The Data Controller reserves the right to update or modify this Legal Notice at any time. Changes will be published on this page indicating the date of the last update.',
    ],
  },
]

export default function NoteLegaliPage() {
  return (
    <LegalDocument
      documentKey="legal-notes"
      eyebrow="Legale"
      eyebrowEn="Legal"
      title="Note Legali"
      titleEn="Legal Notice"
      subtitle="Informazioni legali relative all’utilizzo del sito 08 Natural Technology."
      subtitleEn="Legal information regarding the use of the 08 Natural Technology website."
      updated="04 luglio 2026"
      sections={sections}
    />
  )
}
