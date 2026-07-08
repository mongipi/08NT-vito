import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { updateAddress, deleteAddress } from '@/lib/actions/account'
import { ModificaIndirizzoContent } from './ModificaIndirizzoContent'

export const metadata: Metadata = { title: 'Modifica indirizzo — 08 Natural Technology' }

export default async function ModificaIndirizzoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params
  const address = await prisma.userAddress.findUnique({ where: { id } })
  if (!address || address.userId !== session.user.id) notFound()

  return <ModificaIndirizzoContent address={address} updateAddress={updateAddress} deleteAddress={deleteAddress} />
}
