// src/lib/auth.ts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return null
  
  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) return null
  
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  return { token, admin: { id: admin.id, name: admin.name, email: admin.email } }
}

export async function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch {
    return null
  }
}
