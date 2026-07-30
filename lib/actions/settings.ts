'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { invalidateSettingsCache, SETTING_KEYS } from '@/lib/settings'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    SETTING_KEYS.HOME_HERO_CAROUSEL,
    SETTING_KEYS.COMPANY_DISPLAY_NAME,
    SETTING_KEYS.COMPANY_LEGAL_NAME,
    SETTING_KEYS.COMPANY_ADDRESS,
    SETTING_KEYS.COMPANY_PHONE,
    SETTING_KEYS.COMPANY_WHATSAPP,
    SETTING_KEYS.COMPANY_EMAIL,
    SETTING_KEYS.WHATSAPP_MESSAGE,
    SETTING_KEYS.SOCIAL_FACEBOOK,
    SETTING_KEYS.SOCIAL_INSTAGRAM,
    SETTING_KEYS.SOCIAL_TIKTOK,
    SETTING_KEYS.HEADER_NAV_LINKS,
    SETTING_KEYS.FOOTER_SECTIONS,
    SETTING_KEYS.FOOTER_PAYMENTS,
    SETTING_KEYS.FOOTER_COURIERS,
    SETTING_KEYS.FOOTER_MINISTRY_LOGO,
    SETTING_KEYS.FOOTER_COPYRIGHT_TEXT,
    SETTING_KEYS.FOOTER_MADE_LABEL,
    SETTING_KEYS.PRODUCT_PAGE_KICKERS,
    SETTING_KEYS.PRODUCT_PAGE_TEXTS,
    SETTING_KEYS.HOME_FEATURES,
    SETTING_KEYS.HOME_FORMULAS_EYEBROW,
    SETTING_KEYS.HOME_FORMULAS_TITLE,
    SETTING_KEYS.HOME_FORMULAS_BODY,
    SETTING_KEYS.HOME_FORMULAS_CTA_LABEL,
    SETTING_KEYS.HOME_FORMULAS_CTA_HREF,
    SETTING_KEYS.HOME_BLOG_EYEBROW,
    SETTING_KEYS.HOME_BLOG_TITLE,
    SETTING_KEYS.HOME_BLOG_BODY,
    SETTING_KEYS.NEWSLETTER_KICKER,
    SETTING_KEYS.NEWSLETTER_TITLE,
    SETTING_KEYS.NEWSLETTER_BODY,
    SETTING_KEYS.NEWSLETTER_BUTTON_LABEL,
    SETTING_KEYS.NEWSLETTER_EMAIL_PLACEHOLDER,
    SETTING_KEYS.METHOD_PAGE_CONTENT,
    SETTING_KEYS.LEGAL_PRIVACY_OVERRIDE,
    SETTING_KEYS.LEGAL_COOKIE_OVERRIDE,
    SETTING_KEYS.LEGAL_NOTES_OVERRIDE,
    SETTING_KEYS.LEGAL_TERMS_OVERRIDE,
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
  revalidatePath('/')
  redirect('/admin/impostazioni?saved=1')
}
