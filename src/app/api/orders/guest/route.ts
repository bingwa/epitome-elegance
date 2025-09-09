import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber, formatPhoneNumber, validateKenyanPhone } from '@/lib/utils'
import { z } from 'zod'

const guestOrderSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().refine(validateKenyanPhone),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingCounty: z.string().min(2),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().min(1),
    price: z.number(),
    name: z.string(),
    image: z.string()
  })),
  subtotal: z.number(),
  vat: z.number(),
  shipping: z.number(),
  total: z.number(),
  sessionId: z.string()
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = guestOrderSchema.parse(body)

    // Check product availability
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.name} is no longer available` },
          { status: 400 }
        )
      }

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId)
        if (!variant || variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${item.name}` },
            { status: 400 }
          )
        }
      } else if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        )
      }
    }

    // Create the order
    const orderNumber = generateOrderNumber()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: formatPhoneNumber(validatedData.phone),
        sessionId: validatedData.sessionId,
        
        // Shipping details
        shippingFirstName: validatedData.firstName,
        shippingLastName: validatedData.lastName,
        shippingAddress: validatedData.shippingAddress,
        shippingCity: validatedData.shippingCity,
        shippingCounty: validatedData.shippingCounty,
        shippingPhone: formatPhoneNumber(validatedData.phone),
        
        // Order totals
        subtotal: validatedData.subtotal,
        tax: validatedData.vat,
        shipping: validatedData.shipping,
        total: validatedData.total,
        currency: 'KSH',
        
        status: 'PENDING',
        paymentStatus: 'PENDING',
        
        // Create order items
        items: {
          create: validatedData.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Update inventory
    for (const item of validatedData.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } }
        })
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } }
        })
      }
    }

    // Create initial tracking entry
    await prisma.orderTracking.create({
      data: {
        orderId: order.id,
        status: 'ORDER_PLACED',
        description: 'Order has been placed and is awaiting payment',
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        email: order.email
      }
    })

  } catch (error) {
    console.error('Guest order creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid order data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
