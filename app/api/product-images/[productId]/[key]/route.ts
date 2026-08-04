import { NextRequest, NextResponse } from 'next/server'
import { findProductImage } from '@/services/product-images'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string; key: string }> }
) {
  const { productId, key } = await params

  const image = await findProductImage(productId, key)
  if (!image) return new NextResponse(null, { status: 404 })

  return new NextResponse(image.data, {
    headers: {
      'Content-Type': image.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
