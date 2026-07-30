import type { Metadata } from 'next'
import { MetodoContent } from './MetodoContent'

export const metadata: Metadata = {
  title: 'Qualit\u00E0 08 - 08 Natural Technology',
  description:
    'Qualit\u00E0 08 Natural Technology: storia, valori, qualit\u00E0, Made in Italy e promessa del marchio.',
}

export default function MetodoPage() {
  return <MetodoContent />
}
