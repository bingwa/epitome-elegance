// src/app/admin/inventory/page.tsx
import InventoryTable from '@/components/admin/InventoryTable'

export default async function InventoryPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
    cache: 'no-store',
  })
  
  const data = await res.json()
  
  // Transform null to undefined for TypeScript compatibility
  const transformedProducts = data.inventory.map((product: any) => ({
    ...product,
    category: product.category || undefined,
    variants: product.variants?.map((v: any) => ({
      ...v,
      size: v.size ?? undefined,
      color: v.color ?? undefined,
      colorHex: v.colorHex ?? undefined,
    })) || [],
  }))

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      {data.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{data.stats.totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600">In Stock</p>
            <p className="text-2xl font-bold text-green-600">{data.stats.inStock}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">{data.stats.lowStock}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{data.stats.outOfStock}</p>
          </div>
        </div>
      )}
      
      <InventoryTable products={transformedProducts} />
    </div>
  )
}
