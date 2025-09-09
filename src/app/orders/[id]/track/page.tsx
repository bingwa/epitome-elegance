import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { OrderTracking } from '@/components/order/OrderTracking'

interface OrderTrackingPageProps {
  params: Promise<{
    id: string
  }>
}

async function getOrderWithTracking(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true }
          }
        }
      },
      tracking: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params
  const order = await getOrderWithTracking(id)
  
  if (!order) {
    notFound()
  }

  return (
    <OrderTracking order={order} />
  )
}
