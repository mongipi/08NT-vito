import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // typedRoutes: true  ← da riabilitare quando tutte le route sono implementate
}

export default nextConfig
