import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createAddress } from '@/lib/actions/account'
import { NuovoIndirizzoContent } from './NuovoIndirizzoContent'

export const metadata: Metadata = { title: 'Nuovo indirizzo — 08 Natural Technology' }

export default async function NuovoIndirizzoPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return <NuovoIndirizzoContent action={createAddress} />
}
