'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SearchInput({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      router.replace(value ? `${pathname}?q=${encodeURIComponent(value)}` : pathname)
    }, 300)
    return () => clearTimeout(timer.current)
  }, [value, pathname, router])

  return (
    <div style={{ position: 'relative', maxWidth: '22rem', marginBottom: '1rem' }}>
      <svg
        width="0.875rem" height="0.875rem" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"
        style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '0.5625rem 0.875rem 0.5625rem 2.25rem',
          fontSize: '0.8125rem', color: '#111827',
          border: '1px solid #e5e7eb', borderRadius: '0.4375rem', outline: 'none',
        }}
      />
    </div>
  )
}
