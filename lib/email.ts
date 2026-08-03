import nodemailer from 'nodemailer'
import { getSettingsMap } from '@/lib/settings'

const BRAND_GREEN = '#1a4a2e'
const BRAND_LIGHT = '#f0f7f2'
const DEFAULT_EMAIL = '08naturaltechnology@gmail.com'
const DEFAULT_FROM_NAME = '08 Natural Technology'
const SITE_URL =
  process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://08naturaltechnology.it'

type MailMessage = Parameters<nodemailer.Transporter['sendMail']>[0]

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  replyTo: string
}

function resolveSmtpConfig(): SmtpConfig {
  const user = process.env.SMTP_USER?.trim() ?? ''
  const pass = process.env.SMTP_PASS?.trim() ?? ''

  if (!user || !pass) {
    throw new Error(
      'SMTP non configurato: imposta SMTP_USER e SMTP_PASS nel file .env.local o nel provider hosting.'
    )
  }

  const port = Number(process.env.SMTP_PORT ?? '465')

  return {
    host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
    port,
    secure: parseBoolean(process.env.SMTP_SECURE, port === 465),
    user,
    pass,
    replyTo: process.env.EMAIL_REPLY_TO?.trim() || DEFAULT_EMAIL,
  }
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value == null || value.trim() === '') return fallback
  return ['1', 'true', 'yes', 'si'].includes(value.trim().toLowerCase())
}

function buildFrom(name = DEFAULT_FROM_NAME) {
  const configured = process.env.EMAIL_FROM?.trim()
  if (configured) {
    return configured.includes('<') ? configured : `"${name}" <${configured}>`
  }

  const user = process.env.SMTP_USER?.trim() || DEFAULT_EMAIL
  return `"${name}" <${user}>`
}

function createTransport() {
  const config = resolveSmtpConfig()
  const timeout = Number(process.env.SMTP_TIMEOUT_MS ?? '20000')

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: !config.secure,
    connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS ?? timeout),
    greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS ?? timeout),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS ?? timeout),
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatEuro(value: number) {
  return `&euro;${Number(value || 0).toFixed(2)}`
}

