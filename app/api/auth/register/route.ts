import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth/password'
import { issueVerificationEmail } from '@/lib/verification'
import { createUser, getUserByEmail } from '@/services/users'

export async function POST(req: NextRequest) {
  const { name, email, password, confirmPassword } = await req.json()

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Le password non coincidono' }, { status: 400 })
  }

  const existing = await getUserByEmail(email)
  if (existing) {
    return NextResponse.json({ error: 'Email già registrata' }, { status: 409 })
  }

  await createUser({ name, email, password: await hashPassword(password), role: 'consumer' })

  // L'account è già creato: se l'invio dell'email fallisce (SMTP non
  // raggiungibile o mal configurato) non ha senso rispondere con un errore.
  // Restituirebbe 500 lasciando a database un utente che al secondo tentativo
  // riceverebbe "email già registrata", senza via d'uscita.
  // Chi si registra può richiedere una nuova email dalla pagina di accesso.
  let emailSent = true
  try {
    await issueVerificationEmail(email, name)
  } catch (error) {
    emailSent = false
    console.error('Invio email di verifica fallito per', email, error)
  }

  return NextResponse.json({ ok: true, emailSent }, { status: 201 })
}
