'use client'
import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Eye, Search } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  total: number
  status: string
  fulfillmentStatus: string
  paymentStatus: string
  createdAt: Date
  items: any[]
}

export default function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(filter.toLowerCase()) ||
      order.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      order.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      order.email.toLowerCase().includes(filter.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-emerald-100 text-emerald-800',
      CANCELLED: 'bg-red-100 text-red-800',
      FAILED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search orders..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      
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
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-display font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-display font-semibold text-gray-900">#{order.orderNumber}</p>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{order.firstName} {order.lastName}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  KSh {order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.fulfillmentStatus)}`}>
                    {order.fulfillmentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center space-x-1 text-sm text-gray-900 hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  )
}
