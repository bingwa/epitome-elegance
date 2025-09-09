'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice, debounce } from '@/lib/utils'
import Link from 'next/link'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: {
    name: string
    slug: string
    gender: string
  }
}

interface SearchBarProps {
  onSelect?: () => void
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const searchProducts = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.products || [])
        setShowResults(true)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = debounce(searchProducts, 300)

  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowResults(false)
      onSelect?.()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false)
    onSelect?.()
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search for products..."
            className="w-full pl-12 pr-5 py-3 bg-gray-100/80 backdrop-blur-md rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-gray-500 text-gray-900 shadow-inner"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gold-600"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto"
          >
            {results.length > 0 ? (
              <>
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm text-gray-600">
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="py-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/products/${result.slug}`}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={result.image || '/placeholder-product.jpg'}
                        alt={result.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {result.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.category.name}
                        </p>
                        <p className="text-sm font-medium text-gold-600">
                          {formatPrice(result.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <button
                    onClick={handleSubmit}
                    className="w-full text-center text-sm text-gold-600 hover:text-gold-700 font-medium"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              </>
            ) : query.trim().length >= 2 && !isLoading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No products found for "{query}"</p>
                <button
                  onClick={handleSubmit}
                  className="mt-2 text-sm text-gold-600 hover:text-gold-700 font-medium"
                >
                  Search all products
                </button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
