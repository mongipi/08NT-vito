import type { Metadata } from 'next'
import { ContattiContent } from './ContattiContent'

export const metadata: Metadata = { title: 'Contatti' }

export default function ContattiPage() {
  return <ContattiContent />
}
