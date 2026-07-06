import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { updateUserInfo, deleteAddress, setDefaultAddress } from '@/lib/actions/account'
import { ProfiloContent } from './ProfiloContent'

export const metadata: Metadata = { title: 'Il mio profilo — 08 Natural Technology' }

export default async function ProfiloPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [user, addresses] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.userAddress.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    }),
  ])
  if (!user) redirect('/login')

  const { saved } = await searchParams

  return (
    <ProfiloContent
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        fiscalCode: user.fiscalCode,
        company: user.company,
        vatNumber: user.vatNumber,
        sdiCode: user.sdiCode,
        pec: user.pec,
      }}
      addresses={addresses.map((addr) => ({
        id: addr.id,
        label: addr.label,
        isDefault: addr.isDefault,
        firstName: addr.firstName,
        lastName: addr.lastName,
        company: addr.company,
        address: addr.address,
        city: addr.city,
        postalCode: addr.postalCode,
        province: addr.province,
        phone: addr.phone,
      }))}
      saved={saved}
      updateUserInfo={updateUserInfo}
      deleteAddress={deleteAddress}
      setDefaultAddress={setDefaultAddress}
    />
  )
}
