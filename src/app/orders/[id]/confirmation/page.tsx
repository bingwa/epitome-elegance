import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { OrderConfirmation } from '@/components/order/OrderConfirmation'

interface OrderConfirmationPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    checkout_request_id?: string
  }>
}

async function getOrder(orderId: string) {
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

export default async function OrderConfirmationPage({ 
  params, 
  searchParams 
}: OrderConfirmationPageProps) {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  
  const order = await getOrder(id)
  
  if (!order) {
    notFound()
  }

  return (
    <OrderConfirmation 
      order={order}
      checkoutRequestId={resolvedSearchParams.checkout_request_id}
    />
  )
}
