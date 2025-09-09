import { fashionDataService } from '@/lib/dataFetcher'
import { ModernHomepage } from '@/components/home/ModernHomepage'

async function getFeaturedProducts() {
  try {
    const products = await fashionDataService.getAllProducts()
    // Convert API data to our Prisma format for compatibility
    return products.slice(0, 8).map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: product.price,
      comparePrice: product.price * 1.2, // Add some discount simulation
      stockQuantity: Math.floor(Math.random() * 50) + 10,
      brand: product.brand,
      images: [{
        id: '1',
        url: product.image,
        altText: product.title,
        isMain: true
      }],
      variants: [{
        id: '1',
        size: 'M',
        color: 'Default',
        colorHex: '#000000',
        stock: Math.floor(Math.random() * 20) + 5,
        price: product.price
      }],
      category: {
        name: product.category,
        gender: product.category.includes("women") ? "FEMALE" : product.category.includes("men") ? "MALE" : "UNISEX"
      }
    }))
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
}

async function getNewArrivals() {
  try {
    const products = await fashionDataService.getNewArrivals()
    return products.slice(0, 8).map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: product.price,
      stockQuantity: Math.floor(Math.random() * 30) + 10,
      brand: product.brand,
      images: [{
        id: '1',
        url: product.image,
        altText: product.title,
        isMain: true
      }],
      variants: [{
        id: '1',
        size: 'M',
        color: 'Default',
        stock: Math.floor(Math.random() * 20) + 5,
        price: product.price
      }]
    }))
  } catch (error) {
    console.error('Failed to fetch new arrivals:', error)
    return []
  }
}

async function getCategories() {
  // Return static categories that match your navigation
  return [
    {
      id: '1',
      name: 'Clothing',
      slug: 'clothing',
      gender: 'FEMALE',
      description: "Women's premium clothing collection",
      image: 'https://picsum.photos/seed/women-clothing/600/800'
    },
    {
      id: '2',
      name: 'Bags',
      slug: 'bags',
      gender: 'FEMALE',
      description: "Luxury handbags and accessories",
      image: 'https://picsum.photos/seed/women-bags/600/800'
    },
    {
      id: '3',
      name: 'Clothing',
      slug: 'clothing',
      gender: 'MALE',
      description: "Men's premium clothing collection",
      image: 'https://picsum.photos/seed/men-clothing/600/800'
    },
    {
      id: '4',
      name: 'Accessories',
      slug: 'accessories',
      gender: 'MALE',
      description: "Men's luxury accessories",
      image: 'https://picsum.photos/seed/men-accessories/600/800'
    }
  ]
}

export default async function Home() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories()
  ])

  return (
    <ModernHomepage 
      featuredProducts={featuredProducts}
      newArrivals={newArrivals}
      categories={categories}
    />
  )
}
