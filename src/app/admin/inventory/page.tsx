import { prisma } from '@/lib/prisma'
import InventoryTable from '@/components/admin/InventoryTable'
import { AlertTriangle } from 'lucide-react'

export default async function InventoryPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true
    },
    orderBy: { stockQuantity: 'asc' }
  })
  
  const lowStock = products.filter(p => p.stockQuantity < 10)
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Track and manage product stock levels</p>
      </div>
      
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-yellow-900">Low Stock Alert</h3>
            <p className="text-sm text-yellow-800 mt-1">
              {lowStock.length} product{lowStock.length > 1 ? 's' : ''} running low on stock
            </p>
          </div>
        </div>
      )}
      
      <InventoryTable products={products} />
    </div>
  )
}
