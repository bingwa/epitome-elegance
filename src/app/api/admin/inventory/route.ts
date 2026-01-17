import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!)
    return decoded
  } catch {
    return null
  }
}

// POST adjust inventory
export async function POST(request: Request) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { productId, adjustment, note } = await request.json()
    
    if (!productId || adjustment === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Get current product
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const newStock = product.stockQuantity + adjustment
    
    if (newStock < 0) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }
    
    // Update product stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newStock },
      include: {
        category: true,
        images: true,
        variants: true
      }
    })
    
    // Create history record
    await prisma.productHistory.create({
      data: {
        productId,
        action: adjustment > 0 ? 'ADDED' : 'ADJUSTED',
        quantity: adjustment,
        previousStock: product.stockQuantity,
        newStock,
        note: note || `Stock adjusted by ${adjustment}`,
        createdBy: (admin as any).email
      }
    })
    
    return NextResponse.json({ 
      message: 'Stock updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Error adjusting inventory:', error)
    return NextResponse.json({ error: 'Failed to adjust inventory' }, { status: 500 })
  }
}
