'use client'

import Image from 'next/image'
import { useCart, useCartTotals } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

export function OrderSummary() {
  const {
    items,
    totalItems,
    subtotal,
    shippingCost,
    tax,
    total,
  } = useCartTotals()
  const { updateQuantity, removeItem, openCart } = useCart()

  return (
    <div className="bg-white p-6 rounded-lg shadow-soft">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-display flex items-center">
          <ShoppingBagIcon className="h-6 w-6 mr-2" />
          Shopping Cart ({totalItems})
        </h2>
        <button onClick={openCart} className="p-1">
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">
                    {item.size && <span>Size: {item.size}</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs mt-2">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (16%)</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button className="w-full mt-6 py-3 bg-gold-500 text-black font-bold rounded hover:bg-gold-600 transition-colors">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  )
}
