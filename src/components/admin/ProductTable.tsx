'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stockQuantity: number
  isActive: boolean
  category: { name: string }
  images: Array<{ url: string }>
}

export default function ProductTable({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [filter, setFilter] = useState('')
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.category.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
        toast.success('Product deleted')
      } else {
        toast.error('Failed to delete product')
      }
    } catch {
      toast.error('An error occurred')
    }
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <input
          type="search"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-display font-semibold text-gray-700 uppercase">
                Stock
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
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category.name}</td>
                <td className="px-6 py-4 text-sm font-semibold">KSh {product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${product.stockQuantity < 10 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/products/${product.slug}`}
                      target="_blank"
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  )
}
