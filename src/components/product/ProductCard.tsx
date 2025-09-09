'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { HeartIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { toast } from 'react-hot-toast'

interface ProductWithDetails {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  stockQuantity: number
  brand?: string
  images: Array<{
    id: string
    url: string
    altText?: string
    isMain: boolean
  }>
  variants: Array<{
    id: string
    size?: string
    color?: string
    colorHex?: string
    stock: number
    price: number
  }>
  _count?: {
    reviews: number
  }
  averageRating?: number
  category?: {
    name: string
    gender: string
  }
}

interface ProductCardProps {
  product: ProductWithDetails
  className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const router = useRouter()
  
  const isInWishlist = wishlistItems.some(item => item.productId === product.id)

  // derive size and color information
  const sizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[]
  const colorSwatches = product.variants.filter(v => v.color && v.colorHex)

  const mainImage = product.images.find(img => img.isMain) || product.images[0]
  const hoverImage = product.images[1] || mainImage
  
  const hasDiscount = product.comparePrice !== undefined && product.comparePrice > product.price
  const discountPercent = hasDiscount && product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const defaultVariant = product.variants[0]
    if (defaultVariant && defaultVariant.stock > 0) {
      addItem({
        productId: product.id,
        variantId: defaultVariant.id,
        name: product.name,
        price: defaultVariant.price,
        image: mainImage?.url || '/placeholder-product.jpg',
        size: defaultVariant.size,
        color: defaultVariant.color,
        stock: defaultVariant.stock
      })
    } else {
      toast.error('Product is out of stock')
    }
  }

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
        image: mainImage?.url || '/placeholder-product.jpg'
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/products/${product.slug}`)
  }

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`)
  }

  return (
    <motion.div
      className={`group relative bg-white cursor-pointer transition-all duration-500 hover:shadow-strong ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        {/* Discount Badge */}
        {hasDiscount && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 z-20 bg-black text-white px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full"
          >
            -{discountPercent}% OFF
          </motion.div>
        )}

        {/* Stock Badge */}
        {product.stockQuantity === 0 && (
          <div className="absolute top-4 right-4 z-20 bg-gray-800 text-white px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full">
            SOLD OUT
          </div>
        )}

        {/* New Badge for recently added products */}
        {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) < new Date() && (
          <div className="absolute top-4 left-4 z-20 bg-gold-500 text-black px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full">
            NEW
          </div>
        )}

        {/* Main Product Image */}
        <div className="relative w-full h-full">
          <Image
            src={mainImage?.url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover Image */}
          {hoverImage && hoverImage !== mainImage && (
            <Image
              src={hoverImage.url}
              alt={`${product.name} - Alternative view`}
              fill
              className={`object-cover transition-all duration-700 ${
                isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}
        </div>

        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Action Buttons - Modern Layout */}
        <div className={`absolute inset-x-4 bottom-4 flex items-center justify-between transition-all duration-500 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistToggle}
            className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-medium hover:bg-white transition-all duration-300"
          >
            {isInWishlist ? (
              <HeartSolidIcon className="h-5 w-5 text-gold-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-black hover:text-gold-500 transition-colors" />
            )}
          </motion.button>

          {/* Quick Add Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="flex items-center space-x-2 bg-black text-white px-6 py-3 font-semibold tracking-wide uppercase text-sm hover:bg-gold-500 hover:text-black transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingBagIcon className="h-4 w-4" />
            <span>{product.stockQuantity === 0 ? 'Sold Out' : 'Add to Cart'}</span>
          </motion.button>

          {/* Quick View Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickView}
            className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-medium hover:bg-white transition-all duration-300"
          >
            <EyeIcon className="h-5 w-5 text-black hover:text-gold-500 transition-colors" />
          </motion.button>
        </div>

        {/* Color Variants Preview */}
        {product.variants.length > 1 && (
          <div className={`absolute top-4 right-4 flex space-x-1 transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-70'
          }`}>
            {product.variants.slice(0, 4).map((variant) => (
              variant.colorHex && (
                <div
                  key={variant.id}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-soft"
                  style={{ backgroundColor: variant.colorHex }}
                />
              )
            ))}
            {product.variants.length > 4 && (
              <div className="w-4 h-4 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">+</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-6 space-y-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium text-gray-500 tracking-wider uppercase">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-display font-semibold text-black group-hover:text-gold-600 transition-colors duration-300 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500">
            {product.category.gender} • {product.category.name}
          </p>
        )}

        {/* Rating */}
        {product._count && product._count.reviews > 0 && product.averageRating && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.averageRating!)
                      ? 'text-gold-500 fill-current'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.averageRating.toFixed(1)} ({product._count.reviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold text-black">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.comparePrice!)}
            </span>
          )}
        </div>

        {/* Sizes & Colors */}
        {product.variants.length > 0 && (
          <div className="space-y-2">
            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="flex items-center flex-wrap gap-1">
                {sizes.slice(0, 5).map((size) => (
                  <span
                    key={size}
                    className="text-[10px] font-medium border border-gray-300 px-1.5 py-0.5 leading-none uppercase text-gray-700"
                  >
                    {size}
                  </span>
                ))}
                {sizes.length > 5 && (
                  <span className="text-[10px] text-gray-500">+{sizes.length - 5}</span>
                )}
              </div>
            )}

            {/* Colors */}
            {colorSwatches.length > 0 && (
              <div className="flex items-center gap-1">
                {colorSwatches.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/products/${product.slug}?color=${encodeURIComponent(c.color!)}`)
                    }}
                    className="w-3 h-3 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.colorHex || '#ccc' }}
                    title={c.color}
                  />
                ))}
                {colorSwatches.length > 4 && (
                  <span className="text-[10px] text-gray-500">+{colorSwatches.length - 4}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stock Indicator */}
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <p className="text-xs text-orange-600 font-medium">
            Only {product.stockQuantity} left in stock!
          </p>
        )}
      </div>
    </motion.div>
  )
}
