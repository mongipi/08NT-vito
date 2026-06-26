'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { invalidateSettingsCache, SETTING_KEYS } from '@/lib/settings'

export async function saveSettings(formData: FormData) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') redirect('/login')

  const keys = [
    SETTING_KEYS.IBAN,
    SETTING_KEYS.INTESTATARIO,
    SETTING_KEYS.COD_SURCHARGE,
    SETTING_KEYS.SPEDIZIONE_GRATUITA,
    SETTING_KEYS.PREZZO_SPEDIZIONE,
    SETTING_KEYS.SUPPLEMENTO_ESTERO,
  ]

  await Promise.all(
    keys.map((key) => {
      const value = (formData.get(key) as string)?.trim() ?? ''
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    })
  )

  invalidateSettingsCache()
  revalidatePath('/admin/impostazioni')
  revalidatePath('/checkout')
  redirect('/admin/impostazioni?saved=1')
}
