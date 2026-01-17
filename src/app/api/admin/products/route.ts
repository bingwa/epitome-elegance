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

// Generate unique SKU
async function generateUniqueSKU(baseSKU: string): Promise<string> {

  let sku = baseSKU.toUpperCase().trim()
  let counter = 1
  
  // Check if base SKU exists
  const existing = await prisma.product.findUnique({ 
    where: { sku } 
  })
  
  if (!existing) {
    return sku
  }
  
  // If exists, append counter until we find a unique one
  while (true) {
    const newSku = `${sku}-${counter}`
    const exists = await prisma.product.findUnique({ 
      where: { sku: newSku } 
    })
    
    if (!exists) {
      return newSku
    }
    counter++
    
    // Safety check to prevent infinite loop
    if (counter > 1000) {
      throw new Error('Unable to generate unique SKU')
    }
  }
}

function buildVariantSku(base: string, idx: number, v: any) {
  const basePart = base.toUpperCase().trim()
  const sizePart = v.size ? `-${String(v.size).toUpperCase().replace(/\s+/g, '')}` : ''
  return `${basePart}${sizePart}-${idx + 1}`
}


export async function POST(request: Request) {
  try {
    await verifyAdmin()

    const data = await request.json()

    console.log('Received data:', data)

    // Validate required fields
    if (!data.name || !data.slug || !data.price || !data.sku) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, price, and SKU are required' },
        { status: 400 }
      )
    }

    // Validate at least one category is selected
    if (!data.categoryIds || data.categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one category' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (existingSlug) {
      return NextResponse.json(
        { error: `A product with slug "${data.slug}" already exists. Please use a different product name or modify the slug.` },
        { status: 400 }
      )
    }

    // Generate unique SKU if the provided one already exists
    console.log('Checking SKU:', data.sku)
    const uniqueSKU = await generateUniqueSKU(data.sku)
    console.log('Generated unique SKU:', uniqueSKU)

    // Use first selected category as primary
    const primaryCategoryId = data.categoryIds[0]

    // Create product with images and variants
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc || null,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        sku: uniqueSKU,
        stockQuantity: parseInt(data.stockQuantity) || 0,
        brand: data.brand || null,
        tags: data.tags || null,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        category: {
          connect: { id: primaryCategoryId },
        },
        images: {
          create: data.images?.map((url: string, index: number) => ({
            url,
            altText: `${data.name} - Image ${index + 1}`,
            isMain: index === 0,
          })) || [],
        },
        variants: {
  create: data.variants?.map((variant: any, index: number) => ({
    size: variant.size || null,
    color: variant.color || null,
    colorHex: null,
    stock: parseInt(variant.stock) || 0,
    price: parseFloat(variant.price) || parseFloat(data.price),
    sku: buildVariantSku(uniqueSKU, index, variant),
  })) || [],
},
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    })

    // Show message if SKU was modified
    if (uniqueSKU !== data.sku.toUpperCase().trim()) {
      console.log(`SKU was changed from "${data.sku}" to "${uniqueSKU}" to ensure uniqueness`)
    }

    return NextResponse.json({
      ...product,
      message: uniqueSKU !== data.sku.toUpperCase().trim() 
        ? `Product created with SKU "${uniqueSKU}" (original SKU "${data.sku}" was already in use)` 
        : 'Product created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating product:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      return NextResponse.json(
        { error: `A product with this ${field} already exists. Please use a different ${field}.` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await verifyAdmin()

    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        variants: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const productsWithRatings = products.map((product) => ({
      ...product,
      averageRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
          : 0,
      reviewCount: product.reviews.length,
    }))

    return NextResponse.json(productsWithRatings)
  } catch (error: any) {
    console.error('Error fetching products:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
