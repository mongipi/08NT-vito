import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCustomerOrders } from '@/services/orders'
import type { Metadata } from 'next'
import { AccountContent } from './AccountContent'

export const metadata: Metadata = { title: 'Il mio account — 08 Natural Technology' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const orders = await getCustomerOrders(session.user.id)

  const name = session.user.name ?? ''
  const email = session.user.email ?? ''
  const isB2B = session.user.role === 'b2b'

  return (
    <AccountContent
      name={name}
      email={email}
      isB2B={isB2B}
      orders={orders}
    />
  )
}
