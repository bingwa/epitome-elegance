import { getProductsOnSale } from '@/lib/products'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'

export default async function SalePage() {
  const products = await getProductsOnSale()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Sale</h1>
        <p className="text-gray-600">Get amazing deals on premium fashion</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No sale items available at the moment.</p>
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
