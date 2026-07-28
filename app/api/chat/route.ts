import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProducts } from '@/services/products'
import { getArticles } from '@/services/articles'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type KnowledgeEntry = {
  kind: 'base' | 'product' | 'article'
  title: string
  body: string
  url?: string
  tags?: string[]
  searchable: string
  meta?: {
    shortDescription?: string
    usage?: string
    format?: string
    price?: number
    comparePrice?: number | null
  }
}

type ProductRule = {
  keywords: string[]
  productMatch: string[]
  needLabel: string
}

type ProductContext = {
  entry: KnowledgeEntry
  needLabel: string
}

type OrderLookupResult =
  | { kind: 'not-order-question' }
  | { kind: 'missing-data'; missing: string[] }
  | { kind: 'not-found'; orderRef: string; email: string }
  | {
      kind: 'found'
      orderRef: string
      email: string
      order: {
        id: string
        status: string
        paymentMethod: string
        total: number
        createdAt: Date
        deliveryType: string
        pickupCarrier: string | null
        pickupPointCode: string | null
        pickupPointAddress: string | null
        shippingAddress: {
          city: string
          postalCode: string
          province: string | null
        } | null
      }
    }

const KNOWLEDGE_CACHE_TTL_MS = 10 * 60 * 1000
const MAX_MESSAGE_HISTORY = 8
const MAX_CONTEXT_ENTRIES = 6
const FOLLOW_UP_HINTS = [
  'Posso anche aiutarti a capire se e piu adatto per microcircolo, gambe pesanti o drenaggio.',
  'Se vuoi, posso spiegarti quando assumerlo e per quanto tempo usarlo.',
  'Se hai altri obiettivi, posso anche confrontarlo con gli altri prodotti della linea.',
]
const DIRECT_SUPPORT =
  'Se preferisci assistenza diretta, puoi scrivere a 08naturaltechnology@gmail.com o su WhatsApp al 351 507 8701.'

const PRODUCT_RULES: ProductRule[] = [
  {
    keywords: ['menopausa', 'vampate', 'equilibrio femminile', 'benessere femminile', 'notte', 'giorno'],
    productMatch: ['menopausa complex', 'menopausa-complex'],
    needLabel: 'menopausa e benessere femminile',
  },
  {
    keywords: ['microcircolo', 'gambe pesanti', 'gambe leggere', 'circolazione', 'drenaggio', 'diosmina', 'periferiche'],
    productMatch: ['microcircolo superior', 'microcircolo-superior'],
    needLabel: 'microcircolo, gambe pesanti e drenaggio',
  },
  {
    keywords: ['capelli', 'pelle', 'unghie', 'beauty', 'chioma', 'fragili'],
    productMatch: ['capelli pelle unghie', 'capelli-pelle-unghie'],
    needLabel: 'capelli, pelle e unghie',
  },
  {
    keywords: ['energia', 'stanchezza', 'vitamine', 'minerali', 'multivitaminico', 'concentrazione', 'stress'],
    productMatch: ['multivitaminico', 'multivitaminico minerali', 'multivitaminico-minerali'],
    needLabel: 'energia, vitamine e minerali',
  },
]

let knowledgeCache: { expiresAt: number; entries: KnowledgeEntry[] } | null = null

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages = sanitizeMessages(body?.messages)
    if (messages.length === 0) {
      return NextResponse.json({ ok: false, message: 'Scrivi una domanda per iniziare.' }, { status: 400 })
    }

    const entries = await buildKnowledgeBase()
    const message = await buildSmartReply(messages, entries)

    return NextResponse.json({ ok: true, message })
  } catch (error) {
    console.error('smart chat failed', error)
    return NextResponse.json({
      ok: true,
      message:
        'Posso aiutarti con prodotti, spedizioni, pagamenti, resi, ordini, newsletter, articoli e contatti 08 Natural Technology. Per assistenza diretta puoi scrivere a 08naturaltechnology@gmail.com o su WhatsApp al 351 507 8701.',
    })
  }
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []
  return input
    .slice(-MAX_MESSAGE_HISTORY)
    .map((item): ChatMessage => ({
      role: item?.role === 'assistant' ? 'assistant' : 'user',
      content: String(item?.content ?? '').slice(0, 900),
    }))
    .filter((item) => item.content.trim())
}

