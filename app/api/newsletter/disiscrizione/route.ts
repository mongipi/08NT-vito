import { NextRequest, NextResponse } from 'next/server'
import { unsubscribeByToken } from '@/services/newsletter'

/**
 * Revoca del consenso dal link presente in ogni email.
 *
 * Un solo clic, senza chiedere di accedere: revocare deve essere facile quanto
 * iscriversi. Il token e' permanente, cosi' il link continua a funzionare anche
 * nei messaggi ricevuti mesi prima.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const url = new URL('/newsletter', req.url)

  if (!token) {
    url.searchParams.set('esito', 'disiscrizione-non-valida')
    return NextResponse.redirect(url)
  }

  const subscriber = await unsubscribeByToken(token)
  url.searchParams.set('esito', subscriber ? 'disiscritto' : 'disiscrizione-non-valida')
  return NextResponse.redirect(url)
}
