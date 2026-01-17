import { getFeaturedProducts, getNewArrivals } from '@/lib/products'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const [featuredProducts, newArrivals] = await Promise.all([
    getFeaturedProducts(4), // Fetch 4 for specific grid
    getNewArrivals(8),
  ])

  return (
    <div className="bg-white">
      {/* 1. Hero Section (Keep existing one or simpler version) */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image - Replace with your actual hero image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop)' }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm font-medium tracking-wider mb-6 backdrop-blur-sm animate-fade-in-up">
            NEW SEASON 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight animate-fade-in-up delay-100">
            Elegance is <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">Not a Choice</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-light animate-fade-in-up delay-200">
            Discover our curated collection of luxury fashion designed to define your personal style statement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <Link 
              href="/women" 
              className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-yellow-400 transition-colors min-w-[160px]"
            >
              Shop Women
            </Link>
            <Link 
              href="/men" 
              className="px-8 py-4 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors min-w-[160px]"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Collection (Real Data) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-yellow-600 font-medium tracking-wider text-sm">CURATED SELECTION</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">Featured Products</h2>
            </div>
            <Link href="/new-arrivals" className="hidden md:flex items-center space-x-2 text-gray-900 hover:text-yellow-600 transition font-medium">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No featured products found.</p>
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link href="/new-arrivals" className="inline-flex items-center space-x-2 text-gray-900 font-medium border-b border-gray-900 pb-1">
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Categories Grid (Static but linked) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
            <Link href="/women" className="relative group overflow-hidden rounded-2xl h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80)' }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="text-sm font-medium uppercase tracking-wider mb-2 block">Collection</span>
                <h3 className="text-4xl font-display font-bold">Women</h3>
              </div>
            </Link>
            
            <div className="grid grid-rows-2 gap-4 h-full">
              <Link href="/men" className="relative group overflow-hidden rounded-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617137968427-85924c809a29?auto=format&fit=crop&q=80)' }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-display font-bold">Men</h3>
                </div>
              </Link>
              <Link href="/accessories" className="relative group overflow-hidden rounded-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80)' }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-display font-bold">Accessories</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. New Arrivals (Real Data) */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-yellow-600 font-medium tracking-wider text-sm uppercase">Fresh Drops</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">New Arrivals</h2>
            <p className="text-gray-500">Stay ahead of the fashion curve with our latest additions, crafted for the modern trendsetter.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">No new arrivals yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