function firstName(value: string) {
  return escapeHtml(value.split(' ').filter(Boolean)[0] ?? value)
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>08 Natural Technology</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:2rem 1rem">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
        <tr>
          <td style="background:${BRAND_GREEN};padding:1.5rem 2rem">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <h1 style="margin:0;font-size:1.375rem;font-weight:300;color:white;letter-spacing:0.02em;font-family:Georgia,serif">08 NATURAL TECHNOLOGY</h1>
                </td>
                <td align="right">
                  <p style="margin:0;font-size:0.5625rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.35)">Nutraceutica di qualit&agrave;</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:white;padding:2rem">${content}</td>
        </tr>
        <tr>
          <td style="padding:1.25rem 2rem;background:#f9f9f7;border-top:1px solid #e8e8e4">
            <p style="margin:0;font-size:0.6875rem;color:#9ca3af;line-height:1.6;text-align:center">
              08 NATURAL TECHNOLOGY<br>
              Bitonto (BA) &middot; Italy<br>
              <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:underline">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ''))}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function itemsTable(
  items: { name: string; qty: number; unitPrice: number }[],
  total: number,
  discountAmount = 0,
  couponCode?: string | null,
  codSurcharge = 0,
  shippingCost = 0,
  foreignSurcharge = 0
) {
  const rows = items
    .map(
      (item) => `
    <tr>
      <td style="padding:0.5rem 0;font-size:0.875rem;color:#374151;border-bottom:1px solid #f5f5f0">${escapeHtml(item.name)}</td>
      <td style="padding:0.5rem 0;font-size:0.875rem;color:#6b7280;text-align:center;border-bottom:1px solid #f5f5f0">x${escapeHtml(item.qty)}</td>
      <td style="padding:0.5rem 0;font-size:0.875rem;font-weight:500;color:#111827;text-align:right;border-bottom:1px solid #f5f5f0">${formatEuro(item.unitPrice * item.qty)}</td>
    </tr>`
    )
    .join('')

  const discountRow =
    discountAmount > 0
      ? `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#dc2626">Sconto${couponCode ? ` (${escapeHtml(couponCode)})` : ''}</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#dc2626;text-align:right">-${formatEuro(discountAmount)}</td>
    </tr>`
      : ''

  const codRow =
    codSurcharge > 0
      ? `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280">Supplemento contrassegno</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280;text-align:right">+${formatEuro(codSurcharge)}</td>
    </tr>`
      : ''

  // Spedizione e supplemento estero: senza queste righe le voci non sommavano al totale.
  const shippingRow =
    shippingCost > 0
      ? `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280">Spedizione</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280;text-align:right">+${formatEuro(shippingCost)}</td>
    </tr>`
      : `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#16a34a">Spedizione</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#16a34a;text-align:right">Gratuita</td>
    </tr>`

  const foreignRow =
    foreignSurcharge > 0
      ? `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280">Supplemento estero</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280;text-align:right">+${formatEuro(foreignSurcharge)}</td>
    </tr>`
      : ''

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1rem">
      <thead>
        <tr style="background:#f9f9f7">
          <th style="padding:0.5rem 0;font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;text-align:left">Prodotto</th>
          <th style="padding:0.5rem 0;font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;text-align:center">Qt&agrave;</th>
          <th style="padding:0.5rem 0;font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;text-align:right">Prezzo</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        ${discountRow}${shippingRow}${foreignRow}${codRow}
        <tr>
          <td colspan="2" style="padding:0.625rem 0 0;font-size:0.9375rem;font-weight:700;color:${BRAND_GREEN};border-top:2px solid #f0f0ec">Totale</td>
          <td style="padding:0.625rem 0 0;font-size:0.9375rem;font-weight:700;color:${BRAND_GREEN};text-align:right;border-top:2px solid #f0f0ec">${formatEuro(total)}</td>
        </tr>
      </tfoot>
    </table>`
}

function addressBlock(addr: {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  province?: string | null
  country: string
  phone?: string | null
}) {
  const cityLine = [addr.postalCode, addr.city, addr.province]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' ')

  return `
    <div style="background:#f9f9f7;border:1px solid #e8e8e4;padding:0.875rem 1rem;font-size:0.8125rem;color:#374151;line-height:1.7">
      <strong>${escapeHtml(addr.firstName)} ${escapeHtml(addr.lastName)}</strong><br>
      ${escapeHtml(addr.address)}<br>
      ${cityLine}<br>
      ${addr.country !== 'IT' ? `${escapeHtml(addr.country)}<br>` : ''}
      ${addr.phone ? `<span style="color:#9ca3af">${escapeHtml(addr.phone)}</span>` : ''}
    </div>`
}

function cta(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:0.75rem 1.75rem;background:${BRAND_GREEN};color:white;text-decoration:none;font-size:0.6875rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase">${label}</a>`
}

function infoBox(color: string, bg: string, border: string, title: string, body: string) {
  return `
    <div style="background:${bg};border:1px solid ${border};padding:1rem 1.25rem;margin:1.25rem 0">
      <p style="margin:0 0 0.5rem;font-size:0.625rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${color}">${title}</p>
      <p style="margin:0;font-size:0.8125rem;color:#374151;line-height:1.7">${body}</p>
    </div>`
}

export interface OrderData {
  orderId: string
  paymentMethod: string
  total: number
  subtotal: number
  discountAmount: number
  couponCode?: string | null
  codSurcharge: number
  shippingCost?: number
  foreignSurcharge?: number
  customerName: string
  customerEmail: string
  items: { name: string; qty: number; unitPrice: number }[]
  address: {
    firstName: string
    lastName: string
    address: string
    city: string
    postalCode: string
    province?: string | null
    country: string
    phone?: string | null
  }
  deliveryType?: 'home' | 'pickup' | string | null
  pickupCarrier?: 'BRT' | 'POSTE' | string | null
  pickupPointCode?: string | null
  pickupPointAddress?: string | null
  trackingNumber?: string
}

