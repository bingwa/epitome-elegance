'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon, HeartIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubscribing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Successfully subscribed!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="bg-black text-white">


      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <h3 className="text-2xl font-display font-bold">
                <span className="text-gold-500">Epitome</span> Elegance
              </h3>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Premium fashion for the modern Kenyan. Luxury clothing, accessories, and jewelry delivered nationwide.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <HeartIcon className="h-4 w-4 text-gold-500" />
              <span>in Kenya</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: 'Women', href: '/women' },
                { name: 'Men', href: '/men' },
                { name: 'New Arrivals', href: '/new-arrivals' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-gold-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Get in Touch</h4>
            <div className="space-y-3 text-gray-300">
              <p>📧 support@epitomeelegance.co.ke</p>
              <p>📱 +254 700 000 000</p>
              <p>🏪 Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-400">
            <p>© 2024 Epitome Elegance. All rights reserved.</p>
            <div className="flex space-x-6">
              <span>Shipping All Across Kenya</span>
              <span>•</span>
              <span>30-Day Returns</span>
              <span>•</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
