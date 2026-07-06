import nodemailer from 'nodemailer'
import { getSettingsMap } from '@/lib/settings'

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const BRAND_GREEN  = '#1a4a2e'
const BRAND_LIGHT  = '#f0f7f2'
const SITE_URL     = process.env.NEXTAUTH_URL ?? 'https://08-nt-vito.vercel.app'

// ─── Shared layout ────────────────────────────────────────────────
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

        <!-- Header -->
        <tr>
          <td style="background:${BRAND_GREEN};padding:1.5rem 2rem">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:0.625rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.45)">
                    08 Natural Technology
                  </p>
                  <p style="margin:0.25rem 0 0;font-size:1.375rem;font-weight:300;color:white;letter-spacing:0.02em;font-family:Georgia,serif">
                    VIPHARMA
                  </p>
                </td>
                <td align="right">
                  <p style="margin:0;font-size:0.5625rem;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.35)">
                    Nutraceutica di qualità
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:white;padding:2rem">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:1.25rem 2rem;background:#f9f9f7;border-top:1px solid #e8e8e4">
            <p style="margin:0;font-size:0.6875rem;color:#9ca3af;line-height:1.6;text-align:center">
              08 Natural Technology · VIPHARMA di Tatulli Vito &amp; Co. S.A.S.<br>
              Bitonto (BA) · Italy<br>
              <a href="${SITE_URL}" style="color:#9ca3af;text-decoration:underline">${SITE_URL.replace('https://', '')}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Divider ──────────────────────────────────────────────────────
const divider = `<tr><td style="padding:0"><hr style="border:none;border-top:1px solid #f0f0ec;margin:1.25rem 0"></td></tr>`

// ─── Items table ──────────────────────────────────────────────────
function itemsTable(items: { name: string; qty: number; unitPrice: number }[], total: number, discountAmount = 0, couponCode?: string | null, codSurcharge = 0) {
  const rows = items.map(i => `
    <tr>
      <td style="padding:0.5rem 0;font-size:0.875rem;color:#374151;border-bottom:1px solid #f5f5f0">${i.name}</td>
      <td style="padding:0.5rem 0;font-size:0.875rem;color:#6b7280;text-align:center;border-bottom:1px solid #f5f5f0">×${i.qty}</td>
      <td style="padding:0.5rem 0;font-size:0.875rem;font-weight:500;color:#111827;text-align:right;border-bottom:1px solid #f5f5f0">€${(i.unitPrice * i.qty).toFixed(2)}</td>
    </tr>`).join('')

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0)

  const discountRow = discountAmount > 0 ? `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#dc2626">Sconto${couponCode ? ` (${couponCode})` : ''}</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#dc2626;text-align:right">−€${discountAmount.toFixed(2)}</td>
    </tr>` : ''

  const codRow = codSurcharge > 0 ? `
    <tr>
      <td colspan="2" style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280">Supplemento contrassegno</td>
      <td style="padding:0.25rem 0;font-size:0.8125rem;color:#6b7280;text-align:right">+€${codSurcharge.toFixed(2)}</td>
    </tr>` : ''

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1rem">
      <thead>
        <tr style="background:#f9f9f7">
          <th style="padding:0.5rem 0;font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;text-align:left">Prodotto</th>
          <th style="padding:0.5rem 0;font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;text-align:center">Qtà</th>
          <th style="padding:0.5rem 0;font-size:0.625rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;text-align:right">Prezzo</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        ${discountRow}${codRow}
        <tr>
          <td colspan="2" style="padding:0.625rem 0 0;font-size:0.9375rem;font-weight:700;color:${BRAND_GREEN};border-top:2px solid #f0f0ec">Totale</td>
          <td style="padding:0.625rem 0 0;font-size:0.9375rem;font-weight:700;color:${BRAND_GREEN};text-align:right;border-top:2px solid #f0f0ec">€${total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>`
}

// ─── Address block ────────────────────────────────────────────────
function addressBlock(addr: { firstName: string; lastName: string; address: string; city: string; postalCode: string; province?: string | null; country: string; phone?: string | null }) {
  return `
    <div style="background:#f9f9f7;border:1px solid #e8e8e4;padding:0.875rem 1rem;font-size:0.8125rem;color:#374151;line-height:1.7">
      <strong>${addr.firstName} ${addr.lastName}</strong><br>
      ${addr.address}<br>
      ${[addr.postalCode, addr.city, addr.province].filter(Boolean).join(' ')}<br>
      ${addr.country !== 'IT' ? addr.country + '<br>' : ''}
      ${addr.phone ? `<span style="color:#9ca3af">${addr.phone}</span>` : ''}
    </div>`
}

// ─── CTA button ───────────────────────────────────────────────────
function cta(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;padding:0.75rem 1.75rem;background:${BRAND_GREEN};color:white;text-decoration:none;font-size:0.6875rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase">${label}</a>`
}

