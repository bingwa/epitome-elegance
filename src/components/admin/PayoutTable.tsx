'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  firstName: string
  lastName: string
  total: number
  payoutStatus: string
  mpesaReceiptId: string | null
  createdAt: Date
  payoutDate: Date | null
}

export default function PayoutTable({ orders: initialOrders }: { orders: Order[] }) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState<string | null>(null)
  
  const markAsPaid = async (orderId: string) => {
    setLoading(orderId)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          payoutStatus: 'COMPLETED',
          payoutDate: new Date().toISOString()
        })
      })
      
      if (res.ok) {
        toast.success('Payout marked as completed')
        router.refresh()
      } else {
        toast.error('Failed to update payout')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(null)
    }
  }
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                M-Pesa Receipt
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-display font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-display font-semibold text-gray-900">#{order.orderNumber}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.firstName} {order.lastName}
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {order.mpesaReceiptId || 'N/A'}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  KSh {order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.payoutDate 
                    ? format(new Date(order.payoutDate), 'PP')
                    : format(new Date(order.createdAt), 'PP')
                  }
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.payoutStatus)}`}>
                    {order.payoutStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {order.payoutStatus === 'PENDING' && (
                    <button
                      onClick={() => markAsPaid(order.id)}
                      disabled={loading === order.id}
                      className="text-sm text-green-600 hover:underline font-display disabled:opacity-50"
                    >
                      {loading === order.id ? 'Processing...' : 'Mark Paid'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {orders.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">No payout records found</p>
        </div>
      )}
    </div>
  )
}
