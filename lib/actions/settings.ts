'use server'

import { invalidateSettingsCache } from '@/lib/settings'
import { saveSettingValues } from '@/services/settings'
import { requireAdmin } from '@/lib/auth/guards'
import { settingsSchema } from '@/lib/validation/settings'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const SETTINGS_PATH = '/admin/impostazioni'

export async function saveSettings(formData: FormData) {
  await requireAdmin()

  const result = settingsSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!result.success) {
    // Niente crash: si torna alla pagina con il motivo, così il valore
    // precedente resta a database e l'admin capisce cosa correggere.
    const message = result.error.issues.map((issue) => issue.message).join(' · ')
    redirect(`${SETTINGS_PATH}?error=${encodeURIComponent(message)}`)
  }

  await saveSettingValues(result.data)

  invalidateSettingsCache()
  revalidatePath(SETTINGS_PATH)
  revalidatePath('/checkout')
  revalidatePath('/')
  redirect(`${SETTINGS_PATH}?saved=1`)
}