async function buildKnowledgeBase(): Promise<KnowledgeEntry[]> {
  if (knowledgeCache && knowledgeCache.expiresAt > Date.now()) {
    return knowledgeCache.entries
  }

  const baseEntries: Omit<KnowledgeEntry, 'searchable'>[] = [
    {
      kind: 'base',
      title: 'Brand e contatti',
      body: '08 Natural Technology e un brand Made in Italy di integratori alimentari. Contatti: email 08naturaltechnology@gmail.com, telefono 080 303 1103, WhatsApp 351 507 8701.',
      url: '/contatti',
      tags: ['brand', 'azienda', 'contatti', 'email', 'telefono', 'whatsapp', 'assistenza'],
    },
    {
      kind: 'base',
      title: 'Spedizioni e corrieri',
      body: 'La spedizione e gratuita da 39,90 euro. I corrieri indicati sul sito sono GLS, BRT, SDA e Poste Italiane. Al checkout possono essere disponibili consegna a domicilio e punti di ritiro.',
      url: '/resi-e-spedizioni',
      tags: ['spedizione', 'corriere', 'gls', 'brt', 'sda', 'poste', 'ritiro', 'gratis', 'tracking'],
    },
    {
      kind: 'base',
      title: 'Pagamenti',
      body: 'I pagamenti previsti sul sito sono carta di credito, Visa, Mastercard, PayPal, Google Pay, Apple Pay, bonifico bancario e contrassegno quando disponibili al checkout.',
      url: '/checkout',
      tags: ['pagamenti', 'carta', 'paypal', 'google pay', 'apple pay', 'bonifico', 'contrassegno', 'stripe'],
    },
    {
      kind: 'base',
      title: 'Resi e rimborsi',
      body: 'Per resi, recesso e rimborsi puoi consultare la pagina Resi e spedizioni. Per una gestione operativa conviene indicare numero ordine ed email usata in acquisto.',
      url: '/resi-e-spedizioni',
      tags: ['resi', 'rimborso', 'recesso', 'ordine', 'assistenza'],
    },
    {
      kind: 'base',
      title: 'Newsletter',
      body: 'Iscrivendoti alla newsletter ricevi il codice BENVENUTO5 per un extra sconto del 5%, quando attivo sul sito.',
      url: '/',
      tags: ['newsletter', 'sconto', 'codice', 'coupon', '5'],
    },
    {
      kind: 'base',
      title: 'Avvertenze generali',
      body: 'Gli integratori non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano. In caso di gravidanza, allattamento, terapie in corso o condizioni particolari e corretto sentire un professionista sanitario.',
      url: '/note-legali',
      tags: ['avvertenze', 'integratori', 'terapie', 'farmaci', 'gravidanza', 'allattamento', 'medico'],
    },
    {
      kind: 'base',
      title: 'Ordini e area cliente',
      body: 'Per controllare un ordine in modo preciso conviene avere numero ordine ed email usata in acquisto. Gli stati principali sono in attesa, pagato, spedito, consegnato e annullato.',
      url: '/account',
      tags: ['ordine', 'stato ordine', 'tracking', 'spedito', 'consegnato', 'account', 'login'],
    },
  ]

  try {
    const [products, articles] = await Promise.all([getProducts(), getArticles()])

    const productEntries: Omit<KnowledgeEntry, 'searchable'>[] = products.map((product) => ({
      kind: 'product',
      title: product.name,
      body: [
        `Linea: ${product.line.name}.`,
        `Descrizione: ${product.shortDescription}.`,
        `Formato: ${product.format ?? `${product.capsules ?? ''} capsule`}.`,
        `Uso: ${product.usage ?? 'seguire le indicazioni riportate in etichetta'}.`,
        `Notifica Ministero: ${product.notificationMs ?? 'non indicata'}.`,
      ].join(' '),
      url: `/prodotti/${product.slug}`,
      tags: [product.name, product.slug, product.line.name, product.shortDescription],
      meta: {
        shortDescription: product.shortDescription,
        usage: product.usage ?? undefined,
        format: product.format ?? (product.capsules ? `${product.capsules} capsule` : undefined),
        price: product.price,
        comparePrice: product.comparePrice ?? null,
      },
    }))

    const articleEntries: Omit<KnowledgeEntry, 'searchable'>[] = articles.map((article) => ({
      kind: 'article',
      title: article.title,
      body: `${article.excerpt}. ${String(article.body ?? '').slice(0, 300)}`,
      url: `/blog/${article.slug}`,
      tags: [article.tag, article.slug, article.title, article.excerpt],
    }))

    const entries = withSearchableFields([...baseEntries, ...productEntries, ...articleEntries])
    knowledgeCache = { entries, expiresAt: Date.now() + KNOWLEDGE_CACHE_TTL_MS }
    return entries
  } catch {
    const entries = withSearchableFields(baseEntries)
    knowledgeCache = { entries, expiresAt: Date.now() + KNOWLEDGE_CACHE_TTL_MS }
    return entries
  }
}

