'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Truck, CheckCircle, XCircle } from 'lucide-react'

interface FulfillmentPanelProps {
  order: any
}

export default function FulfillmentPanel({ order }: FulfillmentPanelProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  
  const updateFulfillment = async (status: string, data: any = {}) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fulfillmentStatus: status, ...data })
      })
      
      if (res.ok) {
        toast.success('Order updated')
        router.refresh()
      } else {
        toast.error('Failed to update order')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-display font-bold text-lg mb-4">Fulfillment Actions</h2>
      
      <div className="space-y-4">
        {order.fulfillmentStatus === 'PENDING' && (
          <button
            onClick={() => updateFulfillment('PROCESSING')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Truck className="w-4 h-4" />
            <span>Start Processing</span>
          </button>
        )}
        
        {order.fulfillmentStatus === 'PROCESSING' && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
            />
            <button
              onClick={() => updateFulfillment('SHIPPED', { trackingNumber })}
              disabled={loading || !trackingNumber}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>Mark as Shipped</span>
            </button>
          </div>
        )}
        
        {order.fulfillmentStatus === 'SHIPPED' && (
          <button
            onClick={() => updateFulfillment('DELIVERED')}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Delivered</span>
          </button>
        )}
        
        {order.fulfillmentStatus !== 'CANCELLED' && order.fulfillmentStatus !== 'DELIVERED' && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to cancel this order?')) {
                updateFulfillment('CANCELLED')
              }
            }}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        )}
        
        {order.fulfillmentStatus === 'DELIVERED' && (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-green-800">Order Delivered</p>
          </div>
        )}
      </div>
    </div>
  )
}
