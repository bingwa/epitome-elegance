'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon, TruckIcon, CubeIcon  } from '@heroicons/react/24/outline'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderTrackingProps {
  order: any
}

const trackingSteps = [
  {
    id: 'ORDER_PLACED',
    title: 'Order Placed',
    description: 'Your order has been confirmed',
    icon: CheckCircleIcon,
  },
  {
    id: 'PAYMENT_CONFIRMED',
    title: 'Payment Confirmed',
    description: 'Payment received via M-Pesa',
    icon: CheckCircleIcon,
  },
  {
    id: 'PROCESSING',
    title: 'Processing',
    description: 'Your order is being prepared',
    icon: CubeIcon,
  },
  {
    id: 'SHIPPED',
    title: 'Shipped',
    description: 'Your order is on its way',
    icon: TruckIcon,
  },
  {
    id: 'DELIVERED',
    title: 'Delivered',
    description: 'Order delivered successfully',
    icon: CheckCircleIcon,
  }
]

export function OrderTracking({ order }: OrderTrackingProps) {
  const getStepStatus = (stepId: string) => {
    const tracking = order.tracking.find((t: any) => t.status === stepId)
    if (tracking) return 'completed'
    
    // Simple logic for current step based on order status
    const currentStatuses = ['ORDER_PLACED', 'PAYMENT_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
    const orderStatusIndex = currentStatuses.indexOf(order.status)
    const stepIndex = currentStatuses.indexOf(stepId)
    
    if (stepIndex <= orderStatusIndex) return 'completed'
    if (stepIndex === orderStatusIndex + 1) return 'current'
    return 'pending'
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-strong rounded-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-black text-white px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-300">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-gold-500 text-black px-4 py-2 rounded-full inline-block">
                <span className="font-semibold uppercase text-sm tracking-wide">
                  {order.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-display font-bold text-black mb-4">Order Information</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium text-black">{order.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-medium text-black">{order.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-black">M-Pesa</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-xl text-black">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-black mb-4">Delivery Address</h3>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-black">
                  {order.shippingFirstName} {order.shippingLastName}
                </p>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingCounty}</p>
                <p>{order.shippingPhone}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="mb-12">
            <h3 className="text-2xl font-display font-bold text-black mb-8">Order Progress</h3>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-8">
                {trackingSteps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  const tracking = order.tracking.find((t: any) => t.status === step.id)
                  const Icon = step.icon
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative flex items-start space-x-6"
                    >
                      {/* Icon */}
                      <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                        status === 'completed' 
                          ? 'bg-gold-500 border-gold-500 text-black' 
                          : status === 'current'
                          ? 'bg-white border-gold-500 text-gold-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-lg font-semibold ${
                            status === 'completed' || status === 'current' 
                              ? 'text-black' 
                              : 'text-gray-400'
                          }`}>
                            {step.title}
                          </h4>
                          {tracking && (
                            <span className="text-sm text-gray-500">
                              {formatDate(tracking.createdAt)}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          status === 'completed' || status === 'current' 
                            ? 'text-gray-600' 
                            : 'text-gray-400'
                        }`}>
                          {tracking?.description || step.description}
                        </p>
                        {tracking?.location && (
                          <p className="text-sm text-gold-600 font-medium mt-1">
                            📍 {tracking.location}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t-2 border-gray-100 pt-8">
            <h3 className="text-2xl font-display font-bold text-black mb-6">Order Items</h3>
            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-6 p-6 bg-accent-cream rounded-lg">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-black text-lg">{item.name}</h4>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-xl text-black">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t-2 border-gray-100 pt-8 mt-8">
            <div className="max-w-md ml-auto space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (16%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3 flex justify-between font-bold text-xl text-black">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t-2 border-gray-100">
            <a
              href="/"
              className="flex-1 text-center bg-black text-white py-4 px-6 font-semibold hover:bg-gold-500 hover:text-black transition-colors"
            >
              Continue Shopping
            </a>
            <a
              href={`mailto:support@epitomeelegance.co.ke?subject=Order ${order.orderNumber} Inquiry`}
              className="flex-1 text-center border-2 border-black text-black py-4 px-6 font-semibold hover:bg-black hover:text-white transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
