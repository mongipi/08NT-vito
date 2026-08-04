import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/guards'
import { NEWSLETTER_STATUS } from '@/lib/domain/newsletter'
import { getSubscribers } from '@/services/newsletter'

/** Protegge dalla formula injection nei fogli di calcolo. */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

/**
 * Esporta i soli iscritti attivi: chi non ha confermato o si e' cancellato non
 * deve finire in una lista di invio.
 */
export async function GET() {
  await requireAdmin()

  const subscribers = (await getSubscribers()).filter(
    (sub) => sub.status === NEWSLETTER_STATUS.active
  )

  const header = ['email', 'lingua', 'origine', 'iscritto_il', 'confermato_il']
  const rows = subscribers.map((sub) =>
    [
      sub.email,
      sub.locale,
      sub.source,
      sub.createdAt.toISOString(),
      sub.confirmedAt?.toISOString() ?? '',
    ]
      .map(csvCell)
      .join(',')
  )

  // BOM: senza, Excel non riconosce l'UTF-8 e rovina le lettere accentate.
  const csv = '﻿' + [header.map(csvCell).join(','), ...rows].join('\r\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="newsletter-08nt-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
