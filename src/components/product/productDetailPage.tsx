'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { StarIcon, HeartIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { formatPrice } from '@/lib/utils'
import { ProductCard } from './ProductCard'
import { toast } from 'react-hot-toast'

interface ProductDetailPageProps {
  product: any
  relatedProducts: any[]
}

export function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  
  const isInWishlist = wishlistItems.some(item => item.productId === product.id)
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.comparePrice) * 100) : 0

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: selectedVariant.price,
        image: product.images[0]?.url || '/placeholder-product.jpg',
        size: selectedVariant.size,
        color: selectedVariant.color,
        stock: selectedVariant.stock,
        quantity
      })
    } else {
      toast.error('Please select a variant that is in stock')
    }
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '/placeholder-product.jpg'
      })
    }
  }

  const averageRating = product.reviews?.length > 0 
    ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length 
    : 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gold-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              {product.brand && (
                <p className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-2">
                  {product.brand}
                </p>
              )}
              <h1 className="text-4xl font-display font-bold text-black mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.reviews?.length > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(averageRating) ? 'text-gold-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-black">
                  {formatPrice(selectedVariant?.price || product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                    <span className="bg-gold-500 text-black px-3 py-1 text-sm font-bold rounded-full">
                      -{discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-6">
                {/* Size Options */}
                  {product.variants && product.variants.some((v: any) => v.size) && (
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-3">Size</h3>
                      <div className="flex flex-wrap gap-3">
                        {([...new Set(product.variants.map((v: any) => v.size))] as string[]).map((size: string) => {
                          if (!size) return null
                          const sizeVariants = product.variants.filter((v: any) => v.size === size)
                          const isAvailable = sizeVariants.some((v: any) => v.stock > 0)
                          const isSelected = selectedVariant?.size === size

                          return (
                            <button
                              key={size}
                              onClick={() => {
                                const variant = sizeVariants.find((v: any) => v.stock > 0)
                                if (variant) setSelectedVariant(variant)
                              }}
                              disabled={!isAvailable}
                              className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'border-gold-500 bg-gold-50 text-gold-700'
                                  : isAvailable
                                  ? 'border-gray-300 text-gray-700 hover:border-gold-500 hover:text-gold-600'
                                  : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                              }`}
                            >
                              {size}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                {/* Color Options */}
                    {product.variants && product.variants.some((v: any) => v.color && v.color !== 'Default') && (
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-3">Color</h3>
                        <div className="flex flex-wrap gap-3">
                          {([...new Set(product.variants.map((v: any) => v.color).filter(Boolean))] as string[])
                            .filter(color => color !== 'Default')
                            .map((color: string) => {
                              const colorVariant = product.variants.find((v: any) => v.color === color)
                              const isAvailable = colorVariant?.stock > 0
                              const isSelected = selectedVariant?.color === color

                              return (
                                <button
                                  key={color}
                                  onClick={() => {
                                    const variant = product.variants.find((v: any) => v.color === color && v.stock > 0)
                                    if (variant) setSelectedVariant(variant)
                                  }}
                                  disabled={!isAvailable}
                                  className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 capitalize ${
                                    isSelected
                                      ? 'border-gold-500 bg-gold-50 text-gold-700'
                                      : isAvailable
                                      ? 'border-gray-300 text-gray-700 hover:border-gold-500 hover:text-gold-600'
                                      : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  {color}
                                </button>
                              )
                            })}
                        </div>
                      </div>
                    )}                  
              </div>
            )}


            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex border-2 border-gray-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedVariant?.stock || 999, quantity + 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {selectedVariant && (
                    <span className="text-sm text-gray-600">
                      {selectedVariant.stock} in stock
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className="flex-1 bg-black text-white py-4 px-6 font-semibold hover:bg-gold-500 hover:text-black transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className="p-4 border-2 border-gray-300 hover:border-gold-500 transition-colors"
                >
                  {isInWishlist ? (
                    <HeartSolidIcon className="h-6 w-6 text-gold-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-600 hover:text-gold-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-6 w-6 text-gold-500" />
                  <div>
                    <p className="font-medium text-black">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over KSh 5,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-gold-500" />
                  <div>
                    <p className="font-medium text-black">30-Day Returns</p>
                    <p className="text-sm text-gray-600">Easy return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-display font-bold text-black mb-12 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