const METHOD_LABEL: Record<string, string> = {
  stripe: 'Carta / PayPal / Google Pay / Apple Pay',
  bonifico: 'Bonifico bancario',
  contrassegno: 'Contrassegno (pagamento alla consegna)',
}

function pickupCarrierLabel(carrier: OrderData['pickupCarrier']) {
  if (carrier === 'BRT') return 'BRT Fermopoint'
  if (carrier === 'POSTE') return 'Poste Italiane'
  return carrier ? String(carrier) : 'Punto di ritiro'
}

function pickupBlock(
  data: Pick<OrderData, 'deliveryType' | 'pickupCarrier' | 'pickupPointCode' | 'pickupPointAddress'>
) {
  if (data.deliveryType !== 'pickup' || !data.pickupPointAddress?.trim()) return ''

  return `
    <div style="background:#fffaf0;border:1px solid #f5deb3;padding:0.875rem 1rem;font-size:0.8125rem;color:#374151;line-height:1.7;margin-top:0.75rem">
      <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Punto di ritiro selezionato</p>
      <strong>${escapeHtml(pickupCarrierLabel(data.pickupCarrier))}</strong><br>
      ${escapeHtml(data.pickupPointAddress)}
      ${data.pickupPointCode?.trim() ? `<br><span style="color:#9ca3af">Codice punto: ${escapeHtml(data.pickupPointCode)}</span>` : ''}
    </div>`
}

export async function sendOrderConfirmation(data: OrderData) {
  const settings = await getSettingsMap()
  const iban = settings['IBAN_BONIFICO'] ?? ''
  const intestatario = settings['INTESTATARIO_BONIFICO'] ?? ''

  const bonifico =
    data.paymentMethod === 'bonifico'
      ? infoBox(
          BRAND_GREEN,
          '#f0f7f2',
          '#bbf7d0',
          'Istruzioni bonifico bancario',
          `Effettua il bonifico entro <strong>5 giorni lavorativi</strong>.<br>
    <strong>Intestatario:</strong> ${escapeHtml(intestatario)}<br>
    <strong>IBAN:</strong> <span style="font-family:monospace;font-weight:600">${escapeHtml(iban)}</span><br>
    <strong>Causale:</strong> Ordine #${escapeHtml(data.orderId.slice(-8).toUpperCase())}`
        )
      : ''

  const contrassegno =
    data.paymentMethod === 'contrassegno'
      ? infoBox(
          '#a16207',
          '#fffbeb',
          '#fde68a',
          'Pagamento alla consegna',
          `Tieni pronti <strong>${formatEuro(data.total)}</strong> in contanti da consegnare al corriere. Il supplemento contrassegno &egrave; gi&agrave; incluso nel totale.`
        )
      : ''

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine confermato</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">Grazie, ${firstName(data.customerName)}.</h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Il tuo ordine <strong style="color:#111827;font-family:monospace">#${escapeHtml(data.orderId.slice(-8).toUpperCase())}</strong> &egrave; stato ricevuto e sar&agrave; presto in lavorazione.
    </p>
    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge, data.shippingCost, data.foreignSurcharge)}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1.25rem">
      <tr>
        <td style="padding-right:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Metodo di pagamento</p>
          <p style="margin:0;font-size:0.8125rem;color:#374151">${escapeHtml(METHOD_LABEL[data.paymentMethod] ?? data.paymentMethod)}</p>
        </td>
        <td style="padding-left:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Indirizzo di spedizione</p>
          ${addressBlock(data.address)}
          ${pickupBlock(data)}
        </td>
      </tr>
    </table>
    ${bonifico}${contrassegno}
    <p style="margin:1.5rem 0 0.75rem;font-size:0.8125rem;color:#6b7280;font-weight:300;line-height:1.7">Puoi seguire il tuo ordine nell'area personale del sito.</p>
    ${cta(`${SITE_URL}/account/ordini/${data.orderId}`, 'Vedi il tuo ordine &rarr;')}
  `)

  await sendMail({
    from: buildFrom(),
    to: data.customerEmail,
    subject: `Ordine #${data.orderId.slice(-8).toUpperCase()} confermato - EUR ${data.total.toFixed(2)}`,
    html,
  })
}

