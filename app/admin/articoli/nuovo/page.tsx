import Link from 'next/link'
import { createArticle } from '@/lib/actions/admin/articles'
import { ArticleForm } from '../_ArticleForm'

export const metadata = { title: 'Nuovo articolo' }

export default function NuovoArticoloPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/articoli" className="text-sm text-[#6b7280] hover:text-[#111827]">← Articoli</Link>
        <span className="text-[#d1d5db]">/</span>
        <span className="text-sm font-medium text-[#111827]">Nuovo articolo</span>
      </div>
      <ArticleForm action={createArticle} />
    </div>
  )
}
