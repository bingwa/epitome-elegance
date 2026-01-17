import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Order {
  id: string
  orderNumber: string
  firstName: string
  lastName: string
  total: number
  status: string
  createdAt: Date
}

interface RecentOrdersProps {
  orders: Order[]
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-emerald-100 text-emerald-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-bold text-gray-900">Recent Orders</h3>
        <Link href="/admin/orders" className="text-sm text-gray-900 hover:underline">
          View all
        </Link>
      </div>
      
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="block p-4 rounded-lg hover:bg-gray-50 transition border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-gray-900">
                  {order.firstName} {order.lastName}
                </p>
                <p className="text-sm text-gray-500">#{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">KSh {order.total.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