function withSearchableFields(entries: Omit<KnowledgeEntry, 'searchable'>[]): KnowledgeEntry[] {
  return entries.map((entry) => ({
    ...entry,
    searchable: normalizeForSearch([entry.title, entry.body, ...(entry.tags ?? [])].join(' ')),
  }))
}

async function buildSmartReply(messages: ChatMessage[], entries: KnowledgeEntry[]) {
  const userMessages = messages.filter((message) => message.role === 'user')
  const latestQuestion = userMessages.at(-1)?.content ?? ''
  const previousConversationText = userMessages.slice(0, -1).map((message) => message.content).join(' ')
  const conversationText = userMessages.map((message) => message.content).join(' ')
  const normalizedConversation = normalizeForSearch(conversationText)
  const normalizedLatestQuestion = normalizeForSearch(latestQuestion)
  const normalizedPreviousConversation = normalizeForSearch(previousConversationText)

  const orderLookup = await lookupOrderFromConversation(messages)
  if (orderLookup.kind !== 'not-order-question') {
    return buildOrderReply(orderLookup)
  }

  const sections: string[] = []

  if (isGreetingOnly(normalizedLatestQuestion)) {
    sections.push(
      'Ciao, sono qui per aiutarti con prodotti, ordini, spedizioni, pagamenti, resi, articoli del blog e contatti.'
    )
  }

  const currentProductContext =
    resolveProductContext(normalizedLatestQuestion, entries)
    ?? resolveProductContext(normalizedPreviousConversation, entries)

  if (currentProductContext && isProductFollowUp(normalizedLatestQuestion)) {
    return buildProductFollowUpReply(currentProductContext, normalizedLatestQuestion)
  }

  const recommendationReply = buildRecommendationReply(normalizedLatestQuestion, entries)
  if (recommendationReply) {
    sections.push(recommendationReply)
  }

  const informationalReply = buildInformationalReply(normalizedConversation, entries, Boolean(recommendationReply))
  if (informationalReply) {
    sections.push(informationalReply)
  }

  const articleReply = buildArticleReply(normalizedConversation, entries)
  if (articleReply) {
    sections.push(articleReply)
  }

  if (sections.length === 0) {
    const relevant = selectRelevantEntries(entries, latestQuestion || conversationText)
    if (relevant.length > 0) {
      sections.push(
        relevant
          .slice(0, 2)
          .map((entry) => summarizeKnowledgeEntry(entry))
          .join(' ')
      )
    }
  }

  if (sections.length === 0) {
    sections.push(
      'Posso aiutarti con scelta prodotti, utilizzo, ordini, spedizioni, pagamenti, resi, newsletter, blog e contatti.'
    )
  }

  if (!recommendationReply) {
    sections.push(DIRECT_SUPPORT)
  }
  return joinSections(sections)
}

