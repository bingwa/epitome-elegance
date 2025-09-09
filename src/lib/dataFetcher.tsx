interface FashionProduct {
    id: number
    title: string
    description: string
    price: number
    category: string
    image: string
    images?: string[]
    brand?: string
    rating?: {
      rate: number
      count: number
    }
  }
  
  interface ApiProduct {
    id: number
    title: string
    description: string
    price: number
    category: {
      id: number
      name: string
    }
    images: string[]
    creationAt?: string
    updatedAt?: string
  }
  
  interface FakeStoreProduct {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
      rate: number
      count: number
    }
  }
  
  class FashionDataService {
    private readonly PLATZI_API = 'https://api.escuelajs.co/api/v1'
    private readonly FAKESTORE_API = 'https://fakestoreapi.com'
    private readonly DUMMY_API = 'https://dummyjson.com'

    // Map of sample product IDs to local images in /public/images
    private readonly localImages: { [key: number]: string } = {
      1: '/images/women/clothing/dress.jpg',
      2: '/images/women/clothing/shirt%20rack.jpg',
      3: '/images/men/accessories/leather%20bag.jpg',
      4: '/images/women/clothing/floral.jpg',
      5: '/images/women/clothing/trench%20coat.jpg',
      6: '/images/men/accessories/wallet.jpg',
      7: '/images/women/clothing/silk.jpg',
      8: '/images/men/accessories/watch.jpg',
      101: '/images/men/clothing/fitted%20suit.jpg',
      102: '/images/men/clothing/polo%20shirt.jpg',
      104: '/images/men/accessories/watch.jpg',
      106: '/images/men/accessories/leather%20bag.jpg',
      107: '/images/men/clothing/floral%20shirt.jpg'
    };

    // Generate reliable placeholder images using Picsum
    private getReliableImage(productId: number, seed: string = 'fashion'): string {
      if (this.localImages[productId]) {
        return this.localImages[productId];
      }
      return `https://picsum.photos/seed/${seed}${productId}/400/500`
    }

  
    // Validate if an image URL is accessible
    private async validateImageUrl(url: string): Promise<string> {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        if (response.ok) {
          return url
        }
      } catch (error) {
        console.warn('Image validation failed:', url)
      }
      
      // Return fallback image
      const productId = Math.floor(Math.random() * 1000) + 1
      return this.getReliableImage(productId, 'fallback')
    }
  
    // Transform API data to our format
    private transformPlatziProduct(product: ApiProduct): FashionProduct {
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category.name,
        image: this.getReliableImage(product.id, 'platzi'),
        images: [this.getReliableImage(product.id, 'platzi')],
        brand: 'Epitome Elegance'
      }
    }
  
    // Get all products
    async getAllProducts(): Promise<FashionProduct[]> {
      try {
        // Try to get products from multiple sources for variety
        const [womensProducts, mensProducts] = await Promise.all([
          this.getWomensProducts(),
          this.getMensProducts()
        ])
  
        return [...womensProducts, ...mensProducts]
      } catch (error) {
        console.error('Error fetching all products:', error)
        return this.getFallbackProducts()
      }
    }
  
    // Get products by category
    async getProductsByCategory(categoryName: string): Promise<FashionProduct[]> {
      try {
        if (categoryName.toLowerCase().includes('women')) {
          return await this.getWomensProducts()
        } else if (categoryName.toLowerCase().includes('men')) {
          return await this.getMensProducts()
        } else {
          return await this.getAllProducts()
        }
      } catch (error) {
        console.error('Error fetching category products:', error)
        return this.getFallbackProducts()
      }
    }
  
    // Get women's products with reliable images
    async getWomensProducts(): Promise<FashionProduct[]> {
      try {
        // Use a combination of sample products and API data
        const sampleProducts = [
          {
            id: 1,
            title: "Elegant Evening Dress",
            description: "A stunning black evening dress perfect for special occasions and formal events",
            price: 8500,
            category: "women's clothing",
            image: this.getReliableImage(1, 'dress'),
            brand: "Epitome Elegance"
          },
          {
            id: 2,
            title: "Casual Summer Blouse",
            description: "Light and comfortable blouse perfect for everyday wear and casual outings",
            price: 3200,
            category: "women's clothing",
            image: this.getReliableImage(2, 'blouse'),
            brand: "Epitome Elegance"
          },
          {
            id: 3,
            title: "Designer Handbag",
            description: "Premium leather handbag with gold accents for the sophisticated woman",
            price: 12000,
            category: "accessories",
            image: this.getReliableImage(3, 'handbag'),
            brand: "Epitome Elegance"
          },
          {
            id: 4,
            title: "Floral Print Dress",
            description: "Beautiful floral pattern dress perfect for spring and summer occasions",
            price: 6500,
            category: "women's clothing",
            image: this.getReliableImage(4, 'floral'),
            brand: "Epitome Elegance"
          },
          {
            id: 5,
            title: "Business Blazer",
            description: "Professional blazer for the modern working woman, tailored to perfection",
            price: 9500,
            category: "women's clothing",
            image: this.getReliableImage(5, 'blazer'),
            brand: "Epitome Elegance"
          },
          {
            id: 6,
            title: "Evening Clutch",
            description: "Elegant clutch bag perfect for special occasions and evening events",
            price: 4500,
            category: "accessories",
            image: this.getReliableImage(6, 'clutch'),
            brand: "Epitome Elegance"
          },
          {
            id: 7,
            title: "Silk Scarf Collection",
            description: "Premium silk scarves in various patterns and colors",
            price: 2800,
            category: "accessories",
            image: this.getReliableImage(7, 'scarf'),
            brand: "Epitome Elegance"
          },
          {
            id: 8,
            title: "High Heel Pumps",
            description: "Classic black pumps with comfortable fit and elegant design",
            price: 7200,
            category: "shoes",
            image: this.getReliableImage(8, 'pumps'),
            brand: "Epitome Elegance"
          }
        ]
  
        return sampleProducts.map(product => ({
          ...product,
          images: [product.image],
          rating: {
            rate: Math.random() * 2 + 3, // 3-5 stars
            count: Math.floor(Math.random() * 100) + 10
          }
        }))
      } catch (error) {
        console.error('Error fetching women\'s products:', error)
        return this.getFallbackProducts().filter(p => p.category === "women's clothing")
      }
    }
  
    // Get men's products with reliable images
    async getMensProducts(): Promise<FashionProduct[]> {
      try {
        const sampleProducts = [
          {
            id: 101,
            title: "Premium Business Suit",
            description: "Tailored to perfection, classic style with modern fit for the professional man",
            price: 25000,
            category: "men's clothing",
            image: this.getReliableImage(101, 'suit'),
            brand: "Epitome Elegance"
          },
          {
            id: 102,
            title: "Casual Polo Shirt",
            description: "Comfortable cotton polo shirt perfect for casual and semi-formal occasions",
            price: 4500,
            category: "men's clothing",
            image: this.getReliableImage(102, 'polo'),
            brand: "Epitome Elegance"
          },
          {
            id: 103,
            title: "Leather Dress Shoes",
            description: "Premium leather Oxford shoes for the distinguished gentleman",
            price: 15000,
            category: "shoes",
            image: this.getReliableImage(103, 'oxford'),
            brand: "Epitome Elegance"
          },
          {
            id: 104,
            title: "Designer Watch",
            description: "Luxury timepiece with leather strap and Swiss movement",
            price: 22000,
            category: "accessories",
            image: this.getReliableImage(104, 'watch'),
            brand: "Epitome Elegance"
          },
          {
            id: 105,
            title: "Casual Jeans",
            description: "Premium denim jeans with perfect fit and lasting comfort",
            price: 6800,
            category: "men's clothing",
            image: this.getReliableImage(105, 'jeans'),
            brand: "Epitome Elegance"
          },
          {
            id: 106,
            title: "Executive Briefcase",
            description: "Genuine leather briefcase for the modern professional",
            price: 18500,
            category: "accessories",
            image: this.getReliableImage(106, 'briefcase'),
            brand: "Epitome Elegance"
          },
          {
            id: 107,
            title: "Formal Shirt Collection",
            description: "Premium cotton shirts in various colors and patterns",
            price: 5200,
            category: "men's clothing",
            image: this.getReliableImage(107, 'shirt'),
            brand: "Epitome Elegance"
          },
          {
            id: 108,
            title: "Casual Sneakers",
            description: "Comfortable and stylish sneakers for everyday wear",
            price: 8900,
            category: "shoes",
            image: this.getReliableImage(108, 'sneakers'),
            brand: "Epitome Elegance"
          }
        ]
  
        return sampleProducts.map(product => ({
          ...product,
          images: [product.image],
          rating: {
            rate: Math.random() * 2 + 3, // 3-5 stars
            count: Math.floor(Math.random() * 80) + 15
          }
        }))
      } catch (error) {
        console.error('Error fetching men\'s products:', error)
        return this.getFallbackProducts().filter(p => p.category === "men's clothing")
      }
    }
  
    // Fallback products if all APIs fail
    private getFallbackProducts(): FashionProduct[] {
      return [
        {
          id: 1001,
          title: "Elegant Evening Dress",
          description: "A stunning evening dress perfect for special occasions",
          price: 8500,
          category: "women's clothing",
          image: this.getReliableImage(1001, 'elegant'),
          images: [this.getReliableImage(1001, 'elegant')],
          brand: "Epitome Elegance"
        },
        {
          id: 1002,
          title: "Premium Men's Suit",
          description: "Tailored to perfection, classic style with modern fit",
          price: 25000,
          category: "men's clothing",
          image: this.getReliableImage(1002, 'premium'),
          images: [this.getReliableImage(1002, 'premium')],
          brand: "Epitome Elegance"
        },
        {
          id: 1003,
          title: "Designer Handbag",
          description: "Premium leather handbag for everyday elegance",
          price: 12000,
          category: "accessories",
          image: this.getReliableImage(1003, 'designer'),
          images: [this.getReliableImage(1003, 'designer')],
          brand: "Epitome Elegance"
        }
      ]
    }
  
    // Get new arrivals (recent products)
    async getNewArrivals(): Promise<FashionProduct[]> {
      try {
        const allProducts = await this.getAllProducts()
        // Simulate new arrivals by taking first 12 products and marking them as new
        return allProducts.slice(0, 12).map(product => ({
          ...product,
          title: `NEW: ${product.title}`,
          price: product.price * 0.9 // 10% launch discount
        }))
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
        return this.getFallbackProducts()
      }
    }
  
    // Get sale products (products with discounts)
    async getSaleProducts(): Promise<FashionProduct[]> {
      try {
        const allProducts = await this.getAllProducts()
        // Simulate sale by adding compare prices and discounts
        return allProducts.map(product => ({
          ...product,
          price: product.price * (0.6 + Math.random() * 0.3), // 30-40% off
          originalPrice: product.price,
          isOnSale: true
        })).filter(() => Math.random() > 0.3) // Only 70% of products on sale
      } catch (error) {
        console.error('Error fetching sale products:', error)
        return this.getFallbackProducts()
      }
    }
  
    // Search products by query
    async searchProducts(query: string): Promise<FashionProduct[]> {
      try {
        const allProducts = await this.getAllProducts()
        
        if (!query.trim()) return []
        
        const searchTerm = query.toLowerCase()
        
        return allProducts.filter(product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm))
        )
      } catch (error) {
        console.error('Error searching products:', error)
        return []
      }
    }
  
    // Get featured products
    async getFeaturedProducts(): Promise<FashionProduct[]> {
      try {
        const allProducts = await this.getAllProducts()
        // Return random selection of products as featured
        const shuffled = allProducts.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, 8)
      } catch (error) {
        console.error('Error fetching featured products:', error)
        return this.getFallbackProducts()
      }
    }
  
    // Get products by price range
    async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<FashionProduct[]> {
      try {
        const allProducts = await this.getAllProducts()
        return allProducts.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        )
      } catch (error) {
        console.error('Error fetching products by price range:', error)
        return []
      }
    }
  
    // Get product categories
    async getCategories(): Promise<string[]> {
      try {
        const allProducts = await this.getAllProducts()
        const categories = [...new Set(allProducts.map(product => product.category))]
        return categories
      } catch (error) {
        console.error('Error fetching categories:', error)
        return ['women\'s clothing', 'men\'s clothing', 'accessories', 'shoes']
      }
    }
  
    // Get trending products (most popular)
    async getTrendingProducts(): Promise<FashionProduct[]> {
      try {
        const allProducts = await this.getAllProducts()
        // Sort by rating and return top products
        return allProducts
          .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
          .slice(0, 10)
      } catch (error) {
        console.error('Error fetching trending products:', error)
        return this.getFallbackProducts()
      }
    }
  }
  
  // Export singleton instance
  export const fashionDataService = new FashionDataService()
  
  // Export types for use in other files
  export type { FashionProduct, ApiProduct, FakeStoreProduct }
  