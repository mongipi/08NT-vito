import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { OrderDetailContent } from './OrderDetailContent'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Ordine #${id.slice(-8).toUpperCase()} — 08 Natural Technology` }
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect('/login')

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, shippingAddress: true },
  })
  if (!order || order.userId !== session.user.id) notFound()

  return <OrderDetailContent order={order} />
}
