'use client'
import { useState } from 'react'
import StockAdjustDialog from './StockAdjustDialog'
import { Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  stockQuantity: number
  category: { name: string }
  variants: Array<{ size?: string; color?: string; stock: number }>
}

export default function InventoryTable({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
  }
  
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                  Variants
                </th>
                <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-display font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const status = getStockStatus(product.stockQuantity)
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-display font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${product.stockQuantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.variants.length > 0 ? (
                        <div className="space-y-1">
                          {product.variants.slice(0, 2).map((v, i) => (
                            <div key={i} className="text-xs">
                              {v.size || v.color}: {v.stock}
                            </div>
                          ))}
                          {product.variants.length > 2 && (
                            <div className="text-xs text-gray-400">+{product.variants.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No variants</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-sm text-gray-900 hover:underline font-display"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedProduct && (
        <StockAdjustDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={(updatedProduct) => {
            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
            setSelectedProduct(null)
          }}
        />
      )}
    </>
  )
}
