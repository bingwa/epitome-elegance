'use client'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlist } from '@/hooks/useWishlist'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: Array<{ url: string }> | null
  category?: {
    name: string
  }
}

export default function ProductCard({ product }: { product: Product }) {
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const isInWishlist = wishlistItems.some(item => item.productId === product.id)

  // Calculate discount
  const discount = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  // Fallback image if no images exist
  const mainImage = product.images && product.images.length > 0
    ? product.images[0].url
    : 'https://placehold.co/600x800/png?text=No+Image'

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: mainImage
      })
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Sale Badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm z-10">
              -{discount}%
            </span>
          )}
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
          >
            {isInWishlist ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {product.category && (
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
              {product.category.name}
            </p>
          )}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors flex-grow">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2 mt-auto">
            <span className="text-lg font-bold text-gray-900">
              KSh {product.price.toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through decoration-gray-400">
                KSh {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
