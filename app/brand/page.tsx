import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Brand' }

export default function BrandPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'var(--font-montserrat)' }}>
      <p>🚧 Brand</p>
    </main>
  )
}
