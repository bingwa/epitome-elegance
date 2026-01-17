import prisma from '@/lib/prisma'
import ProductCard from '@/components/product/ProductCard'

export default async function WomenPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        gender: 'FEMALE'
      }
    },
    include: {
      category: true,
      images: {
        orderBy: { isMain: 'desc' }
      },
      variants: true,
      _count: {
        select: { reviews: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 12
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Women&apos;s Fashion</h1>
        <p className="text-lg text-gray-600">Explore elegant fashion for women</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
