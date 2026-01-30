import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import AdminLayoutClient from './AdminLayoutClient'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    redirect('/admin-login')
  }

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET!)
  } catch {
    redirect('/admin-login')
  }

  // Wrap with AdminLayoutClient (was missing!)
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