export async function sendOrderShipped(data: OrderData) {
  const tracking = data.trackingNumber
    ? infoBox(
        BRAND_GREEN,
        BRAND_LIGHT,
        '#bbf7d0',
        'Numero di tracking',
        `<span style="font-family:monospace;font-size:1rem;font-weight:600;color:${BRAND_GREEN}">${escapeHtml(data.trackingNumber)}</span>`
      )
    : ''

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine spedito</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">Il tuo ordine &egrave; in viaggio.</h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      L'ordine <strong style="color:#111827;font-family:monospace">#${escapeHtml(data.orderId.slice(-8).toUpperCase())}</strong> &egrave; stato affidato al corriere e sar&agrave; presto da te.
    </p>
    ${tracking}
    <p style="margin:1rem 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Indirizzo di consegna</p>
    ${addressBlock(data.address)}
    ${pickupBlock(data)}
    <p style="margin:1.5rem 0 0.75rem;font-size:0.8125rem;color:#6b7280;font-weight:300;line-height:1.7">Hai domande sulla spedizione? Contattaci rispondendo a questa email.</p>
    ${cta(`${SITE_URL}/account/ordini/${data.orderId}`, 'Dettagli ordine &rarr;')}
  `)

  await sendMail({
    from: buildFrom(),
    to: data.customerEmail,
    subject: `Il tuo ordine #${data.orderId.slice(-8).toUpperCase()} e in spedizione`,
    html,
  })
}

export async function sendOrderDelivered(data: OrderData) {
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine consegnato</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">Benvenuto nella famiglia 08NT.</h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Il tuo ordine <strong style="color:#111827;font-family:monospace">#${escapeHtml(data.orderId.slice(-8).toUpperCase())}</strong> &egrave; stato consegnato. Speriamo che i nostri prodotti ti diano i risultati che meriti.
    </p>
    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge, data.shippingCost, data.foreignSurcharge)}
    <p style="margin:1.25rem 0 0.875rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">Hai trovato qualcosa che ami? Scopri l'intera linea 08 Natural Technology.</p>
    ${cta(`${SITE_URL}/prodotti`, 'Esplora il catalogo &rarr;')}
  `)

  await sendMail({
    from: buildFrom(),
    to: data.customerEmail,
    subject: `Ordine #${data.orderId.slice(-8).toUpperCase()} consegnato - Grazie!`,
    html,
  })
}

export async function sendOrderCancelled(data: OrderData) {
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine annullato</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:#374151;font-family:Georgia,serif;letter-spacing:0.02em">Il tuo ordine &egrave; stato annullato.</h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      L'ordine <strong style="color:#111827;font-family:monospace">#${escapeHtml(data.orderId.slice(-8).toUpperCase())}</strong> &egrave; stato annullato. Se hai effettuato un pagamento online, il rimborso sar&agrave; elaborato entro 5-7 giorni lavorativi.
    </p>
    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge, data.shippingCost, data.foreignSurcharge)}
    <p style="margin:1.25rem 0 0.875rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">Per qualsiasi domanda, contattaci rispondendo a questa email o tramite la pagina contatti.</p>
    ${cta(`${SITE_URL}/contatti`, 'Contattaci &rarr;')}
  `)

  await sendMail({
    from: buildFrom(),
    to: data.customerEmail,
    subject: `Ordine #${data.orderId.slice(-8).toUpperCase()} annullato`,
    html,
  })
}

