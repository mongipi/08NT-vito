import type { Metadata } from 'next'
import { MetodoContent } from './MetodoContent'

export const metadata: Metadata = {
  title: 'Qualità 08 - 08 Natural Technology',
  description: 'Qualità 08 Natural Technology: storia, valori, qualità, Made in Italy e promessa del marchio.',
}

export default function MetodoPage() {
  return <MetodoContent />
}
