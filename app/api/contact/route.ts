import { NextResponse } from 'next/server'
import { sendContactNotification } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body?.name ?? '').trim().slice(0, 120)
    const email = String(body?.email ?? '').trim().toLowerCase().slice(0, 254)
    const subject = String(body?.subject ?? '').trim().slice(0, 160)
    const message = String(body?.message ?? '').trim().slice(0, 5000)

    if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 5) {
      return NextResponse.json(
        { ok: false, message: 'Compila correttamente nome, email e messaggio.' },
        { status: 400 }
      )
    }

    await sendContactNotification({ name, email, subject, message })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('contact form email failed', error)
    return NextResponse.json(
      { ok: false, message: 'Invio non riuscito. Riprova tra poco.' },
      { status: 500 }
    )
  }
}
