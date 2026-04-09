import { NextResponse } from 'next/server'

export function middleware() {
  // Development mode - allow all requests
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