async function lookupOrderFromConversation(messages: ChatMessage[]): Promise<OrderLookupResult> {
  const userText = messages
    .filter((message) => message.role === 'user')
    .map((message) => message.content)
    .join(' ')

  const normalized = normalizeForSearch(userText)
  if (!isOrderIntent(normalized)) {
    return { kind: 'not-order-question' }
  }

  const email = extractEmail(userText)
  const orderRef = extractOrderReference(userText)
  const missing: string[] = []

  if (!orderRef) missing.push('numero ordine')
  if (!email) missing.push('email usata in acquisto')
  if (missing.length > 0) {
    return { kind: 'missing-data', missing }
  }

  const safeEmail = email!
  const safeOrderRef = orderRef!

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { guestEmail: { equals: safeEmail, mode: 'insensitive' } },
        { user: { is: { email: { equals: safeEmail, mode: 'insensitive' } } } },
      ],
    },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      total: true,
      createdAt: true,
      deliveryType: true,
      pickupCarrier: true,
      pickupPointCode: true,
      pickupPointAddress: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 12,
  })

  const addresses = await prisma.orderAddress.findMany({
    where: { orderId: { in: orders.map((order) => order.id) } },
    select: {
      orderId: true,
      city: true,
      postalCode: true,
      province: true,
    },
  })
  const addressMap = new Map(addresses.map((address) => [address.orderId, address]))

  const normalizedOrderRef = safeOrderRef.replace(/^#/, '').trim().toUpperCase()
  const matchedOrder = orders.find((order) => order.id.toUpperCase() === normalizedOrderRef)
    ?? orders.find((order) => order.id.slice(-normalizedOrderRef.length).toUpperCase() === normalizedOrderRef)
    ?? orders.find((order) => order.id.slice(-8).toUpperCase() === normalizedOrderRef)

  if (!matchedOrder) {
    return { kind: 'not-found', orderRef: normalizedOrderRef, email: safeEmail }
  }

  return {
    kind: 'found',
    orderRef: normalizedOrderRef,
    email: safeEmail,
    order: {
      ...matchedOrder,
      shippingAddress: addressMap.get(matchedOrder.id) ?? null,
    },
  }
}

function buildOrderReply(result: OrderLookupResult) {
  if (result.kind === 'missing-data') {
    return joinSections([
      `Posso controllare in modo preciso lo stato del tuo ordine, ma mi servono ${result.missing.join(' e ')}.`,
      'Scrivimi in un unico messaggio, ad esempio: "Numero ordine #ABCD1234, email nome@email.it".',
      DIRECT_SUPPORT,
    ])
  }

  if (result.kind === 'not-found') {
    return joinSections([
      `Non ho trovato un ordine associato al riferimento ${result.orderRef} con l email ${result.email}.`,
      'Controlla che il numero ordine e l email siano esatti. Se vuoi, puoi inviarmeli di nuovo nello stesso messaggio e riprovo subito.',
      DIRECT_SUPPORT,
    ])
  }

  if (result.kind === 'found') {
    const { order } = result
    const statusLabel = mapOrderStatus(order.status)
    const paymentLabel = mapPaymentMethod(order.paymentMethod)
    const orderCode = order.id.slice(-8).toUpperCase()
    const location = order.shippingAddress
      ? [order.shippingAddress.postalCode, order.shippingAddress.city, order.shippingAddress.province]
          .filter(Boolean)
          .join(' ')
      : null

    const parts = [
      `Ho trovato l ordine #${orderCode}.`,
      `Stato attuale: ${statusLabel}.`,
      `Pagamento: ${paymentLabel}.`,
      `Totale ordine: ${formatEuro(order.total)}.`,
    ]

    if (order.deliveryType === 'pickup' && order.pickupPointAddress) {
      parts.push(
        `Ritiro selezionato: ${pickupCarrierLabel(order.pickupCarrier)}${order.pickupPointCode ? ` (${order.pickupPointCode})` : ''}, ${order.pickupPointAddress}.`
      )
    } else if (location) {
      parts.push(`Destinazione spedizione: ${location}.`)
    }

    if (order.status === 'shipped') {
      parts.push(
        'L ordine risulta spedito. Se il tracking non e ancora visibile qui in chat, potrebbe essere stato inviato via email o attivarsi qualche ora dopo l affidamento al corriere.'
      )
    } else if (order.status === 'paid') {
      parts.push('Il pagamento risulta confermato e l ordine e in preparazione.')
    } else if (order.status === 'pending') {
      parts.push('L ordine e stato ricevuto ed e in attesa di lavorazione o conferma pagamento, in base al metodo scelto.')
    } else if (order.status === 'delivered') {
      parts.push('L ordine risulta consegnato.')
    } else if (order.status === 'cancelled') {
      parts.push('L ordine risulta annullato.')
    }

    parts.push(DIRECT_SUPPORT)
    return joinSections(parts)
  }

  return joinSections([
    'Posso aiutarti a verificare lo stato del tuo ordine.',
    'Inviami numero ordine ed email usata in acquisto.',
    DIRECT_SUPPORT,
  ])
}

