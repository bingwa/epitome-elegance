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

// GET - Fetch all payouts with filters
export async function GET(request: Request) {
  try {
    await verifyAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all' // all, pending, completed, failed
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (status !== 'all') {
      where.payoutStatus = status.toUpperCase()
    }

    // Fetch payouts (stored on orders)
    const orders = await prisma.order.findMany({
      where: {
        ...where,
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        createdAt: true,
        payoutStatus: true,
        payoutAmount: true,
        payoutDate: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const payouts = orders.map((order) => ({
      id: order.id,
      orderId: order.id,
      amount: order.payoutAmount ?? order.total,
      status: order.payoutStatus,
      createdAt: order.payoutDate ?? order.createdAt,
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        createdAt: order.createdAt,
      },
    }))

    // Get total count
    const totalCount = await prisma.order.count({ where })

    // Calculate stats
    const stats = {
      totalPayouts: totalCount,
      pending: await prisma.order.count({ where: { payoutStatus: 'PENDING' } }),
      completed: await prisma.order.count({ where: { payoutStatus: 'COMPLETED' } }),
      failed: await prisma.order.count({ where: { payoutStatus: 'FAILED' } }),
      totalAmount: await prisma.order.aggregate({
        _sum: { payoutAmount: true },
        where: { payoutStatus: 'COMPLETED' },
      }),
    }

    return NextResponse.json({
      payouts,
      pagination: {
        current: page,
        pages: Math.ceil(totalCount / limit),
        total: totalCount,
        limit,
      },
      stats: {
        ...stats,
        totalAmount: stats.totalAmount._sum.payoutAmount || 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching payouts:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}

// POST - Create a new payout
export async function POST(request: Request) {
  try {
    await verifyAdmin()

    const data = await request.json()

    // Validate required fields
    if (!data.orderId || !data.amount) {
      return NextResponse.json(
        { error: 'Order ID and amount are required' },
        { status: 400 }
      )
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if payout already exists for this order
    if (order.payoutAmount !== null && order.payoutAmount !== undefined) {
      return NextResponse.json(
        { error: 'Payout already exists for this order' },
        { status: 400 }
      )
    }

    const payoutOrder = await prisma.order.update({
      where: { id: data.orderId },
      data: {
        payoutAmount: parseFloat(data.amount),
        payoutStatus: data.status || 'PENDING',
        payoutDate: data.payoutDate ? new Date(data.payoutDate) : new Date(),
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        createdAt: true,
        payoutStatus: true,
        payoutAmount: true,
        payoutDate: true,
      },
    })

    const payout = {
      id: payoutOrder.id,
      orderId: payoutOrder.id,
      amount: payoutOrder.payoutAmount ?? payoutOrder.total,
      status: payoutOrder.payoutStatus,
      createdAt: payoutOrder.payoutDate ?? payoutOrder.createdAt,
      order: {
        orderNumber: payoutOrder.orderNumber,
        total: payoutOrder.total,
        createdAt: payoutOrder.createdAt,
      },
    }

    return NextResponse.json(payout, { status: 201 })
  } catch (error: any) {
    console.error('Error creating payout:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create payout' },
      { status: 500 }
    )
  }
}

// PATCH - Update payout status
export async function PATCH(request: Request) {
  try {
    await verifyAdmin()

    const data = await request.json()
    const { id, status, notes, transactionId } = data

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Payout ID and status are required' },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const payoutOrder = await prisma.order.update({
      where: { id },
      data: {
        payoutStatus: status,
        payoutDate: status === 'COMPLETED' ? new Date() : undefined,
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        createdAt: true,
        payoutStatus: true,
        payoutAmount: true,
        payoutDate: true,
      },
    })

    const payout = {
      id: payoutOrder.id,
      orderId: payoutOrder.id,
      amount: payoutOrder.payoutAmount ?? payoutOrder.total,
      status: payoutOrder.payoutStatus,
      createdAt: payoutOrder.payoutDate ?? payoutOrder.createdAt,
      order: {
        orderNumber: payoutOrder.orderNumber,
        total: payoutOrder.total,
        createdAt: payoutOrder.createdAt,
      },
    }

    return NextResponse.json(payout)
  } catch (error: any) {
    console.error('Error updating payout:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Payout not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500 }
    )
  }
}
