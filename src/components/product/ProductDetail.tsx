'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { StarIcon, HeartIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon, CheckIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import ProductCard from './ProductCard'
import { toast } from 'react-hot-toast'

interface ProductDetailPageProps {
  product: any
  relatedProducts: any[]
}

// Color name to hex mapping for common colors
const COLOR_MAP: Record<string, string> = {
  'black': '#000000',
  'white': '#FFFFFF',
  'red': '#EF4444',
  'blue': '#3B82F6',
  'green': '#10B981',
  'yellow': '#F59E0B',
  'purple': '#A855F7',
  'pink': '#EC4899',
  'gray': '#6B7280',
  'grey': '#6B7280',
  'orange': '#F97316',
  'brown': '#92400E',
  'beige': '#D4C5B9',
  'navy': '#1E3A8A',
  'gold': '#D4AF37',
  'silver': '#C0C0C0',
}

const getColorHex = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim()
  return COLOR_MAP[normalized] || '#9CA3AF' // Default gray if color not found
}

export function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  // Extract unique colors and sizes from variants
  const uniqueColors = useMemo(() => {
    const colors = product.variants
      ?.map((v: any) => v.color)
      .filter((c: string) => c && c.trim() !== '')
    return [...new Set(colors)]
  }, [product.variants])

  const uniqueSizes = useMemo(() => {
    const sizes = product.variants
      ?.map((v: any) => v.size)
      .filter((s: string) => s && s.trim() !== '')
    return [...new Set(sizes)]
  }, [product.variants])

  // Selection state
  const [selectedColor, setSelectedColor] = useState<string>(uniqueColors[0] || '')
  const [selectedSize, setSelectedSize] = useState<string>(uniqueSizes[0] || '')

  // Find the matching variant based on selected color and size
  const selectedVariant = useMemo(() => {
    return product.variants?.find((v: any) => {
      const colorMatch = !selectedColor || v.color === selectedColor
      const sizeMatch = !selectedSize || v.size === selectedSize
      return colorMatch && sizeMatch
    }) || product.variants?.[0]
  }, [product.variants, selectedColor, selectedSize])

  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const isInWishlist = wishlistItems.some(item => item.productId === product.id)

  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.price / product.comparePrice) * 100) 
    : 0

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: selectedVariant.price || product.price,
        image: product.images[0]?.url || '/placeholder-product.jpg',
        size: selectedVariant.size,
        color: selectedVariant.color,
        stock: selectedVariant.stock,
        quantity
      })
      toast.success('Added to cart!')
    } else {
      toast.error('This variant is out of stock')
    }
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      })
      toast.success('Added to wishlist')
    }
  }

  // Check if a specific variant is available
  const isVariantAvailable = (color?: string, size?: string) => {
    return product.variants?.some((v: any) => {
      const colorMatch = !color || v.color === color
      const sizeMatch = !size || v.size === size
      return colorMatch && sizeMatch && v.stock > 0
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span>/</span>
          <a href={`/${product.category?.gender?.toLowerCase()}`} className="hover:text-gray-900">
            {product.category?.gender}
          </a>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl p-8 shadow-sm">
          
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={product.images?.[selectedImage]?.url || 'https://placehold.co/600x800/png?text=No+Image'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  -{discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-black shadow-md' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-600 uppercase tracking-wider">
                {product.category?.name || 'Product'}
              </span>
              {product.brand && (
                <span className="text-sm text-gray-500">by {product.brand}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                KSh {(selectedVariant?.price || product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  KSh {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-900">
                    Color: <span className="text-gray-600">{selectedColor || 'Select'}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color: string) => {
                    const isAvailable = isVariantAvailable(color, selectedSize)
                    const isSelected = selectedColor === color
                    const colorHex = getColorHex(color)

                    return (
                      <button
                        key={color}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedColor(color)
                          }
                        }}
                        disabled={!isAvailable}
                        className={`relative group ${!isAvailable ? 'cursor-not-allowed opacity-40' : ''}`}
                        title={color}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-black shadow-lg scale-110'
                              : 'border-gray-300 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: colorHex }}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CheckIcon 
                                className="w-6 h-6" 
                                style={{ 
                                  color: colorHex === '#FFFFFF' ? '#000000' : '#FFFFFF',
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} 
                              />
                            </div>
                          )}
                        </div>
                        {/* Tooltip */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-900">
                  Size: <span className="text-gray-600">{selectedSize || 'Select'}</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {uniqueSizes.map((size: string) => {
                    const isAvailable = isVariantAvailable(selectedColor, size)
                    const isSelected = selectedSize === size

                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedSize(size)
                          }
                        }}
                        disabled={!isAvailable}
                        className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white shadow-md'
                            : isAvailable
                            ? 'border-gray-300 hover:border-black'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
              <div className="flex items-center space-x-2">
                {selectedVariant.stock > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">
                      {selectedVariant.stock} in stock
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600 font-medium">Out of stock</span>
                  </>
                )}
              </div>
            )}

           {/* Quantity */}
<div className="flex items-center space-x-4">
  <label className="text-sm font-medium text-gray-900">Quantity:</label>
  <div className="flex items-center border border-gray-300 rounded-lg">
    <button
      onClick={() => setQuantity(Math.max(1, quantity - 1))}
      className="px-4 py-2 hover:bg-gray-50 transition-colors"
    >
      -
    </button>
    <span className="px-6 py-2 font-medium border-x border-gray-300">
      {quantity || 1}  {/* Add fallback */}
    </span>
    <button
      onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
      className="px-4 py-2 hover:bg-gray-50 transition-colors"
    >
      +
    </button>
  </div>
</div>


            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleWishlistToggle}
                className="w-full border-2 border-gray-300 py-4 rounded-xl font-medium hover:border-black transition-all flex items-center justify-center space-x-2"
              >
                {isInWishlist ? (
                  <>
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    <span>Remove from Wishlist</span>
                  </>
                ) : (
                  <>
                    <HeartIcon className="w-5 h-5" />
                    <span>Add to Wishlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center space-y-2">
                <TruckIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheckIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs font-medium text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-display font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