function buildRecommendationReply(normalizedLatestQuestion: string, entries: KnowledgeEntry[]) {
  const matchedRules = PRODUCT_RULES.filter((rule) =>
    rule.keywords.some((keyword) => normalizedLatestQuestion.includes(normalizeForSearch(keyword)))
  )

  if (matchedRules.length === 0) return ''

  const recommendations = matchedRules
    .slice(0, 2)
    .map((rule) => {
      const match = entries.find(
        (entry) =>
          entry.kind === 'product'
          && rule.productMatch.some((token) => entry.searchable.includes(normalizeForSearch(token)))
      )
      if (!match) return `Le consigliamo un prodotto della linea piu adatta per ${rule.needLabel}.`
      return formatRecommendedProduct(match, rule.needLabel)
    })

  const compareHint =
    matchedRules.length > 1
      ? 'Se le esigenze sono piu di una, posso anche aiutarla a capire da quale prodotto partire o come confrontarli.'
      : ''

  const followUps = buildFollowUpPrompt(normalizedLatestQuestion, matchedRules.length > 1)
  return joinSections([...recommendations, compareHint, followUps].filter(Boolean))
}

function resolveProductContext(normalizedText: string, entries: KnowledgeEntry[]): ProductContext | null {
  if (!normalizedText) return null

  for (const rule of PRODUCT_RULES) {
    const matched = rule.keywords.some((keyword) => normalizedText.includes(normalizeForSearch(keyword)))
    if (!matched) continue

    const entry = entries.find(
      (candidate) =>
        candidate.kind === 'product'
        && rule.productMatch.some((token) => candidate.searchable.includes(normalizeForSearch(token)))
    )

    if (entry) {
      return { entry, needLabel: rule.needLabel }
    }
  }

  return null
}

function isProductFollowUp(normalizedLatestQuestion: string) {
  return /(come si assume|come assumer|assunzione|quando si assume|quando assumer|quanto costa|prezzo|costo|per quanto tempo|quanto tempo|beneficio|a cosa serve|formato)/.test(
    normalizedLatestQuestion
  )
}

function buildProductFollowUpReply(context: ProductContext, normalizedLatestQuestion: string) {
  const { entry, needLabel } = context
  const parts: string[] = []
  const usage = shortenSentence(entry.meta?.usage ?? extractField(entry.body, 'Uso'))
  const price = entry.meta?.price
  const comparePrice = entry.meta?.comparePrice
  const format = shortenSentence(entry.meta?.format ?? extractField(entry.body, 'Formato'))
  const description = shortenSentence(entry.meta?.shortDescription ?? extractField(entry.body, 'Descrizione'))

  if (/(a cosa serve|beneficio|utile|indicato)/.test(normalizedLatestQuestion)) {
    parts.push(` ${entry.title} e indicato soprattutto per ${needLabel}. ${description}.`.trim())
  }

  if (/(come si assume|come assumer|assunzione|quando si assume|quando assumer)/.test(normalizedLatestQuestion)) {
    parts.push(usage ? `${entry.title} si assume cosi: ${usage}.` : `Posso indicarle la modalita di utilizzo di ${entry.title}.`)
  }

  if (/(quanto costa|prezzo|costo)/.test(normalizedLatestQuestion)) {
    if (typeof price === 'number') {
      parts.push(
        comparePrice && comparePrice > price
          ? `Il prezzo attuale di ${entry.title} e ${formatEuro(price)} invece di ${formatEuro(comparePrice)}.`
          : `Il prezzo di ${entry.title} e ${formatEuro(price)}.`
      )
    } else {
      parts.push(`Posso aiutarla a trovare il prezzo aggiornato di ${entry.title} direttamente nella scheda prodotto.`)
    }
  }

  if (/(per quanto tempo|quanto tempo)/.test(normalizedLatestQuestion)) {
    parts.push(
      format
        ? `Il formato attuale di ${entry.title} e ${format}. In base al dosaggio consigliato, la durata pratica dipende dall utilizzo indicato in etichetta.`
        : `Per la durata d uso di ${entry.title}, conviene seguire il dosaggio indicato in etichetta.`
    )
  }

  if (/(formato)/.test(normalizedLatestQuestion) && format) {
    parts.push(`Il formato di ${entry.title} e ${format}.`)
  }

  if (parts.length === 0) {
    parts.push(formatRecommendedProduct(entry, needLabel))
  }

  parts.push(buildFocusedFollowUpPrompt(normalizedLatestQuestion))
  return joinSections(parts)
}

