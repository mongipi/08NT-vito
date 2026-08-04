import { prisma } from '@/lib/prisma'
import type { Setting } from '@prisma/client'

/** Tabella Setting. Unico accesso a prisma.setting. */

export async function getAllSettings(): Promise<Setting[]> {
  return prisma.setting.findMany()
}

export async function saveSettingValues(values: Record<string, string>): Promise<void> {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  )
}
