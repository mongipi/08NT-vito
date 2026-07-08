'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation } from '@/lib/i18n/dictionary'

export function ProductRegulatoryNotice({ notificationMs }: { notificationMs?: string | null }) {
  const { locale } = useLocale()
  const t = useTranslation(locale)

  return (
    <div className="v61-regulatory-notice">
      <div>
        {t('product_regulatory_notice', { ms: notificationMs ? ` (${notificationMs})` : '' })}
      </div>
    </div>
  )
}
