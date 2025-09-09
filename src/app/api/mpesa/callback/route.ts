import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const callbackData = await req.json()
    console.log('M-Pesa Callback:', callbackData)

    const { Body } = callbackData
    const { stkCallback } = Body

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata
    } = stkCallback

    // Extract order ID from callback metadata or AccountReference
    const accountReference = CallbackMetadata?.Item?.find(
      (item: any) => item.Name === 'AccountReference'
    )?.Value

    if (!accountReference) {
      console.error('No account reference found in callback')
      return NextResponse.json({ error: 'No account reference' }, { status: 400 })
    }

    const order = await prisma.order.findFirst({
      where: { id: accountReference }
    })

    if (!order) {
      console.error('Order not found:', accountReference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (ResultCode === 0) {
      // Payment successful
      const amount = CallbackMetadata?.Item?.find(
        (item: any) => item.Name === 'Amount'
      )?.Value

      const mpesaReceiptNumber = CallbackMetadata?.Item?.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value

      const phoneNumber = CallbackMetadata?.Item?.find(
        (item: any) => item.Name === 'PhoneNumber'
      )?.Value

      // Update order status to paid (removed stripePaymentId field)
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PROCESSING',
          paymentStatus: 'PAID',
          // Store M-Pesa receipt number in notes or a proper field if it exists
          notes: `M-Pesa Receipt: ${mpesaReceiptNumber}`,
          updatedAt: new Date()
        }
      })

      // Create order tracking entry
      await prisma.orderTracking.create({
        data: {
          orderId: order.id,
          status: 'PAYMENT_CONFIRMED',
          description: `Payment of KSh ${amount} confirmed via M-Pesa. Receipt: ${mpesaReceiptNumber}`,
          createdAt: new Date()
        }
      })

      console.log(`Payment confirmed for order ${order.orderNumber}`)
    } else {
      // Payment failed
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'FAILED',
          updatedAt: new Date()
        }
      })

      await prisma.orderTracking.create({
        data: {
          orderId: order.id,
          status: 'PAYMENT_FAILED',
          description: `Payment failed: ${ResultDesc}`,
          createdAt: new Date()
        }
      })

      console.log(`Payment failed for order ${order.orderNumber}: ${ResultDesc}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Callback processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
