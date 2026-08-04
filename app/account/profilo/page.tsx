import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById } from '@/services/users'
import { getUserAddresses } from '@/services/addresses'
import type { Metadata } from 'next'
import { updateUserInfo, deleteAddress, setDefaultAddress } from '@/lib/actions/account'
import { subscribeFromAccount, unsubscribeFromAccount } from '@/lib/actions/newsletter'
import { getSubscriberByEmail } from '@/services/newsletter'
import { NEWSLETTER_STATUS } from '@/lib/domain/newsletter'
import { ProfiloContent } from './ProfiloContent'

export const metadata: Metadata = { title: 'Il mio profilo — 08 Natural Technology' }

export default async function ProfiloPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [user, addresses, subscriber] = await Promise.all([
    getUserById(session.user.id),
    getUserAddresses(session.user.id),
    session.user.email ? getSubscriberByEmail(session.user.email) : null,
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
      newsletterActive={subscriber?.status === NEWSLETTER_STATUS.active}
      subscribeToNewsletter={subscribeFromAccount}
      unsubscribeFromNewsletter={unsubscribeFromAccount}
      updateUserInfo={updateUserInfo}
      deleteAddress={deleteAddress}
      setDefaultAddress={setDefaultAddress}
    />
  )
}
