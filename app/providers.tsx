'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/contexts/CartContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import type { PublicSiteSettings } from '@/lib/site-settings'

export function Providers({
  children,
  siteSettings,
}: {
  children: React.ReactNode
  siteSettings: PublicSiteSettings
}) {
  return (
    <SessionProvider>
      <SiteSettingsProvider value={siteSettings}>
        <LocaleProvider>
          <CartProvider>{children}</CartProvider>
        </LocaleProvider>
      </SiteSettingsProvider>
    </SessionProvider>
  )
}
