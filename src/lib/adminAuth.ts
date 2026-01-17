import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function getAdminUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as any
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const admin = await getAdminUser()
  if (!admin) {
    throw new Error('Unauthorized')
  }
  return admin
}
