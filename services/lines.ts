import { prisma } from '@/lib/prisma'
import type { Line, Prisma } from '@prisma/client'

/** Linee prodotto. Unico punto di accesso a prisma.line. */

const lineWithCountInclude = {
  _count: { select: { products: true } },
} as const

export type LineWithProductCount = Prisma.LineGetPayload<{ include: typeof lineWithCountInclude }>

export async function getLines(): Promise<Line[]> {
  return prisma.line.findMany({ orderBy: { name: 'asc' } })
}

export async function getLinesWithProductCount(): Promise<LineWithProductCount[]> {
  return prisma.line.findMany({ orderBy: { name: 'asc' }, include: lineWithCountInclude })
}

export async function getLineById(id: string): Promise<Line | null> {
  return prisma.line.findUnique({ where: { id } })
}

export async function createLine(data: Prisma.LineCreateInput): Promise<Line> {
  return prisma.line.create({ data })
}

export async function updateLine(id: string, data: Prisma.LineUpdateInput): Promise<Line> {
  return prisma.line.update({ where: { id }, data })
}

export async function deleteLine(id: string): Promise<void> {
  await prisma.line.delete({ where: { id } })
}
