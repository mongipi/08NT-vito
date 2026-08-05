import { NextResponse } from 'next/server'
import { sendNewsletterOptIn } from '@/lib/email'
import { issueNewsletterConfirmationToken } from '@/lib/verification'
import { subscribeToNewsletter } from '@/services/newsletter'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let email = ''
  try {
    const body = await request.json()
    email = String(body?.email ?? '')
      .trim()
      .toLowerCase()
    const locale = String(body?.locale ?? 'it').slice(0, 8)
    const source = String(body?.source ?? 'site').slice(0, 32)
    const consent = body?.consent === true

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, message: 'Inserisci una email valida.' },
        { status: 400 }
      )
    }

    if (!consent) {
      return NextResponse.json(
        { ok: false, message: 'Devi accettare l informativa privacy per iscriverti.' },
        { status: 400 }
      )
    }

    // Se il salvataggio non riesce, l'iscrizione non e' avvenuta: va detto,
    // invece di rispondere "confermata" come faceva la versione precedente.
    await subscribeToNewsletter(email, locale, source)

    // Doppio consenso: il codice sconto arriva solo dopo la conferma, cosi'
    // iscrivere l'indirizzo di un altro non porta alcun vantaggio.
    const token = await issueNewsletterConfirmationToken(email)
    await sendNewsletterOptIn(email, token)

    return NextResponse.json({
      ok: true,
      message: 'Ti abbiamo inviato una email: conferma il tuo indirizzo per ricevere il codice.',
    })
  } catch (error) {
    console.error('Iscrizione newsletter fallita per', email, error)
    return NextResponse.json(
      { ok: false, message: 'Newsletter non disponibile al momento. Riprova tra poco.' },
      { status: 500 }
    )
  }
}
