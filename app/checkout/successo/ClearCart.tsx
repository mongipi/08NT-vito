'use client'
import { useLayoutEffect } from 'react'

export function ClearCart() {
  useLayoutEffect(() => {
    try { localStorage.removeItem('08nt-cart') } catch {}
  }, [])
  return null
}
