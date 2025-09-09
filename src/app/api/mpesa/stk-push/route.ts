import { NextRequest, NextResponse } from 'next/server'
import { mpesaService } from '@/lib/mpesa'
import { prisma } from '@/lib/prisma'
import { formatPhoneNumber, validateKenyanPhone } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, orderId, description } = await req.json()

    // Validate input
    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format and validate phone number
    const formattedPhone = formatPhoneNumber(phoneNumber)
    if (!validateKenyanPhone(formattedPhone)) {
      return NextResponse.json(
        { error: 'Invalid Kenyan phone number' },
        { status: 400 }
      )
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Initiate STK push
    const result = await mpesaService.initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: parseFloat(amount),
      orderId,
      description: description || `Payment for order ${order.orderNumber}`
    })

    if (result.success) {
      // Update order with checkout request ID
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING',
          paymentMethod: 'MPESA'
        }
      })

      return NextResponse.json({
        success: true,
        checkoutRequestId: result.checkoutRequestId,
        message: 'STK push sent successfully'
      })
    } else {
      return NextResponse.json(
        { error: result.errorMessage },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('STK push error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
