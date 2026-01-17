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
      </div>
    </div>
  )
}
