const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://08naturaltechnology.it'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '08 Natural Technology',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Integratori alimentari di eccellenza formulati con ingredienti selezionati. Prodotto in Italia da VIPHARMA di Tatulli Vito & Co. S.A.S., Bitonto (BA).',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: 'Bitonto',
      addressRegion: 'BA',
      addressCountry: 'IT',
    },
  }
}

export function productJsonLd(product: {
  name: string
  slug: string
  shortDescription: string
  price: number
  stock: number
  images?: { fronte?: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    url: `${SITE_URL}/prodotti/${product.slug}`,
    image: product.images?.fronte ? `${SITE_URL}${product.images.fronte}` : undefined,
    brand: { '@type': 'Brand', name: '08 Natural Technology' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: '08 Natural Technology' },
    },
  }
}

export function articleJsonLd(article: {
  title: string
  slug: string
  excerpt: string
  publishedAt: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_URL}/blog/${article.slug}`,
    datePublished: article.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: '08 Natural Technology',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
  }
}
