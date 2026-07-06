'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/contexts/CartContext'
import { LocaleProvider } from '@/contexts/LocaleContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleProvider>
        <CartProvider>{children}</CartProvider>
      </LocaleProvider>
    </SessionProvider>
  )
}