function buildInformationalReply(normalizedConversation: string, entries: KnowledgeEntry[], hasRecommendation: boolean) {
  if (hasRecommendation) return ''

  const parts: string[] = []

  if (/(pagament|paypal|carta|visa|mastercard|google pay|apple pay|bonifico|contrassegno|stripe)/.test(normalizedConversation)) {
    parts.push(
      'Accettiamo pagamenti online sicuri con carta, Visa, Mastercard, PayPal, Google Pay e Apple Pay, oltre a bonifico bancario e contrassegno quando disponibili al checkout.'
    )
  }

  if (/(spedizion|corrier|gls|brt|sda|gratuit|consegna|ritiro|poste|fermo point|fermopoint|locker|tracking)/.test(normalizedConversation)) {
    parts.push(
      'La spedizione e gratuita da 39,90 euro. I corrieri indicati sul sito sono GLS, BRT, SDA e Poste Italiane. In base all indirizzo puoi trovare consegna a domicilio o punti di ritiro direttamente al checkout.'
    )
  }

  if (/(reso|resi|rimborso|recesso|restituzione)/.test(normalizedConversation)) {
    parts.push(
      'Per resi, recesso e rimborsi puoi consultare la pagina Resi e spedizioni. Se vuoi assistenza operativa, prepara numero ordine ed email usata in acquisto.'
    )
  }

  if (/(newsletter|sconto|codice|coupon|5 per cento|5%)/.test(normalizedConversation)) {
    parts.push(
      'Iscrivendoti alla newsletter puoi ricevere il codice BENVENUTO5 per un extra sconto del 5%, quando la promozione e attiva.'
    )
  }

  if (/(contatt|email|telefono|whatsapp|assistenza|orari|indirizzo)/.test(normalizedConversation)) {
    parts.push(
      'Puoi contattare 08 Natural Technology via email a 08naturaltechnology@gmail.com, telefono 080 303 1103 oppure WhatsApp al 351 507 8701.'
    )
  }

  if (/(gravid|allatt|farmac|terapi|controindic|allerg|intolleranz)/.test(normalizedConversation)) {
    parts.push(
      'Per gravidanza, allattamento, terapie in corso, allergie o esigenze personali particolari, e corretto valutare sempre etichetta, ingredienti e parere del proprio professionista sanitario.'
    )
  }

  if (/(ministero|registrat|notificat|made in italy|italia)/.test(normalizedConversation)) {
    parts.push(
      'Sul sito e indicato che i prodotti sono registrati o notificati dove previsto nelle singole schede e che il progetto valorizza una produzione Made in Italy.'
    )
  }

  if (/(login|account|password|registraz|profilo)/.test(normalizedConversation)) {
    parts.push(
      'Se hai bisogno di entrare nell area cliente, recuperare password o controllare ordini, posso guidarti passo per passo oppure puoi usare direttamente l area account del sito.'
    )
  }

  if (/(fattura|fattur|partita iva|codice fiscale|pec|sdi)/.test(normalizedConversation)) {
    parts.push(
      'Per dati fiscali, fattura o richieste amministrative conviene indicare la richiesta completa in checkout o scrivere a 08naturaltechnology@gmail.com con i dati dell ordine.'
    )
  }

  if (parts.length > 0) {
    if (!hasRecommendation) parts.push(DIRECT_SUPPORT)
    return joinSections(parts)
  }

  const topBase = selectRelevantEntries(
    entries.filter((entry) => entry.kind === 'base'),
    normalizedConversation
  )
  if (topBase.length === 0) return ''

  return topBase
    .slice(0, 2)
    .map((entry) => summarizeKnowledgeEntry(entry))
    .join(' ')
}

