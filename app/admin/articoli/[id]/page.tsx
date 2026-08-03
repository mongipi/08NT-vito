import { getArticleById } from '@/services/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updateArticle, deleteArticle } from '@/lib/actions/admin/articles'
import { ArticleForm } from '../_ArticleForm'

export default async function EditArticoloPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticleById(id)
  if (!article) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/articoli" className="text-sm text-[#6b7280] hover:text-[#111827]">← Articoli</Link>
        <span className="text-[#d1d5db]">/</span>
        <span className="text-sm font-medium text-[#111827]">{article.title}</span>
      </div>
      <ArticleForm action={updateArticle} article={article} deleteAction={deleteArticle} />
    </div>
  )
}
