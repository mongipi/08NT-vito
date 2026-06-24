import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { updateProduct, deleteProduct } from '@/lib/actions/admin/products'
import { ProductForm } from '../_ProductForm'

export default async function EditProdottoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, lines] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { line: true, ingredients: { orderBy: { order: 'asc' } } } }),
    prisma.line.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!product) notFound()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/prodotti" className="text-sm text-[#6b7280] hover:text-[#111827]">← Prodotti</Link>
        <span className="text-[#d1d5db]">/</span>
        <span className="text-sm font-medium text-[#111827]">{product.name}</span>
      </div>
      <ProductForm lines={lines} action={updateProduct} product={product} deleteAction={deleteProduct} />
    </div>
  )
}
