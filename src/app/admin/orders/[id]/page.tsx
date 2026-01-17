import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FulfillmentPanel from '@/components/admin/FulfillmentPanel'
import { Package, MapPin, CreditCard, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
          variant: true
        }
      },
      tracking: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!order) notFound()
  
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">
            Placed {format(new Date(order.createdAt), 'PPP p')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm rounded-full ${
            order.paymentStatus === 'PAID' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.paymentStatus}
          </span>
          <span className={`px-3 py-1 text-sm rounded-full ${
            order.fulfillmentStatus === 'DELIVERED'
              ? 'bg-emerald-100 text-emerald-800'
              : order.fulfillmentStatus === 'SHIPPED'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {order.fulfillmentStatus}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Order Items</span>
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-display font-semibold">{item.name}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-600">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.color && ` • Color: ${item.variant.color}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">KSh {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">KSh {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">KSh {order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (VAT)</span>
                <span className="font-semibold">KSh {order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>KSh {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Tracking History */}
          {order.tracking.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Tracking History</span>
              </h2>
              <div className="space-y-4">
                {order.tracking.map((track, index) => (
                  <div key={track.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{track.status}</p>
                      {track.description && <p className="text-sm text-gray-600">{track.description}</p>}
                      {track.location && <p className="text-sm text-gray-500">{track.location}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(track.createdAt), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-display font-bold text-lg mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="font-semibold">{order.firstName} {order.lastName}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{order.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-semibold">{order.phone}</p>
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Shipping Address</span>
            </h2>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.shippingFirstName} {order.shippingLastName}</p>
              <p className="text-gray-600">{order.shippingAddress}</p>
              <p className="text-gray-600">{order.shippingCity}, {order.shippingCounty}</p>
              {order.shippingPhone && <p className="text-gray-600">{order.shippingPhone}</p>}
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-display font-bold text-lg mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment</span>
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-semibold">{order.paymentMethod || 'Not set'}</span>
              </div>
              {order.mpesaReceiptId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">M-Pesa Receipt</span>
                  <span className="font-semibold">{order.mpesaReceiptId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === 'PAID' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
          
          {/* Fulfillment Actions */}
          <FulfillmentPanel order={order} />
        </div>
      </div>
    </div>
  )
}
