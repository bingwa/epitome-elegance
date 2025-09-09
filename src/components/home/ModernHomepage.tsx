'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'
import { ProductCard } from '@/components/product/ProductCard'

interface ModernHomepageProps {
  featuredProducts: any[]
  newArrivals: any[]
  categories: any[]
}

const heroSlides = [
  {
    id: 1,
    title: "New Collection",
    subtitle: "SPRING/SUMMER 2025",
    description: "Discover our latest luxury pieces crafted for the modern Kenyan",
    image: "/images/men/clothing/suit%20jacket.jpg", // local
    cta: "Shop Collection",
    link: "/new-arrivals",
    theme: "dark" // text color theme
  },
  {
    id: 2,
    title: "Premium Accessories",
    subtitle: "TIMELESS ELEGANCE",
    description: "Complete your look with our exclusive jewelry and handbag collection",
    image: "/images/men/accessories/watch.jpg", // local
    cta: "Explore",
    link: "/accessories",
    theme: "dark"
  },
  {
    id: 3,
    title: "We Deliver Countrywide",
    subtitle: "RELIABLE AND SECURE",
    description: "Enjoy delivery across Kenya with fast, secure shipping",
    image: "/images/men/accessories/leather%20bag.jpg", // local
    cta: "Shop Now",
    link: "/all",
    theme: "dark"
  }
]

export function ModernHomepage({ featuredProducts, newArrivals, categories }: ModernHomepageProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // map category slugs to local fallback images
  const categoryImages: Record<string, string> = {
    'women-clothing': '/images/men/clothing/floral%20shirt.jpg',
    'women-bags': '/images/men/accessories/leather%20bag.jpg',
    'men-clothing': '/images/men/clothing/suit%20jacket.jpg',
    'men-accessories': '/images/men/accessories/watch.jpg',
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gold-500 text-black text-sm font-display font-semibold tracking-wider uppercase rounded-full">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </div>
              
              <h1 className={`text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-none ${
                heroSlides[currentSlide].theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {heroSlides[currentSlide].title}
              </h1>
              
              <p className={`text-xl md:text-2xl mb-8 leading-relaxed ${
                heroSlides[currentSlide].theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {heroSlides[currentSlide].description}
              </p>
              
              <Link
                href={heroSlides[currentSlide].link}
                className="group inline-flex items-center space-x-3 bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gold-500 hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                <span>{heroSlides[currentSlide].cta}</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index)
                setIsAutoPlaying(false)
                setTimeout(() => setIsAutoPlaying(true), 10000)
              }}
              className={`w-12 h-1 transition-all duration-300 ${
                index === currentSlide ? 'bg-gold-500' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 text-white animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium tracking-wider uppercase">Scroll</span>
            <div className="w-px h-8 bg-white opacity-60" />
          </div>
        </div>
      </section>

      {/* Categories Grid - Modern Layout */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Curated collections for every style and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/${category.gender?.toLowerCase() || 'all'}/${category.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-gray-100 hover:shadow-strong transition-all duration-500"
                >
                  <Image
                    src={category.image || categoryImages[category.slug] || '/logo.png'}
                    alt={category.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-display font-bold mb-2 group-hover:text-gold-300 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm group-hover:text-white transition-colors">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-gold-300">
                      <span className="text-sm font-semibold tracking-wide uppercase">Shop Now</span>
                      <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Premium Grid */}
      <section className="py-24 bg-accent-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that define contemporary elegance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/all"
              className="group inline-flex items-center space-x-3 border-2 border-black text-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all duration-300"
            >
              <span>View All Products</span>
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals - Carousel Style */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
                  New Arrivals
                </h2>
                <p className="text-xl text-gray-600 max-w-xl">
                  Fresh styles just landed from our latest collection
                </p>
              </div>
              <Link
                href="/new-arrivals"
                className="hidden md:flex items-center space-x-2 text-black hover:text-gold-500 font-semibold transition-colors"
              >
                <span>View All</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {newArrivals.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <div className="text-center md:hidden">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center space-x-2 text-black hover:text-gold-500 font-semibold"
              >
                <span>View All New Arrivals</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* Newsletter Signup - Modern Design */}
      <section className="py-24 bg-accent-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-6">
              Stay in Style
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Be the first to know about new collections, exclusive offers, and fashion insights.
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 border-2 border-gray-300 focus:border-black focus:ring-0 outline-none text-lg"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gold-500 hover:text-black transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
            
            <p className="text-sm text-gray-500 mt-6">
              No spam, unsubscribe at any time. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
