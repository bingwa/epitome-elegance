// src/app/api/admin/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()

  // Clear admin auth cookie
  cookieStore.set('admin_token', '', {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
  })

  return NextResponse.json({ message: 'Logged out' }, { status: 200 })
}
