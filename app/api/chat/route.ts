import { NextResponse } from 'next/server'
import { getProducts } from '@/services/products'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const CHAT_MODELS = ['gpt-5.2-chat-latest', 'gpt-5.2', 'gpt-4.1-mini']

export async function POST(request: Request) {
  let fallbackQuestion = ''
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: 'La live chat non e ancora configurata.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const messages = sanitizeMessages(body?.messages)
    if (messages.length === 0) {
      return NextResponse.json({ ok: false, message: 'Scrivi una domanda per iniziare.' }, { status: 400 })
    }
    fallbackQuestion = messages.at(-1)?.content ?? ''

    const context = await buildSiteContext()
    const instructions =
      'Sei l assistente clienti di 08 Natural Technology. Rispondi in italiano, in modo chiaro e sintetico. Usa solo le informazioni del contesto sito quando parli di prodotti, spedizioni, pagamenti, resi e contatti. Non fare diagnosi, non promettere risultati medici e invita a sentire un professionista sanitario per condizioni personali, gravidanza, allattamento, terapie o patologie. Contesto sito:\n' +
      context

    let lastError: unknown = null

    for (const model of getModelCandidates()) {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          instructions,
          input: messages,
          max_output_tokens: 500,
        }),
        signal: AbortSignal.timeout(30000),
      })

      const data = await safeJson(response)
      if (response.ok) {
        return NextResponse.json({ ok: true, message: extractOutputText(data) })
      }

      lastError = data
      if (!shouldTryNextModel(response.status, data)) break
    }

    console.error('chat response failed', sanitizeOpenAIError(lastError))
    return NextResponse.json({ ok: true, message: buildFallbackAnswer(messages.at(-1)?.content ?? '') })
  } catch (error) {
    console.error('chat failed', error)
    return NextResponse.json({ ok: true, message: buildFallbackAnswer(fallbackQuestion) })
  }
}

function getModelCandidates() {
  const preferred = process.env.OPENAI_MODEL?.trim()
  return Array.from(new Set([preferred, ...CHAT_MODELS].filter(Boolean))) as string[]
}

async function safeJson(response: Response) {
  try {
    return await response.json()
  } catch {
    return { error: { message: response.statusText } }
  }
}

function shouldTryNextModel(status: number, data: any) {
  const code = String(data?.error?.code ?? '').toLowerCase()
  const message = String(data?.error?.message ?? '').toLowerCase()
  return status === 400 || status === 404 || code.includes('model') || message.includes('model')
}

function sanitizeOpenAIError(error: unknown) {
  const value = error as { error?: { code?: string; message?: string; type?: string } }
  return {
    code: value?.error?.code,
    type: value?.error?.type,
    message: value?.error?.message,
  }
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []
  return input
    .slice(-8)
    .map((item): ChatMessage => {
      const role: ChatMessage['role'] = item?.role === 'assistant' ? 'assistant' : 'user'
      return {
        role,
        content: String(item?.content ?? '').slice(0, 1200),
      }
    })
    .filter((item) => item.content.trim())
}

function buildFallbackAnswer(question: string) {
  const text = question.toLowerCase()

  if (/(pagament|pay|paypal|carta|visa|mastercard|google|apple|bonifico|contrassegno)/.test(text)) {
    return 'Accettiamo pagamenti online sicuri con carta, Visa, Mastercard, PayPal, Google Pay e Apple Pay, oltre a bonifico bancario e contrassegno quando disponibili al checkout.'
  }

  if (/(spedizion|corrier|gls|brt|sda|gratis|gratuita|consegna|ritiro|poste)/.test(text)) {
    return 'La spedizione e gratuita da 39,90 euro. I corrieri indicati sul sito sono GLS, BRT e SDA. Al checkout puoi scegliere la consegna disponibile per il tuo indirizzo.'
  }

  if (/(reso|resi|rimborso|recesso|restituzione)/.test(text)) {
    return 'Per resi, recesso e rimborsi puoi consultare la pagina Resi e Spedizioni. In caso di dubbi scrivici a 08naturaltechnology@gmail.com indicando il numero ordine.'
  }

  if (/(contatt|email|telefono|whatsapp|assistenza)/.test(text)) {
    return 'Puoi contattare 08 Natural Technology via email a 08naturaltechnology@gmail.com, telefono 080 303 1103 oppure WhatsApp al 351 507 8701.'
  }

  if (/(newsletter|sconto|codice|coupon|5)/.test(text)) {
    return 'Iscrivendoti alla newsletter ricevi il codice BENVENUTO5 per un extra sconto del 5%, da inserire nel campo codice sconto al checkout.'
  }

  if (/(prodot|menopausa|microcircolo|capelli|pelle|unghie|multivitaminico|minerali|integrator)/.test(text)) {
    return 'Nel catalogo 08 Natural Technology trovi Menopausa Complex, Microcircolo Superior, Capelli Pelle & Unghie e Multivitaminico & Minerali. Gli integratori non sostituiscono una dieta varia ed equilibrata e, per situazioni personali o terapie, e sempre corretto sentire un professionista sanitario.'
  }

  return 'Posso aiutarti con prodotti, pagamenti, spedizioni, resi, newsletter e contatti 08 Natural Technology. Per assistenza diretta puoi scrivere a 08naturaltechnology@gmail.com o su WhatsApp al 351 507 8701.'
}

async function buildSiteContext() {
  const staticContext = [
    'Brand: 08 Natural Technology, integratori alimentari Made in Italy di VIPHARMA di Tatulli Vito & Co. S.A.S., Bitonto (BA).',
    'Email principale e servizio clienti: 08naturaltechnology@gmail.com. Telefono: 080 303 1103. WhatsApp: 351 507 8701.',
    'Spedizione gratuita da 39,90 euro. Corrieri indicati: GLS, BRT, Poste Italiane.',
    'Pagamenti indicati: carta di credito, Visa, Mastercard, PayPal, Google Pay, Apple Pay, contrassegno e bonifico bancario.',
    'Pagine utili: Prodotti & Shop /prodotti, Qualita 08 /metodo, Blog /blog, Contatti /contatti, Resi e spedizioni /resi-e-spedizioni, Termini e condizioni /termini-condizioni-vendita.',
    'Avvertenza: gli integratori non sostituiscono una dieta varia ed equilibrata e uno stile di vita sano.',
  ]

  try {
    const products = await getProducts()
    const productContext = products.map((product) =>
      `Prodotto: ${product.name}. Linea: ${product.line.name}. Descrizione: ${product.shortDescription}. Formato: ${product.format ?? `${product.capsules ?? ''} capsule`}. Uso: ${product.usage ?? 'seguire etichetta'}. Notifica Ministero: ${product.notificationMs ?? 'non indicata'}.`
    )
    return [...staticContext, ...productContext].join('\n')
  } catch {
    return staticContext.join('\n')
  }
}

function extractOutputText(data: any): string {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) return data.output_text
  const text = data?.output
    ?.flatMap((item: any) => item?.content ?? [])
    ?.map((content: any) => content?.text ?? '')
    ?.filter(Boolean)
    ?.join('\n')
  return text || 'Non ho trovato una risposta utile. Puoi riformulare la domanda?'
}
