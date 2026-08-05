'use client'

import { createContext, useContext } from 'react'
import type { PublicSiteSettings } from '@/lib/site-settings'

const SiteSettingsContext = createContext<PublicSiteSettings | null>(null)

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: PublicSiteSettings
  children: React.ReactNode
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings() {
  const value = useContext(SiteSettingsContext)
  if (!value) throw new Error('useSiteSettings must be used inside SiteSettingsProvider')
  return value
}
