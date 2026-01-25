import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }>  // ✅ Changed to Promise
}) {
  const { id } = await params  // ✅ Await params first

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },  // ✅ Use awaited id
      include: {
        images: true,
        variants: true
      }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ])
  
  if (!product) notFound()
  
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>
      
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
