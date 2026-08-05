import { getLines } from '@/services/lines'
import Link from 'next/link'
import { createProduct } from '@/lib/actions/admin/products'
import { ProductForm } from '../_ProductForm'

export const metadata = { title: 'Nuovo prodotto' }

export default async function NuovoProdottoPage() {
  const lines = await getLines()
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/prodotti" className="text-sm text-[#6b7280] hover:text-[#111827]">← Prodotti</Link>
        <span className="text-[#d1d5db]">/</span>
        <span className="text-sm font-medium text-[#111827]">Nuovo prodotto</span>
      </div>
      <ProductForm lines={lines} action={createProduct} />
    </div>
  )
}
