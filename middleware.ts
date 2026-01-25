import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', path)
  
  // Allow admin-login page
  if (path === '/admin-login') {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
  
  // Protect admin routes
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    
    try {
      jwt.verify(token, process.env.ADMIN_JWT_SECRET!)
      return NextResponse.next({ request: { headers: requestHeaders } })
    } catch {
      const response = NextResponse.redirect(new URL('/admin-login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }
  
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
