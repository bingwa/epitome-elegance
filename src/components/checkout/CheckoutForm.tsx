'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import { useCart, useCartTotals } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  phone: string
  shippingAddress: string
  shippingCity: string
  shippingCounty: string
  mpesaPhone: string
  notes?: string
}

export function CheckoutForm() {
  const router = useRouter()
  const cart = useCart()
  const { subtotal, shippingCost, tax, total } = useCartTotals() // Use useCartTotals hook
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingCounty: '',
    mpesaPhone: '',
    notes: ''
  })

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Meru', 'Nyeri', 'Machakos',
    'Thika', 'Kiambu', 'Kakamega', 'Busia', 'Kitale', 'Garissa', 'Embu', 'Isiolo'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    const required = ['email', 'firstName', 'lastName', 'phone', 'shippingAddress', 'shippingCity', 'shippingCounty', 'mpesaPhone']
    
    for (const field of required) {
      if (!formData[field as keyof CheckoutFormData]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)
    try {
      // Create order object
      const order = {
        orderNumber: `EE${Date.now()}`,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingCounty: formData.shippingCounty,
        mpesaPhone: formData.mpesaPhone,
        items: cart.items,
        subtotal: subtotal, // Use the destructured values
        shipping: shippingCost,
        tax: tax,
        total: total,
        notes: formData.notes,
        createdAt: new Date().toISOString()
      }

      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate M-Pesa STK Push
      toast.success('M-Pesa payment request sent to your phone!')

      // Store order in localStorage for demo
      const existingOrders = JSON.parse(localStorage.getItem('epitome-orders') || '[]')
      existingOrders.push(order)
      localStorage.setItem('epitome-orders', JSON.stringify(existingOrders))

      // Clear cart
      cart.clearCart()

      // Redirect to success page
      router.push(`/checkout/success?order=${order.orderNumber}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-black mb-8 font-display">
        Delivery Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Contact Details</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+254 700 000 000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Delivery Address</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                placeholder="House/Building, Street, Area"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Town *
                </label>
                <input
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleInputChange}
                  placeholder="e.g., Nairobi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  County *
                </label>
                <select
                  name="shippingCounty"
                  value={formData.shippingCounty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  required
                >
                  <option value="">Select County</option>
                  {kenyanCounties.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* M-Pesa Payment */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-black">M-Pesa Payment</h3>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-green-800 mb-2">How M-Pesa payment works:</h4>
            <ol className="text-sm text-green-700 space-y-1">
              <li>1. Enter your M-Pesa registered phone number</li>
              <li>2. Click "Place Order" to proceed</li>
              <li>3. You'll receive an STK push on your phone</li>
              <li>4. Enter your M-Pesa PIN to complete payment</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              M-Pesa Phone Number *
            </label>
            <input
              type="tel"
              name="mpesaPhone"
              value={formData.mpesaPhone}
              onChange={handleInputChange}
              placeholder="+254 700 000 000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This should be the phone number registered with M-Pesa
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || cart.items.length === 0}
          className="w-full bg-gold-500 text-black font-bold py-4 px-6 rounded-lg hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              Processing Order...
            </>
          ) : (
            <>
              <DevicePhoneMobileIcon className="h-5 w-5" />
              Place Order - {formatPrice(total)}
            </>
          )}
        </button>
      </form>
    </motion.div>
  )
}
