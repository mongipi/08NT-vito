import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat, Great_Vibes } from 'next/font/google'
import { Providers } from './providers'
import { SiteShell } from './_components/SiteShell'
import { organizationJsonLd } from '@/lib/jsonld'
import { getPublicSiteSettings } from '@/lib/site-settings'
import { getProductNavLinks } from '@/services/products'
import './globals.css'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '08 Natural Technology — Integratori alimentari Made in Italy',
    template: '%s | 08 Natural Technology',
  },
  description:
    'Integratori alimentari di eccellenza formulati con ingredienti selezionati. Prodotto e confezionato in Italia da VIPHARMA di Tatulli Vito & Co. S.A.S., Bitonto (BA).',
  keywords: ['integratori', 'naturali', 'made in italy', 'menopausa', 'microcircolo', 'beauty'],
  authors: [{ name: '08 Natural Technology' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: '08 Natural Technology',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, footerProducts] = await Promise.all([
    getPublicSiteSettings(),
    getProductNavLinks(),
  ])

  return (
    <html
      lang="it"
      className={`${montserrat.variable} ${cormorant.variable} ${greatVibes.variable} h-full`}
      style={{ fontFamily: 'var(--font-montserrat), system-ui, sans-serif' }}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <Providers siteSettings={siteSettings}>
          <SiteShell footerProducts={footerProducts}>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  )
}