// ─── Info box ─────────────────────────────────────────────────────
function infoBox(color: string, bg: string, border: string, title: string, body: string) {
  return `
    <div style="background:${bg};border:1px solid ${border};padding:1rem 1.25rem;margin:1.25rem 0">
      <p style="margin:0 0 0.5rem;font-size:0.625rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${color}">${title}</p>
      <p style="margin:0;font-size:0.8125rem;color:#374151;line-height:1.7">${body}</p>
    </div>`
}

// ─── Types ────────────────────────────────────────────────────────
export interface OrderData {
  orderId: string
  paymentMethod: string
  total: number
  subtotal: number
  discountAmount: number
  couponCode?: string | null
  codSurcharge: number
  customerName: string
  customerEmail: string
  items: { name: string; qty: number; unitPrice: number }[]
  address: { firstName: string; lastName: string; address: string; city: string; postalCode: string; province?: string | null; country: string; phone?: string | null }
  trackingNumber?: string
}

const METHOD_LABEL: Record<string, string> = {
  stripe:       'Carta / PayPal / Google Pay / Apple Pay',
  bonifico:     'Bonifico bancario',
  contrassegno: 'Contrassegno (pagamento alla consegna)',
}

// ═══════════════════════════════════════════════════════════════════
// 1. CONFERMA ORDINE → cliente
// ═══════════════════════════════════════════════════════════════════
export async function sendOrderConfirmation(data: OrderData) {
  const settings = await getSettingsMap()
  const IBAN = settings['IBAN_BONIFICO'] ?? ''
  const INTESTATARIO = settings['INTESTATARIO_BONIFICO'] ?? ''

  const bonifico = data.paymentMethod === 'bonifico' ? infoBox(
    BRAND_GREEN, '#f0f7f2', '#bbf7d0',
    'Istruzioni bonifico bancario',
    `Effettua il bonifico entro <strong>5 giorni lavorativi</strong>.<br>
    <strong>Intestatario:</strong> ${INTESTATARIO}<br>
    <strong>IBAN:</strong> <span style="font-family:monospace;font-weight:600">${IBAN}</span><br>
    <strong>Causale:</strong> Ordine #${data.orderId.slice(-8).toUpperCase()}`
  ) : ''

  const contrassegno = data.paymentMethod === 'contrassegno' ? infoBox(
    '#a16207', '#fffbeb', '#fde68a',
    'Pagamento alla consegna',
    `Tieni pronti <strong>€${data.total.toFixed(2)}</strong> in contanti da consegnare al corriere. Il supplemento contrassegno è già incluso nel totale.`
  ) : ''

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine confermato</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">
      Grazie, ${data.customerName.split(' ')[0]}.
    </h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Il tuo ordine <strong style="color:#111827;font-family:monospace">#${data.orderId.slice(-8).toUpperCase()}</strong> è stato ricevuto e sarà presto in lavorazione.
    </p>

    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1.25rem">
      <tr>
        <td style="padding-right:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Metodo di pagamento</p>
          <p style="margin:0;font-size:0.8125rem;color:#374151">${METHOD_LABEL[data.paymentMethod] ?? data.paymentMethod}</p>
        </td>
        <td style="padding-left:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Indirizzo di spedizione</p>
          ${addressBlock(data.address)}
        </td>
      </tr>
    </table>

    ${bonifico}${contrassegno}

    <p style="margin:1.5rem 0 0.75rem;font-size:0.8125rem;color:#6b7280;font-weight:300;line-height:1.7">
      Puoi seguire il tuo ordine nell'area personale del sito.
    </p>
    ${cta(`${SITE_URL}/account/ordini/${data.orderId}`, 'Vedi il tuo ordine →')}
  `)

  await getTransporter().sendMail({
    from: `"08 Natural Technology" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Ordine #${data.orderId.slice(-8).toUpperCase()} confermato — €${data.total.toFixed(2)}`,
    html,
  })
}