function buildArticleReply(normalizedConversation: string, entries: KnowledgeEntry[]) {
  if (!/(blog|articol|approfond|ingredien|diosmina|ricerca|benessere|microcircolo|capelli|menopausa|vitamin)/.test(normalizedConversation)) {
    return ''
  }

  const articles = selectRelevantEntries(
    entries.filter((entry) => entry.kind === 'article'),
    normalizedConversation
  ).slice(0, 3)

  if (articles.length === 0) return ''

  return articles
    .map((article) => `Per approfondire puoi leggere "${article.title}"${article.url ? ` (${article.url})` : ''}.`)
    .join(' ')
}

function selectRelevantEntries(entries: KnowledgeEntry[], question: string) {
  const normalizedQuestion = normalizeForSearch(question)
  const tokens = Array.from(new Set(normalizedQuestion.split(/\s+/).filter((token) => token.length > 2)))

  return entries
    .map((entry) => ({
      entry,
      score: tokens.reduce((total, token) => total + scoreTokenMatch(entry.searchable, token), 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_ENTRIES)
    .map((item) => item.entry)
}

function scoreTokenMatch(haystack: string, token: string) {
  if (!token) return 0
  let score = 0
  if (haystack.includes(` ${token} `)) score += 3
  else if (haystack.includes(token)) score += 1
  return score
}

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9@\s._#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractEmail(value: string) {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return match?.[0]?.toLowerCase() ?? null
}

function extractOrderReference(value: string) {
  const explicitRef = value.match(/#([A-Z0-9-]{6,36})/i)?.[1]
  if (explicitRef) return explicitRef

  const longToken = value.match(/\b([A-Z0-9-]{8,36})\b/i)?.[1]
  if (longToken && !longToken.includes('@')) return longToken

  return null
}

function isGreetingOnly(value: string) {
  return /^(ciao|buongiorno|salve|hello|hi|hey)\b/.test(value) && value.split(' ').length <= 4
}

function isOrderIntent(value: string) {
  return /(ordine|ordini|spedizione|tracking|dov e il mio ordine|stato ordine|dov e la mia spedizione|consegnato|spedito)/.test(value)
}

function mapOrderStatus(status: string) {
  const normalized = normalizeForSearch(status)
  if (normalized === 'pending') return 'in attesa'
  if (normalized === 'paid') return 'pagato'
  if (normalized === 'shipped') return 'spedito'
  if (normalized === 'delivered') return 'consegnato'
  if (normalized === 'cancelled') return 'annullato'
  return status
}

function mapPaymentMethod(method: string) {
  const normalized = normalizeForSearch(method)
  if (normalized === 'stripe') return 'carta, PayPal, Google Pay o Apple Pay'
  if (normalized === 'bonifico') return 'bonifico bancario'
  if (normalized === 'contrassegno') return 'contrassegno'
  return method
}

function pickupCarrierLabel(carrier: string | null) {
  if (carrier === 'BRT') return 'BRT Fermopoint'
  if (carrier === 'POSTE') return 'Poste Italiane'
  return carrier || 'punto di ritiro'
}

function formatEuro(value: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value || 0))
}

function formatRecommendedProduct(entry: KnowledgeEntry, needLabel: string) {
  const description = summarizeProductBenefit(entry.meta?.shortDescription ?? extractField(entry.body, 'Descrizione'))

  const sentences = [
    `Le consigliamo ${entry.title}, utile per ${needLabel}.`,
    description || '',
  ].filter(Boolean)

  return sentences.join(' ')
}

function extractField(body: string, label: string) {
  const match = body.match(new RegExp(`${label}:\\s*([^.]*(?:\\.[^A-Z]|$)*[^.]*)`, 'i'))
  return match?.[1]?.trim() ?? ''
}

function shortenSentence(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/^08 Natural Technology\s+/i, '')
    .replace(/\.$/, '')
    .replace(/\s+\.\s*$/, '.')
    .trim()
}

