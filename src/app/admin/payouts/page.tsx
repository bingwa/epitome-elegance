import { prisma } from '@/lib/prisma'
import PayoutTable from '@/components/admin/PayoutTable'
import { DollarSign, TrendingUp, Clock } from 'lucide-react'

export default async function PayoutsPage() {
  const orders = await prisma.order.findMany({
    where: {
      paymentMethod: 'MPESA',
      status: 'PAID'
    },
    orderBy: { createdAt: 'desc' }
  })
  
  const stats = {
    total: orders.reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter(o => o.payoutStatus === 'PENDING').reduce((sum, o) => sum + o.total, 0),
    completed: orders.filter(o => o.payoutStatus === 'COMPLETED').reduce((sum, o) => sum + o.total, 0),
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Payouts</h1>
        <p className="text-gray-600 mt-1">Track M-Pesa payments and payouts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-gray-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-display font-bold text-gray-900 mt-2">
            KSh {stats.total.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-yellow-600 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-yellow-800 text-sm font-medium">Pending Payout</h3>
          <p className="text-3xl font-display font-bold text-yellow-900 mt-2">
            KSh {stats.pending.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-green-800 text-sm font-medium">Completed</h3>
          <p className="text-3xl font-display font-bold text-green-900 mt-2">
            KSh {stats.completed.toLocaleString()}
          </p>
        </div>
      </div>
      
      <PayoutTable orders={orders} />
    </div>
  )
}
