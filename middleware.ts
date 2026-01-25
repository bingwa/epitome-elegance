import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
    
    console.log('Middleware - Path:', path)
    console.log('Middleware - Token exists:', !!token)
    
    if (!token) {
      console.log('No token found, redirecting to login')
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    
    // Token exists, allow access
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
  
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
