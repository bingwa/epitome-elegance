'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FunnelIcon, Squares2X2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ProductCard } from '@/components/product/ProductCard'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResultsProps {
  query: string
  products: any[]
  pagination: {
    current: number
    pages: number
    total: number
  }
  searchParams: any
}

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' }
]

export function SearchResults({ query, products, pagination, searchParams }: SearchResultsProps) {
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
    const queryParam = query ? `q=${encodeURIComponent(query)}` : ''
    const separator = search && queryParam ? '&' : ''
    const finalQuery = `${queryParam}${separator}${search}`
    
    router.push(`/search?${finalQuery}`)
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
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
            Search Results
          </h1>
          <p className="text-xl text-gray-600">
            {pagination.total} results for <span className="font-semibold">"{query}"</span>
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="font-semibold">Filters</span>
            </button>

            <div className="text-gray-600">
              {pagination.total} products
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex border-2 border-gray-300">
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
              className="border-2 border-gray-300 px-4 py-3 focus:border-black focus:ring-0 outline-none text-lg"
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
              className="bg-accent-cream border-2 border-gray-200 rounded-lg p-8 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display font-bold text-black">Filters</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Min</label>
                        <input
                          type="number"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:ring-0 outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max</label>
                        <input
                          type="number"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:ring-0 outline-none"
                          placeholder="50000"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handlePriceFilter}
                        className="px-6 py-3 bg-black text-white hover:bg-gold-500 hover:text-black transition-colors font-semibold"
                      >
                        Apply
                      </button>
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-colors font-semibold"
                      >
                        Clear
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
                      { label: 'KSh 5,000 - 10,000', min: 5000, max: 10000 },
                      { label: 'Above KSh 10,000', min: 10000, max: 50000 }
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
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gold-100 hover:text-black rounded-md transition-colors"
                      >
                        {range.label}
                      </button>
                    ))}
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
                className={!gridView ? 'flex-row' : ''}
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
            <div className="text-gray-400 mb-6">
              <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-display font-bold text-black mb-4">No products found</h3>
            <p className="text-xl text-gray-600 mb-8">Try adjusting your search terms or filters</p>
            <button
              onClick={clearFilters}
              className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gold-500 hover:text-black transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-16 flex items-center justify-center space-x-2">
            <button
              onClick={() => goToPage(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-6 py-3 border-2 border-black disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors font-semibold"
            >
              Previous
            </button>

            {[...Array(pagination.pages)].map((_, index) => {
              const page = index + 1
              const isActive = page === pagination.current
              
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-3 border-2 transition-colors font-semibold ${
                    isActive
                      ? 'bg-gold-500 text-black border-gold-500'
                      : 'border-black hover:bg-black hover:text-white'
                  }`}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => goToPage(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="px-6 py-3 border-2 border-black disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
