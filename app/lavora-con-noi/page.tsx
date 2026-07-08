import type { Metadata } from 'next'
import { LavoraConNoiContent } from './LavoraConNoiContent'

export const metadata: Metadata = {
  title: 'Lavora con noi - 08 Natural Technology',
  description: 'Opportunita di collaborazione con 08 Natural Technology per professionisti, consulenti e partner orientati al benessere.',
}

export default function LavoraConNoiPage() {
  return <LavoraConNoiContent />
}
