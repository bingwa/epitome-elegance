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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdmin()

    const data = await request.json()
    const productId = params.id

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true, variants: true },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Use first selected category as primary
    const primaryCategoryId = data.categoryIds?.[0]

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc || null,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        sku: data.sku,
        stockQuantity: parseInt(data.stockQuantity) || 0,
        brand: data.brand || null,
        tags: data.tags || null,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        // Update category
        category: primaryCategoryId ? {
          connect: { id: primaryCategoryId },
        } : undefined,
        // Delete old images and create new ones
        images: {
          deleteMany: {},
          create: data.images?.map((url: string, index: number) => ({
            url,
            altText: `${data.name} - Image ${index + 1}`,
            isMain: index === 0,
          })) || [],
        },
        // Delete old variants and create new ones
        variants: {
          deleteMany: {},
          create: data.variants?.map((variant: any) => ({
            size: variant.size || null,
            color: variant.color || null,
            colorHex: null,
            stock: parseInt(variant.stock) || 0,
            price: parseFloat(variant.price) || parseFloat(data.price),
            sku: data.sku,
          })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this SKU or slug already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdmin()

    const productId = params.id

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting product:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
