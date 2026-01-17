// src/app/api/admin/products/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/auth'

export async function POST(request: Request) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const data = await request.json()
  
  // Create product with variants and images
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      images: {
        create: data.images.map((url, index) => ({
          url,
          altText: data.name,
          order: index
        }))
      },
      variants: data.variants ? {
        create: data.variants
      } : undefined
    }
  })
  
  return NextResponse.json(product)
}
