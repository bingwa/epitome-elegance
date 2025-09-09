'use client' // The "use client" directive is correctly placed here.

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { CheckoutForm } from './CheckoutForm'
import { OrderSummary } from './OrderSummary'
import { ShieldCheckIcon, TruckIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

export function CheckoutPage() {
  const { items } = useCart()
  const router = useRouter()

  useEffect(() => {
    // Redirect if cart is empty on the client side
    if (items.length === 0) {
      router.push('/')
    }
  }, [items.length, router])

  // Show a loading/placeholder state if cart is empty on initial render
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-8">
        <div>
          <h2 className="text-2xl font-bold font-display mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Redirecting to homepage to continue shopping...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12 font-display">
          Secure Checkout
        </h1>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Checkout Form */}
          <div>
            <CheckoutForm />
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="sticky top-28">
            <OrderSummary />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <ShieldCheckIcon className="h-10 w-10 text-gold-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-black">Secure Payment</h3>
                <p className="text-sm text-gray-600">Your payment information is encrypted and secure.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <TruckIcon className="h-10 w-10 text-gold-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-black">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Free shipping on orders over KSh 5,000.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <DevicePhoneMobileIcon className="h-10 w-10 text-gold-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-black">M-Pesa Ready</h3>
                <p className="text-sm text-gray-600">Pay instantly with your mobile money.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