// ═══════════════════════════════════════════════════════════════════
// 2. ORDINE SPEDITO → cliente
// ═══════════════════════════════════════════════════════════════════
export async function sendOrderShipped(data: OrderData) {
  const tracking = data.trackingNumber
    ? infoBox(BRAND_GREEN, BRAND_LIGHT, '#bbf7d0', 'Numero di tracking', `<span style="font-family:monospace;font-size:1rem;font-weight:600;color:${BRAND_GREEN}">${data.trackingNumber}</span>`)
    : ''

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine spedito</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">
      Il tuo ordine è in viaggio.
    </h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      L'ordine <strong style="color:#111827;font-family:monospace">#${data.orderId.slice(-8).toUpperCase()}</strong> è stato affidato al corriere e sarà presto da te.
    </p>

    ${tracking}

    <p style="margin:1rem 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Indirizzo di consegna</p>
    ${addressBlock(data.address)}

    <p style="margin:1.5rem 0 0.75rem;font-size:0.8125rem;color:#6b7280;font-weight:300;line-height:1.7">
      Hai domande sulla spedizione? Contattaci rispondendo a questa email.
    </p>
    ${cta(`${SITE_URL}/account/ordini/${data.orderId}`, 'Dettagli ordine →')}
  `)

  await getTransporter().sendMail({
    from: `"08 Natural Technology" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Il tuo ordine #${data.orderId.slice(-8).toUpperCase()} è in spedizione`,
    html,
  })
}

// ═══════════════════════════════════════════════════════════════════
// 3. ORDINE CONSEGNATO → cliente
// ═══════════════════════════════════════════════════════════════════
export async function sendOrderDelivered(data: OrderData) {
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine consegnato</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">
      Benvenuto nella famiglia 08NT.
    </h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Il tuo ordine <strong style="color:#111827;font-family:monospace">#${data.orderId.slice(-8).toUpperCase()}</strong> è stato consegnato. Speriamo che i nostri prodotti ti diano i risultati che meriti.
    </p>

    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge)}

    <p style="margin:1.25rem 0 0.875rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Hai trovato qualcosa che ami? Scopri l'intera linea 08 Natural Technology.
    </p>
    ${cta(`${SITE_URL}/prodotti`, 'Esplora il catalogo →')}
  `)

  await getTransporter().sendMail({
    from: `"08 Natural Technology" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Ordine #${data.orderId.slice(-8).toUpperCase()} consegnato — Grazie!`,
    html,
  })
}

// ═══════════════════════════════════════════════════════════════════
// 4. ORDINE ANNULLATO → cliente
// ═══════════════════════════════════════════════════════════════════
export async function sendOrderCancelled(data: OrderData) {
  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Ordine annullato</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:#374151;font-family:Georgia,serif;letter-spacing:0.02em">
      Il tuo ordine è stato annullato.
    </h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      L'ordine <strong style="color:#111827;font-family:monospace">#${data.orderId.slice(-8).toUpperCase()}</strong> è stato annullato. Se hai effettuato un pagamento online, il rimborso sarà elaborato entro 5-7 giorni lavorativi.
    </p>

    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge)}

    <p style="margin:1.25rem 0 0.875rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Per qualsiasi domanda, contattaci rispondendo a questa email o tramite la pagina contatti.
    </p>
    ${cta(`${SITE_URL}/contatti`, 'Contattaci →')}
  `)

  await getTransporter().sendMail({
    from: `"08 Natural Technology" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Ordine #${data.orderId.slice(-8).toUpperCase()} annullato`,
    html,
  })
}

