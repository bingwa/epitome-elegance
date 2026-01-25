import { getProductsOnSale } from '@/lib/products'
import ProductCard from '@/components/product/ProductCard'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Sale | Epitome Elegance",
  description: "Get amazing deals on premium fashion",
}

export default async function SalePage() {
  const products = await getProductsOnSale()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sale</h1>
        <p className="text-gray-600">Get amazing deals on premium fashion</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No sale items available at the moment.</p>
        </div>
      )}
    </div>
  )
}
