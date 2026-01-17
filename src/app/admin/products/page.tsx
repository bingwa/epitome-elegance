import Link from 'next/link'
import { Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ProductTable from '@/components/admin/ProductTable'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { where: { isMain: true } },
      variants: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/add"
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg
                     hover:bg-gray-800 transition font-display"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </div>
      
      <ProductTable products={products} />
    </div>
  )
}
