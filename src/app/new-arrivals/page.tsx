import { getNewArrivals } from '@/lib/products'
import ProductCard from '@/components/product/ProductCard'


export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(50)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">New Arrivals</h1>
        <p className="text-gray-600">Be the first to shop our latest collection</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No new arrivals yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
