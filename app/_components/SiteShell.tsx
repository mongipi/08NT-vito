'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/ui/CookieConsent'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
    </div>
  )
}
