import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/admin/StatsCard'
import SalesChart from '@/components/admin/SalesChart'
import RecentOrders from '@/components/admin/RecentOrders'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'


async function getSalesData() {
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  
  const orders = await prisma.order.groupBy({
    by: ['createdAt'],
    _sum: { total: true },
    _count: true,
    where: {
      createdAt: { gte: last7Days },
      status: 'PAID'
    }
  })
  
  return orders.map(order => ({
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: order._sum.total || 0,
    orders: order._count
  }))
}

export default async function AdminDashboard() {
  const [stats, recentOrders, salesData, lowStockCount] = await Promise.all([
    // Basic stats
    Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: 'PAID' }
      }),
      prisma.order.count({ where: { status: 'PENDING' } })
    ]),
    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } }
      }
    }),
    
    getSalesData(),
    
    prisma.product.count({ where: { stockQuantity: { lt: 1 } } })
  ])
  
  const [productCount, orderCount, revenue, pendingOrders] = stats
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`KSh ${(revenue._sum.total || 0).toLocaleString()}`}
          icon={DollarSign}
          trend="0"
          trendUp={true}
        />
        <StatsCard
          title="Total Orders"
          value={orderCount.toString()}
          icon={ShoppingCart}
          trend="0"
          trendUp={true}
        />
        <StatsCard
          title="Products"
          value={productCount.toString()}
          icon={Package}
          subtitle={`${lowStockCount} low stock`}
        />
        <StatsCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          icon={TrendingUp}
          trend={pendingOrders > 5 ? 'High' : 'Normal'}
        />
      </div>
      
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData} />
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  )
}
