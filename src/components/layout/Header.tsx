'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, useCartTotals } from '@/hooks/useCart'
import { MobileMenu } from './MobileMenu'
import { SearchBar } from '@/components/ui/SearchBar'

const navigation = [
  {
    name: 'Women',
    href: '/women',
    submenu: [
      { name: 'Clothing', href: '/women/clothing' },
      { name: 'Bags', href: '/women/bags' },
      { name: 'Shoes', href: '/women/shoes' },
      { name: 'Jewelry', href: '/women/jewelry' },
    ]
  },
  {
    name: 'Men',
    href: '/men',
    submenu: [
      { name: 'Clothing', href: '/men/clothing' },
      { name: 'Accessories', href: '/men/accessories' },
    ]
  },
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'About', href: '/about' }, // ← Added the About link here
  { name: 'Sale', href: '/sale', special: true },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  const cart = useCart()
  const { totalItems } = useCartTotals()

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state if user scrolls down more than 10 pixels
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          // Apply background and shadow only when scrolled
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo and Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Epitome Elegance Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <h1
                className={`text-3xl lg:text-4xl font-logo font-bold transition-colors ${
                  isScrolled ? 'text-black' : 'text-white'
                }`}
              >
                Epitome Elegance
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => setHoveredMenu(item.name)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`font-semibold text-lg transition-colors ${
                      item.special
                        ? 'text-gold-500 hover:text-gold-400' // Sale item styling
                        : isScrolled
                        ? 'text-black hover:text-gold-600'
                        : 'text-white hover:text-gray-200'
                    }`}
                  >
                    {item.name}
                    {item.special && (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-2 w-2 h-2 bg-gold-500 rounded-full"
                      />
                    )}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.submenu && hoveredMenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 bg-white shadow-strong rounded-lg py-4 min-w-64 z-50"
                      >
                        {item.submenu.map((subitem, index) => (
                          <motion.div
                            key={subitem.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.1, delay: index * 0.05 }}
                          >
                            <Link
                              href={subitem.href}
                              className="block px-6 py-3 text-gray-700 hover:text-gold-500 hover:bg-gold-50 font-medium transition-all duration-200"
                            >
                              {subitem.name}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors ${
                  isScrolled ? 'text-black hover:text-gold-600' : 'text-white hover:text-gray-200'
                }`}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              
              <Link
                href="/account"
                className={`hidden md:flex p-2 transition-colors ${
                  isScrolled ? 'text-black hover:text-gold-600' : 'text-white hover:text-gray-200'
                }`}
              >
                <UserIcon className="h-6 w-6" />
              </Link>
              
              <button onClick={cart.openCart} className="relative p-2">
                <ShoppingBagIcon
                  className={`h-6 w-6 transition-colors ${
                    isScrolled ? 'text-black hover:text-gold-600' : 'text-white hover:text-gray-200'
                  }`}
                />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white m-4 mt-24 rounded-lg shadow-strong overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-2xl font-logo font-bold text-black">Search Products</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <SearchBar onSelect={() => setIsSearchOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