export async function sendAdminOrderNotification(data: OrderData) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || DEFAULT_EMAIL
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Nuovo ordine ricevuto</p>
    <h1 style="margin:0 0 1.5rem;font-size:1.375rem;font-weight:600;color:#111827">#${escapeHtml(data.orderId.slice(-8).toUpperCase())} - ${formatEuro(data.total)}</h1>
    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge, data.shippingCost, data.foreignSurcharge)}
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1.25rem">
      <tr>
        <td style="padding-right:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Cliente</p>
          <p style="margin:0;font-size:0.8125rem;color:#374151;line-height:1.6">
            ${escapeHtml(data.customerName)}<br>
            <a href="mailto:${escapeHtml(data.customerEmail)}" style="color:${BRAND_GREEN}">${escapeHtml(data.customerEmail)}</a>
          </p>
        </td>
        <td style="padding-left:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Pagamento</p>
          <p style="margin:0;font-size:0.8125rem;color:#374151">${escapeHtml(METHOD_LABEL[data.paymentMethod] ?? data.paymentMethod)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Indirizzo di spedizione</p>
    ${addressBlock(data.address)}
    ${pickupBlock(data)}
    <p style="margin:1.5rem 0 0.75rem"></p>
    ${cta(`${SITE_URL}/admin/ordini/${data.orderId}`, 'Gestisci ordine &rarr;')}
  `)

  await sendMail({
    from: buildFrom('08NT Notifiche'),
    to: adminEmail,
    subject: `[Nuovo ordine] #${data.orderId.slice(-8).toUpperCase()} - ${data.customerName} - EUR ${data.total.toFixed(2)}`,
    html,
  })
}

export async function sendVerificationEmail(email: string, name: string | null, token: string) {
  const verifyUrl = `${SITE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Conferma la tua email</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">Benvenuto${name ? `, ${firstName(name)}` : ''}.</h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">Per completare la registrazione e attivare il tuo account, conferma il tuo indirizzo email cliccando qui sotto. Il link scade tra 24 ore.</p>
    ${cta(verifyUrl, 'Conferma la tua email &rarr;')}
    <p style="margin:1.5rem 0 0;font-size:0.75rem;color:#9ca3af;line-height:1.6">Se non hai richiesto tu questa registrazione, ignora pure questa email.</p>
  `)

  await sendMail({
    from: buildFrom(),
    to: email,
    subject: 'Conferma la tua email - 08 Natural Technology',
    html,
  })
}

