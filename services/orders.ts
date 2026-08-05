import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

/**
 * Accesso in lettura agli ordini. Unico punto in cui le pagine ottengono ordini:
 * nessun componente o pagina deve chiamare prisma.order direttamente.
 *
 * A differenza di services/products.ts qui gli errori di connessione non vengono
 * inghiottiti: un elenco ordini vuoto per database irraggiungibile sarebbe
 * indistinguibile da "nessun ordine", e in area admin e' un'informazione critica.
 */

const orderListInclude = {
  user: { select: { email: true, name: true } },
  items: { select: { qty: true } },
} as const

const orderDetailInclude = {
  user: true,
  items: true,
  shippingAddress: true,
} as const

const orderEmailInclude = {
  user: { select: { email: true, name: true } },
  items: true,
  shippingAddress: true,
} as const

export type OrderListItem = Prisma.OrderGetPayload<{ include: typeof orderListInclude }>
export type OrderDetail = Prisma.OrderGetPayload<{ include: typeof orderDetailInclude }>
export type OrderForEmail = Prisma.OrderGetPayload<{ include: typeof orderEmailInclude }>

/** Riepilogo ordine mostrato nell'area cliente. */
export interface CustomerOrderSummary {
  id: string
  status: string
  total: number
  discountAmount: number
  createdAt: string
  itemCount: number
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  return prisma.order.findUnique({ where: { id }, include: orderDetailInclude })
}

export async function getOrderForEmail(id: string): Promise<OrderForEmail | null> {
  return prisma.order.findUnique({ where: { id }, include: orderEmailInclude })
}

/** Dettaglio ordine verificando che appartenga all'utente indicato. */
export async function getOrderForUser(id: string, userId: string): Promise<OrderDetail | null> {
  const order = await getOrderById(id)
  if (!order || order.userId !== userId) return null
  return order
}

export async function getCustomerOrders(
  userId: string,
  take = 20
): Promise<CustomerOrderSummary[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { select: { qty: true } } },
    orderBy: { createdAt: 'desc' },
    take,
  })

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    discountAmount: order.discountAmount,
    createdAt: order.createdAt.toISOString(),
    itemCount: order.items.reduce((count, item) => count + item.qty, 0),
  }))
}

/** Ricerca ordini per l'elenco admin: id, email ospite, coupon, nome/email cliente. */
export async function searchOrders(query?: string): Promise<OrderListItem[]> {
  const trimmed = query?.trim()
  const where: Prisma.OrderWhereInput | undefined = trimmed
    ? {
        OR: [
          { id: { contains: trimmed, mode: 'insensitive' } },
          { guestEmail: { contains: trimmed, mode: 'insensitive' } },
          { couponCode: { contains: trimmed, mode: 'insensitive' } },
          { user: { name: { contains: trimmed, mode: 'insensitive' } } },
          { user: { email: { contains: trimmed, mode: 'insensitive' } } },
        ],
      }
    : undefined

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: orderListInclude,
  })
}

export async function getRecentOrders(take = 8): Promise<OrderListItem[]> {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take,
    include: orderListInclude,
  })
}

export interface AdminDashboardStats {
  totalOrders: number
  pendingOrders: number
  totalUsers: number
  publishedProducts: number
  revenue: number
  recentOrders: OrderListItem[]
}

/** Stati che concorrono al fatturato. */
const REVENUE_STATUSES = ['paid', 'shipped', 'delivered'] as const

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [totalOrders, pendingOrders, totalUsers, publishedProducts, revenueResult, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.user.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.order.aggregate({
        where: { status: { in: [...REVENUE_STATUSES] } },
        _sum: { total: true },
      }),
      getRecentOrders(),
    ])

  return {
    totalOrders,
    pendingOrders,
    totalUsers,
    publishedProducts,
    revenue: revenueResult._sum.total ?? 0,
    recentOrders,
  }
}

export async function setOrderStatus(id: string, status: Prisma.OrderUpdateInput['status']) {
  return prisma.order.update({ where: { id }, data: { status } })
}

export async function findOrderByPaymentIntent(paymentIntentId: string) {
  return prisma.order.findFirst({
    where: { stripePaymentIntentId: paymentIntentId },
    select: { id: true, status: true },
  })
}

/**
 * Passa l'ordine da "pending" a "paid" in modo idempotente.
 * Restituisce true solo alla prima transizione riuscita: webhook Stripe e
 * pagina di successo possono arrivare entrambi, ma solo uno deve inviare email
 * e scalare le scorte.
 */
export async function claimPendingOrderAsPaid(id: string): Promise<boolean> {
  const claimed = await prisma.order.updateMany({
    where: { id, status: 'pending' },
    data: { status: 'paid' },
  })
  return claimed.count > 0
}

export async function getCompletedOrderOrThrow(id: string): Promise<OrderForEmail> {
  return prisma.order.findUniqueOrThrow({ where: { id }, include: orderEmailInclude })
}

export async function createOrder(data: Prisma.OrderUncheckedCreateInput) {
  return prisma.order.create({ data })
}