function summarizeProductBenefit(value: string) {
  const clean = shortenSentence(value)
  const sentences = clean
    .split('.')
    .map((sentence) => sentence.trim())
    .filter(Boolean)

  const benefitSentence = sentences.find((sentence) =>
    /(support|benesser|funzionalit|equilibr|aiut|indicat)/i.test(sentence)
  )

  return (benefitSentence ?? sentences.at(-1) ?? clean).replace(/\.$/, '') + '.'
}

function summarizeKnowledgeEntry(entry: KnowledgeEntry) {
  if (entry.kind === 'product') {
    return `${entry.title}: ${extractField(entry.body, 'Descrizione') || shortenSentence(entry.body)}`
  }
  if (entry.kind === 'article') {
    return `Puoi approfondire con "${entry.title}"${entry.url ? ` (${entry.url})` : ''}.`
  }
  return `${entry.title}: ${shortenSentence(entry.body)}`
}

function buildFollowUpPrompt(normalizedLatestQuestion: string, isComparisonCase: boolean) {
  const suggestions = new Set<string>()

  if (/(gamb|microcircolo|drenagg|circolaz)/.test(normalizedLatestQuestion)) {
    suggestions.add('Può chiedermi anche: "E meglio per gambe pesanti o per microcircolo?"')
    suggestions.add('Oppure: "Come si assume?"')
  }

  if (/(menopaus|vampat|femminil)/.test(normalizedLatestQuestion)) {
    suggestions.add('Può chiedermi anche: "E adatto piu per giorno o per notte?"')
    suggestions.add('Oppure: "Qual e il beneficio principale?"')
  }

  if (/(capell|pelle|unghi)/.test(normalizedLatestQuestion)) {
    suggestions.add('Può chiedermi anche: "E piu indicato per capelli o unghie fragili?"')
  }

  if (/(energi|stanchezz|vitamin|mineral)/.test(normalizedLatestQuestion)) {
    suggestions.add('Può chiedermi anche: "E piu indicato per stanchezza o per integrazione quotidiana?"')
  }

  if (suggestions.size === 0) {
    FOLLOW_UP_HINTS.slice(0, isComparisonCase ? 3 : 2).forEach((hint) => suggestions.add(hint))
  }

  return Array.from(suggestions).join(' ')
}

function buildFocusedFollowUpPrompt(normalizedLatestQuestion: string) {
  if (/(come si assume|assunzione|quando si assume)/.test(normalizedLatestQuestion) && /(prezzo|costo|quanto costa)/.test(normalizedLatestQuestion)) {
    return 'Se vuole, posso aiutarla anche a capire se e piu adatto per drenaggio o microcircolo.'
  }
  if (/(prezzo|costo|quanto costa)/.test(normalizedLatestQuestion)) {
    return 'Se vuole, posso dirle anche come si assume oppure se e piu adatto per drenaggio o microcircolo.'
  }
  if (/(come si assume|assunzione|quando si assume)/.test(normalizedLatestQuestion)) {
    return 'Se vuole, posso dirle anche quanto costa oppure aiutarla a capire se e la scelta piu adatta per il suo caso.'
  }
  if (/(beneficio|a cosa serve|utile)/.test(normalizedLatestQuestion)) {
    return 'Se vuole, posso dirle anche come si assume o quanto costa.'
  }
  return 'Se vuole, posso dirle anche come si assume, quanto costa oppure aiutarla a capire se e la scelta piu adatta.'
}

function joinSections(parts: string[]) {
  return parts
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part, index, all) => all.findIndex((item) => normalizeForSearch(item) === normalizeForSearch(part)) === index)
    .join('\n\n')
}