export async function sendNewsletterConfirmation(email: string, discountCode: string) {
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Newsletter 08</p>
    <h1 style="margin:0 0 0.75rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">Iscrizione confermata.</h1>
    <p style="margin:0 0 1.25rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">Grazie per esserti iscritto alla newsletter di 08 Natural Technology. Da oggi riceverai aggiornamenti su formule, prodotti e novit&agrave; del brand.</p>
    <div style="background:${BRAND_LIGHT};border:1px solid #bbf7d0;padding:1.25rem;margin:1.25rem 0;text-align:center">
      <p style="margin:0 0 0.5rem;font-size:0.625rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND_GREEN}">Extra sconto riservato</p>
      <p style="margin:0;font-size:1.5rem;font-weight:700;letter-spacing:0.12em;color:${BRAND_GREEN};font-family:monospace">${escapeHtml(discountCode)}</p>
      <p style="margin:0.625rem 0 0;font-size:0.8125rem;color:#374151;line-height:1.6">Usa questo codice al checkout per applicare il 5% di sconto extra sul tuo ordine.</p>
    </div>
    ${cta(`${SITE_URL}/prodotti`, 'Scopri i prodotti')}
    <p style="margin:1.5rem 0 0;font-size:0.75rem;color:#9ca3af;line-height:1.6">Se non hai richiesto tu questa iscrizione, puoi ignorare questa email o contattarci rispondendo a questo messaggio.</p>
  `)

  await sendMail({
    from: buildFrom(),
    to: email,
    subject: 'Conferma iscrizione newsletter - codice extra 5%',
    html,
  })
}

export interface ContactMessageData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactNotification(data: ContactMessageData) {
  const recipient =
    process.env.CONTACT_EMAIL_TO?.trim() || process.env.ADMIN_EMAIL?.trim() || DEFAULT_EMAIL
  const safeSubject = data.subject.trim() || 'Richiesta dal sito'

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(safeSubject)}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f5f0;font-family:Arial,sans-serif;color:#1f2937">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb">
    <tr>
      <td style="padding:18px 22px;border-bottom:1px solid #e5e7eb;background:#fafaf8">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6b7280">Nuovo messaggio dal sito</p>
        <h1 style="margin:0;font-size:26px;font-weight:400;color:#1a4a2e">08 NATURAL TECHNOLOGY</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:22px">
        <p style="margin:0 0 18px;font-size:14px;color:#111827"><strong>Oggetto:</strong> ${escapeHtml(safeSubject)}</p>
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280">Mittente</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#111827">
          <strong>${escapeHtml(data.name)}</strong><br>
          <a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND_GREEN};text-decoration:none">${escapeHtml(data.email)}</a>
        </p>
        <p style="margin:0 0 6px;font-size:13px;color:#6b7280">Messaggio</p>
        <div style="padding:14px 16px;border:1px solid #e5e7eb;background:#fafaf8;font-size:15px;line-height:1.7;white-space:pre-wrap">${escapeHtml(data.message)}</div>
      </td>
    </tr>
  </table>
</body>
</html>`
  const text = [
    'Nuovo messaggio dal sito 08 Natural Technology',
    '',
    `Oggetto: ${safeSubject}`,
    `Nome: ${data.name}`,
    `Email: ${data.email}`,
    '',
    'Messaggio:',
    data.message,
  ].join('\n')

  await sendMail({
    from: buildFrom('Contatti 08 Natural Technology'),
    to: recipient,
    replyTo: data.email,
    subject: `[Contatti 08] ${safeSubject}`,
    html,
    text,
    headers: {
      'X-Auto-Response-Suppress': 'All',
      'X-Entity-Ref-ID': `contact-${Date.now()}`,
    },
  })
}

export async function sendPasswordResetEmail(email: string, name: string | null, token: string) {
  const resetUrl = `${SITE_URL}/reimposta-password?token=${encodeURIComponent(token)}`
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Reimposta password</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">Ciao${name ? `, ${firstName(name)}` : ''}.</h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">Abbiamo ricevuto una richiesta di reimpostazione della password per il tuo account. Clicca qui sotto per sceglierne una nuova. Il link scade tra 1 ora.</p>
    ${cta(resetUrl, 'Reimposta la password &rarr;')}
    <p style="margin:1.5rem 0 0;font-size:0.75rem;color:#9ca3af;line-height:1.6">Se non hai richiesto tu questa operazione, ignora pure questa email: la tua password rester&agrave; invariata.</p>
  `)

  await sendMail({
    from: buildFrom(),
    to: email,
    subject: 'Reimposta la tua password - 08 Natural Technology',
    html,
  })
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) transporter = createTransport()
  return transporter
}

async function sendMail(message: MailMessage) {
  const config = resolveSmtpConfig()
  const smtpTransporter = getTransporter()
  const timeoutMs = Number(process.env.SMTP_TIMEOUT_MS ?? '20000')
  let timeout: NodeJS.Timeout | null = null

  try {
    return await Promise.race([
      smtpTransporter.sendMail({
        from: buildFrom(),
        replyTo: config.replyTo,
        ...message,
      }),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('SMTP send timeout')), timeoutMs)
      }),
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
    const closable = smtpTransporter as nodemailer.Transporter & { close?: () => void }
    closable.close?.()
    transporter = null
  }
}
