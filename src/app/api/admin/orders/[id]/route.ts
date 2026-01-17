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

// PATCH update order (fulfillment status, tracking, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const admin = await verifyAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const data = await request.json()
    
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: params.id }
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Prepare update data
    const updateData: any = {}
    
    if (data.fulfillmentStatus) {
      updateData.fulfillmentStatus = data.fulfillmentStatus
      
      // Set timestamps based on status
      if (data.fulfillmentStatus === 'SHIPPED') {
        updateData.shippedAt = new Date()
        if (data.trackingNumber) {
          updateData.trackingNumber = data.trackingNumber
        }
      } else if (data.fulfillmentStatus === 'DELIVERED') {
        updateData.deliveredAt = new Date()
      }
    }
    
    if (data.payoutStatus) {
      updateData.payoutStatus = data.payoutStatus
    }
    
    if (data.payoutDate) {
      updateData.payoutDate = new Date(data.payoutDate)
    }
    
    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData
    })
    
    // Create tracking event
    if (data.fulfillmentStatus) {
      const statusDescriptions: Record<string, string> = {
        PENDING: 'Order received and awaiting processing',
        PROCESSING: 'Order is being prepared for shipment',
        SHIPPED: `Order has been shipped${data.trackingNumber ? ` with tracking number ${data.trackingNumber}` : ''}`,
        DELIVERED: 'Order has been delivered successfully',
        CANCELLED: 'Order has been cancelled'
      }
      
      await prisma.orderTracking.create({
        data: {
          orderId: params.id,
          status: data.fulfillmentStatus,
          description: statusDescriptions[data.fulfillmentStatus] || data.fulfillmentStatus,
          location: 'Warehouse'
        }
      })
    }
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
