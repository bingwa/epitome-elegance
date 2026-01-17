import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export default async function AddProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
  
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
      </div>
      
      <ProductForm categories={categories} />
    </div>
  )
}
