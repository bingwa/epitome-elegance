'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useCart, useCartTotals } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

export function OrderSummary() {
  const { items, totalItems, subtotal, shippingCost, tax, total } = useCartTotals()
  const { updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-soft">
        <h2 className="text-2xl font-display font-bold text-black mb-6">Order Summary</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white p-8 rounded-lg shadow-soft sticky top-8"
    >
      <h2 className="text-2xl font-display font-bold text-black mb-6">
        Order Summary
      </h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-black text-sm mb-1 line-clamp-2">
                {item.name}
              </h3>
              <div className="text-xs text-gray-500 space-y-1">
                {item.size && <p>Size: {item.size}</p>}
                {item.color && <p>Color: {item.color}</p>}
                <p className="font-medium text-black">
                  {formatPrice(item.price)} each
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 hover:bg-gray-100 transition-colors text-sm"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 hover:bg-gray-100 transition-colors text-sm"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:text-red-600 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              
              <p className="font-semibold text-black text-sm">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>VAT (16%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>
        
        {shippingCost === 0 && (
          <div className="text-xs text-green-600">
            🎉 Free shipping on orders over KSh 5,000
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </motion.div>
  )
}
