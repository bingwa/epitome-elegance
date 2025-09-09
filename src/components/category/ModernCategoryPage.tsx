'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FunnelIcon, Squares2X2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ProductCard } from '@/components/product/ProductCard'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ModernCategoryPageProps {
  category: any
  products: any[]
  pagination: {
    current: number
    pages: number
    total: number
  }
  priceRange: {
    min: number
    max: number
  }
  searchParams: any
  gender: string
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' }
]

export function ModernCategoryPage({ 
  category, 
  products, 
  pagination, 
  priceRange, 
  searchParams,
  gender 
}: ModernCategoryPageProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [gridView, setGridView] = useState(true)
  const [priceMin, setPriceMin] = useState(searchParams.min_price || '')
  const [priceMax, setPriceMax] = useState(searchParams.max_price || '')

  const updateUrl = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(params.entries()))
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })

    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`/${gender}/${category.slug}${query}`)
  }

  const handleSortChange = (sort: string) => {
    updateUrl({ sort, page: null })
  }

  const handlePriceFilter = () => {
    updateUrl({ 
      min_price: priceMin || null,
      max_price: priceMax || null,
      page: null 
    })
  }

  const clearFilters = () => {
    setPriceMin('')
    setPriceMax('')
    updateUrl({ min_price: null, max_price: null, page: null })
  }

  const goToPage = (page: number) => {
    updateUrl({ page: page.toString() })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black text-white py-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-gold-500 text-black text-sm font-bold tracking-wider uppercase rounded-full">
                {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {category.description}
              </p>
            )}
            <div className="mt-8">
              <span className="text-gold-400 text-lg font-medium">
                {pagination.total} Products Available
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-3 bg-black text-white px-6 py-3 hover:bg-gold-500 hover:text-black transition-all duration-300 font-semibold"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>

            <div className="text-gray-600 font-medium">
              Showing {products.length} of {pagination.total} products
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* View Toggle */}
            <div className="flex border-2 border-gray-300 rounded">
              <button
                onClick={() => setGridView(true)}
                className={`p-3 transition-colors ${
                  gridView ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-3 transition-colors ${
                  !gridView ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={searchParams.sort || 'newest'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border-2 border-gray-300 px-4 py-3 focus:border-black focus:ring-0 outline-none text-lg font-medium bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-accent-cream border border-gray-200 rounded-lg p-8 mb-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-display font-bold text-black">Filter Products</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price Range */}
                <div>
                  <h4 className="text-lg font-semibold text-black mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
                        <input
                          type="number"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="input-elegance"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Maximum</label>
                        <input
                          type="number"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="input-elegance"
                          placeholder="50000"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handlePriceFilter}
                        className="btn-primary"
                      >
                        Apply Filter
                      </button>
                      <button
                        onClick={clearFilters}
                        className="btn-secondary"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Price Filters */}
                <div>
                  <h4 className="text-lg font-semibold text-black mb-4">Quick Filters</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Under KSh 2,000', min: 0, max: 2000 },
                      { label: 'KSh 2,000 - 5,000', min: 2000, max: 5000 },
                      { label: 'KSh 5,000 - 15,000', min: 5000, max: 15000 },
                      { label: 'Above KSh 15,000', min: 15000, max: 100000 }
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setPriceMin(range.min.toString())
                          setPriceMax(range.max.toString())
                          updateUrl({ 
                            min_price: range.min.toString(),
                            max_price: range.max.toString(),
                            page: null 
                          })
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gold-100 hover:text-black rounded-md transition-colors font-medium"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <h4 className="text-lg font-semibold text-black mb-4">Why Choose Epitome?</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-3">
                      <span className="text-gold-500">✓</span>
                      <span>Premium quality materials</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-gold-500">✓</span>
                      <span>Free shipping over KSh 5,000</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-gold-500">✓</span>
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="text-gold-500">✓</span>
                      <span>Secure M-Pesa payments</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          gridView 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProductCard 
                product={product}
                className={!gridView ? 'md:flex md:flex-row md:space-x-6' : ''}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div 
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-gray-400 mb-8">
              <svg className="mx-auto h-32 w-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2" />
              </svg>
            </div>
            <h3 className="text-4xl font-display font-bold text-black mb-6">No Products Found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => goToPage(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-4 py-2 border-2 border-black disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors font-semibold"
            >
              Previous
            </button>

            {[...Array(Math.min(pagination.pages, 10))].map((_, index) => {
              let page = index + 1;
              
              // Show first few, last few, and pages around current
              if (pagination.pages > 10) {
                if (index < 3) {
                  page = index + 1;
                } else if (index >= pagination.pages - 3) {
                  page = pagination.pages - (pagination.pages - 1 - index);
                } else {
                  page = pagination.current - 2 + (index - 2);
                }
              }

              const isActive = page === pagination.current;
              
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 border-2 transition-colors font-semibold ${
                    isActive
                      ? 'bg-gold-500 text-black border-gold-500'
                      : 'border-black hover:bg-black hover:text-white'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="px-4 py-2 border-2 border-black disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
