'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ShoppingBagIcon, MagnifyingGlassIcon, Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
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
    ],
  },
  {
    name: 'Men',
    href: '/men',
    submenu: [
      { name: 'Clothing', href: '/men/clothing' },
      { name: 'Accessories', href: '/men/accessories' },
    ],
  },
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'About', href: '/about' },
  { name: 'Sale', href: '/sale', special: true },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(true) // Changed to true by default
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null)
  const cart = useCart()
  const { totalItems } = useCartTotals()
  const pathname = usePathname()
  
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    // Set initial state immediately
    setIsScrolled(window.scrollY > 10)
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shouldBeTransparent = false

  return (
    <>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={() => setIsSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Search Products</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close search">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <SearchBar onSelect={() => setIsSearchOpen(false)} />
          </motion.div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          shouldBeTransparent
            ? 'bg-transparent'
            : 'bg-white/95 backdrop-blur-md shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                shouldBeTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Open menu">
              <Bars3Icon className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center space-x-3 group">
              <div className={`relative w-10 h-10 rounded-xl overflow-hidden transition-all`}>
                <Image
                  src="/logo.png"
                  alt="Epitome Elegance"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className={`font-logo text-2xl lg:text-3xl transition-colors ${
                shouldBeTransparent ? 'text-white' : 'text-gray-900'
              }`}>
                Epitome Elegance
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item, index) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.submenu && setHoveredMenu(index)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`text-sm font-medium tracking-wide transition-colors relative group ${
                      item.special
                        ? 'text-yellow-600'
                        : shouldBeTransparent
                        ? 'text-white hover:text-yellow-400'
                        : 'text-gray-900 hover:text-yellow-600'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                      shouldBeTransparent ? 'bg-yellow-400' : 'bg-yellow-600'
                    }`} />
                  </Link>

                  {item.submenu && hoveredMenu === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  shouldBeTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Search">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>

              <Link
                href="/account"
                className={`p-2 rounded-full transition-colors ${
                  shouldBeTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Account">
                <UserIcon className="w-5 h-5" />
              </Link>

              <button
                onClick={() => cart.openCart()}
                className={`p-2 rounded-full relative transition-colors ${
                  shouldBeTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                aria-label="Cart">
                <ShoppingBagIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
