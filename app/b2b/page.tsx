import type { Metadata } from 'next'
import { B2BContent } from './B2BContent'

export const metadata: Metadata = { title: 'B2B - Diventa Rivenditore' }

export default function B2BPage() {
  return <B2BContent />
}
