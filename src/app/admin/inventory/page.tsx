// src/app/admin/inventory/page.tsx
import InventoryTable from '@/components/admin/InventoryTable'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  // Direct Prisma query - no fetch needed
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
      images: {
        where: { isMain: true },
        take: 1
      }
    },
    orderBy: { stockQuantity: 'asc' }
  })

  // Calculate stats
  const stats = {
    totalProducts: products.length,
    inStock: products.filter(p => p.stockQuantity > 10).length,
    lowStock: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length
  }

  // Transform for TypeScript
  const transformedProducts = products.map(product => ({
    ...product,
    category: product.category || undefined,
    variants: product.variants?.map(v => ({
      ...v,
      size: v.size ?? undefined,
      color: v.color ?? undefined,
      colorHex: v.colorHex ?? undefined,
    })) || [],
  }))

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600">In Stock</p>
          <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
      </div>
      
      <InventoryTable products={transformedProducts} />
    </div>
  )
}
