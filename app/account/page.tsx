import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { AccountContent } from './AccountContent'

export const metadata: Metadata = { title: 'Il mio account — 08 Natural Technology' }

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { select: { qty: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const name = session.user.name ?? ''
  const email = session.user.email ?? ''
  const isB2B = session.user.role === 'b2b'

  return (
    <AccountContent
      name={name}
      email={email}
      isB2B={isB2B}
      orders={orders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        discountAmount: order.discountAmount,
        createdAt: order.createdAt.toISOString(),
        itemCount: order.items.reduce((n, i) => n + i.qty, 0),
      }))}
    />
  )
}
