import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const role = (req.auth?.user as { role?: string } | undefined)?.role

  if (pathname.startsWith('/admin')) {
    if (!req.auth) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  const protectedPaths = ['/account', '/checkout']
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !req.auth) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/admin/:path*'],
}
