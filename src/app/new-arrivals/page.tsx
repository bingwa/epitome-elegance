import { getNewArrivals } from '@/lib/products'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: "New Arrivals | Epitome Elegance",
  description: "Be the first to shop our latest collection",
}

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(50)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">New Arrivals</h1>
        <p className="text-gray-600">Be the first to shop our latest collection</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No new arrivals yet.</p>
        </div>
      )}
    </div>
  )
}
