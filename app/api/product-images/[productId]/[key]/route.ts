import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const KEY_MAP: Record<string, string> = {
  'fronte': 'fronte',
  'infografica': 'infografica',
  'lato-1': 'lato1',
  'lato-2': 'lato2',
  'etichetta': 'etichetta',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; key: string }> }
) {
  const { productId, key } = await params
  const dbKey = KEY_MAP[key] ?? key

  // productId può essere un id cuid o uno slug
  let image = await prisma.productImage.findUnique({
    where: { productId_key: { productId, key: dbKey } },
  })

  if (!image) {
    const product = await prisma.product.findUnique({ where: { slug: productId }, select: { id: true } })
    if (product) {
      image = await prisma.productImage.findUnique({
        where: { productId_key: { productId: product.id, key: dbKey } },
      })
    }
  }

  if (!image) return new NextResponse(null, { status: 404 })

  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
