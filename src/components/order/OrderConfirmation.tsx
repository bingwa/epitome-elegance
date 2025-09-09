'use client'

import { useEffect, useState } from 'react'
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { formatPrice, formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

interface OrderConfirmationProps {
  order: any
  checkoutRequestId?: string
}

export function OrderConfirmation({ order, checkoutRequestId }: OrderConfirmationProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [isChecking, setIsChecking] = useState(!!checkoutRequestId)

  useEffect(() => {
    if (checkoutRequestId && order.paymentStatus === 'PENDING') {
      // Check payment status every 5 seconds for up to 2 minutes
      const checkPayment = async () => {
        try {
          const response = await fetch(`/api/orders/${order.id}/payment-status`)
          const data = await response.json()
          
          if (data.paymentStatus === 'PAID') {
            setPaymentStatus('success')
            setIsChecking(false)
          } else if (data.paymentStatus === 'FAILED') {
            setPaymentStatus('failed')
            setIsChecking(false)
          }
        } catch (error) {
          console.error('Payment status check failed:', error)
        }
      }

      const interval = setInterval(checkPayment, 5000)
      const timeout = setTimeout(() => {
        clearInterval(interval)
        setIsChecking(false)
        if (paymentStatus === 'pending') {
          setPaymentStatus('failed')
        }
      }, 120000) // 2 minutes

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    } else {
      setPaymentStatus(order.paymentStatus === 'PAID' ? 'success' : 'failed')
      setIsChecking(false)
    }
  }, [checkoutRequestId, order.id, order.paymentStatus, paymentStatus])

  const getStatusIcon = () => {
    if (isChecking) {
      return <ClockIcon className="h-12 w-12 text-yellow-500 animate-pulse" />
    }
    if (paymentStatus === 'success') {
      return <CheckCircleIcon className="h-12 w-12 text-green-500" />
    }
    return <XCircleIcon className="h-12 w-12 text-red-500" />
  }

  const getStatusMessage = () => {
    if (isChecking) {
      return {
        title: 'Processing Payment...',
        message: 'Please complete the M-Pesa payment on your phone. This page will update automatically.',
        color: 'text-yellow-700'
      }
    }
    if (paymentStatus === 'success') {
      return {
        title: 'Order Confirmed!',
        message: 'Thank you for your purchase. Your order has been confirmed and will be processed soon.',
        color: 'text-green-700'
      }
    }
    return {
      title: 'Payment Failed',
      message: 'We could not process your payment. Please try again or contact support.',
      color: 'text-red-700'
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gray-50 px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h1 className={`text-2xl font-bold ${statusInfo.color} mb-2`}>
            {statusInfo.title}
          </h1>
          <p className="text-gray-600">
            {statusInfo.message}
          </p>
          
          {isChecking && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-800">
                Check your phone for the M-Pesa payment request. Enter your PIN to complete the payment.
              </p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>M-Pesa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    paymentStatus === 'success' ? 'text-green-600' :
                    paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {paymentStatus === 'success' ? 'Confirmed' :
                     paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{order.shippingFirstName} {order.shippingLastName}</p>
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}, {order.shippingCounty}</p>
                <p>{order.shippingPhone}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (16%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row gap-4">
            {paymentStatus === 'failed' && (
              <button className="flex-1 bg-gold-600 text-white py-3 px-6 rounded-md hover:bg-gold-700 transition-colors">
                Try Payment Again
              </button>
            )}
            
            <a
              href={`/orders/${order.id}/track`}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors text-center"
            >
              Track Order
            </a>
            
            <a
              href="/"
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors text-center"
            >
              Continue Shopping
            </a>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6 mt-6 text-center text-sm text-gray-600">
            <p>
              Need help? Contact us at{' '}
              <a href="mailto:support@epitomeelegance.co.ke" className="text-gold-600 hover:underline">
                support@epitomeelegance.co.ke
              </a>{' '}
              or call{' '}
              <a href="tel:+254700000000" className="text-gold-600 hover:underline">
                +254 700 000 000
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
