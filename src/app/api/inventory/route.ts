import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    throw new Error('Unauthorized')
  }

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET!)
    return true
  } catch {
    throw new Error('Unauthorized')
  }
}

export async function GET(request: Request) {
  try {
    await verifyAdmin()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all' // all, low, out
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.categoryId = category
    }

    // Fetch products with variants
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            stock: true,
            sku: true,
          },
        },
        images: {
          take: 1,
          orderBy: {
            isMain: 'desc',
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate inventory metrics
    const inventoryData = products.map((product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0) || product.stockQuantity
      const variantCount = product.variants.length

      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        category: product.category?.name || 'Uncategorized',
        categoryId: product.category?.id || null,
        image: product.images[0]?.url || null,
        price: product.price,
        stockQuantity: product.stockQuantity,
        totalStock,
        variantCount,
        variants: product.variants,
        isActive: product.isActive,
        status: totalStock === 0 ? 'out' : totalStock < 10 ? 'low' : 'in_stock',
      }
    })

    // Filter by stock status
    let filteredData = inventoryData
    if (status === 'low') {
      filteredData = inventoryData.filter((p) => p.status === 'low')
    } else if (status === 'out') {
      filteredData = inventoryData.filter((p) => p.status === 'out')
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })

    // Calculate overall inventory stats
    const stats = {
      totalProducts: totalCount,
      lowStock: inventoryData.filter((p) => p.status === 'low').length,
      outOfStock: inventoryData.filter((p) => p.status === 'out').length,
      inStock: inventoryData.filter((p) => p.status === 'in_stock').length,
      totalValue: inventoryData.reduce((sum, p) => sum + p.price * p.totalStock, 0),
      totalUnits: inventoryData.reduce((sum, p) => sum + p.totalStock, 0),
    }

    return NextResponse.json({
      inventory: filteredData,
      pagination: {
        current: page,
        pages: Math.ceil(totalCount / limit),
        total: totalCount,
        limit,
      },
      stats,
    })
  } catch (error: any) {
    console.error('Error fetching inventory:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    await verifyAdmin()

    const data = await request.json()
    const { productId, variantId, stock } = data

    if (!productId || stock === undefined) {
      return NextResponse.json(
        { error: 'Product ID and stock are required' },
        { status: 400 }
      )
    }

    if (variantId) {
      // Update variant stock
      const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: parseInt(stock) },
      })

      return NextResponse.json({
        message: 'Variant stock updated',
        variant,
      })
    } else {
      // Update product stock
      const product = await prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: parseInt(stock) },
      })

      return NextResponse.json({
        message: 'Product stock updated',
        product,
      })
    }
  } catch (error: any) {
    console.error('Error updating inventory:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}

// Bulk update stock levels
export async function POST(request: Request) {
  try {
    await verifyAdmin()

    const { updates } = await request.json()

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      )
    }

    // Process bulk updates
    const results = await Promise.all(
      updates.map(async (update: any) => {
        if (update.variantId) {
          return await prisma.productVariant.update({
            where: { id: update.variantId },
            data: { stock: parseInt(update.stock) },
          })
        } else if (update.productId) {
          return await prisma.product.update({
            where: { id: update.productId },
            data: { stockQuantity: parseInt(update.stock) },
          })
        }
      })
    )

    return NextResponse.json({
      message: `${results.length} items updated`,
      results,
    })
  } catch (error: any) {
    console.error('Error bulk updating inventory:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to bulk update inventory' },
      { status: 500 }
    )
  }
}
