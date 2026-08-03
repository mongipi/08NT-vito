import { prisma } from '@/lib/prisma'
import type { Discount, Prisma } from '@prisma/client'

/** Coupon e sconti. Unico punto di accesso a prisma.discount. */

export async function getDiscounts(): Promise<Discount[]> {
  return prisma.discount.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getDiscountByCode(code: string): Promise<Discount | null> {
  return prisma.discount.findUnique({ where: { code } })
}

export async function createDiscount(data: Prisma.DiscountCreateInput): Promise<Discount> {
  return prisma.discount.create({ data })
}

export async function upsertDiscount(
  code: string,
  create: Prisma.DiscountCreateInput,
  update: Prisma.DiscountUpdateInput
): Promise<Discount> {
  return prisma.discount.upsert({ where: { code }, create, update })
}

export async function deleteDiscount(id: string): Promise<void> {
  await prisma.discount.delete({ where: { id } })
}

/** Incrementa il contatore di utilizzi dopo un ordine andato a buon fine. */
export async function incrementDiscountUsage(code: string): Promise<void> {
  await prisma.discount.updateMany({ where: { code }, data: { usedCount: { increment: 1 } } })
}