// ═══════════════════════════════════════════════════════════════════
// 5. NOTIFICA NUOVO ORDINE → admin
// ═══════════════════════════════════════════════════════════════════
export async function sendAdminOrderNotification(data: OrderData) {
  const adminEmail = process.env.SMTP_USER ?? ''
  if (!adminEmail) return

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Nuovo ordine ricevuto</p>
    <h1 style="margin:0 0 1.5rem;font-size:1.375rem;font-weight:600;color:#111827">
      #${data.orderId.slice(-8).toUpperCase()} — €${data.total.toFixed(2)}
    </h1>

    ${itemsTable(data.items, data.total, data.discountAmount, data.couponCode, data.codSurcharge)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:1.25rem">
      <tr>
        <td style="padding-right:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Cliente</p>
          <p style="margin:0;font-size:0.8125rem;color:#374151;line-height:1.6">
            ${data.customerName}<br>
            <a href="mailto:${data.customerEmail}" style="color:${BRAND_GREEN}">${data.customerEmail}</a>
          </p>
        </td>
        <td style="padding-left:0.5rem;vertical-align:top;width:50%">
          <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Pagamento</p>
          <p style="margin:0;font-size:0.8125rem;color:#374151">${METHOD_LABEL[data.paymentMethod] ?? data.paymentMethod}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 0.375rem;font-size:0.625rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af">Indirizzo di spedizione</p>
    ${addressBlock(data.address)}

    <p style="margin:1.5rem 0 0.75rem"></p>
    ${cta(`${SITE_URL}/admin/ordini/${data.orderId}`, 'Gestisci ordine →')}
  `)

  await getTransporter().sendMail({
    from: `"08NT Notifiche" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `[Nuovo ordine] #${data.orderId.slice(-8).toUpperCase()} — ${data.customerName} — €${data.total.toFixed(2)}`,
    html,
  })
}

// ═══════════════════════════════════════════════════════════════════
// 6. CONFERMA EMAIL → nuovo account
// ═══════════════════════════════════════════════════════════════════
export async function sendVerificationEmail(email: string, name: string | null, token: string) {
  const verifyUrl = `${SITE_URL}/api/auth/verify-email?token=${token}`

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Conferma la tua email</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">
      Benvenuto${name ? `, ${name.split(' ')[0]}` : ''}.
    </h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Per completare la registrazione e attivare il tuo account, conferma il tuo indirizzo email cliccando qui sotto. Il link scade tra 24 ore.
    </p>

    ${cta(verifyUrl, 'Conferma la tua email →')}

    <p style="margin:1.5rem 0 0;font-size:0.75rem;color:#9ca3af;line-height:1.6">
      Se non hai richiesto tu questa registrazione, ignora pure questa email.
    </p>
  `)

  await getTransporter().sendMail({
    from: `"08 Natural Technology" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Conferma la tua email — 08 Natural Technology',
    html,
  })
}

// ═══════════════════════════════════════════════════════════════════
// 7. REIMPOSTA PASSWORD → utente
// ═══════════════════════════════════════════════════════════════════
export async function sendPasswordResetEmail(email: string, name: string | null, token: string) {
  const resetUrl = `${SITE_URL}/reimposta-password?token=${token}`

  const html = layout(`
    <p style="margin:0 0 0.25rem;font-size:0.625rem;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#9ca3af">Reimposta password</p>
    <h1 style="margin:0 0 0.25rem;font-size:1.625rem;font-weight:300;color:${BRAND_GREEN};font-family:Georgia,serif;letter-spacing:0.02em">
      Ciao${name ? `, ${name.split(' ')[0]}` : ''}.
    </h1>
    <p style="margin:0 0 1.5rem;font-size:0.875rem;color:#6b7280;font-weight:300;line-height:1.7">
      Abbiamo ricevuto una richiesta di reimpostazione della password per il tuo account. Clicca qui sotto per sceglierne una nuova. Il link scade tra 1 ora.
    </p>

    ${cta(resetUrl, 'Reimposta la password →')}

    <p style="margin:1.5rem 0 0;font-size:0.75rem;color:#9ca3af;line-height:1.6">
      Se non hai richiesto tu questa operazione, ignora pure questa email: la tua password resterà invariata.
    </p>
  `)

  await getTransporter().sendMail({
    from: `"08 Natural Technology" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reimposta la tua password — 08 Natural Technology',
    html,
  })
}

// ─── Lazy transporter ─────────────────────────────────────────────
let _transporter: nodemailer.Transporter | null = null
function getTransporter() {
  if (!_transporter) _transporter = createTransport()
  return _transporter
}
