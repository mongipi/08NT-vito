'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/ui/CookieConsent'
import { TranslationBridge } from '@/components/ui/TranslationBridge'
import { NewsletterPopup } from '@/components/ui/NewsletterSignup'
import { ChatWidget } from '@/components/ui/ChatWidget'

export function SiteShell({
  children,
  footerProducts,
}: {
  children: React.ReactNode
  footerProducts: { name: string; slug: string }[]
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      {children}
      <Footer products={footerProducts} />
      <CookieConsent />
      <NewsletterPopup />
      <TranslationBridge />
      <ChatWidget />
    </div>
  )
}
