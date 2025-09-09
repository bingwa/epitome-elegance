import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Men's Accessories | Epitome Elegance",
  description: "Luxury watches, briefcases, and accessories for the sophisticated man.",
}

export default async function MensAccessoriesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')
  const limit = 12

  // Generate sample men's accessories
  const accessoryProducts = [
    {
      id: 401,
      title: "Luxury Business Watch",
      description: "Premium Swiss-made watch with leather strap",
      price: 22000,
      image: "https://picsum.photos/seed/watch1/400/500"
    },
    {
      id: 402,
      title: "Executive Briefcase",
      description: "Genuine leather briefcase for the modern professional",
      price: 18500,
      image: "https://picsum.photos/seed/briefcase1/400/500"
    },
    {
      id: 403,
      title: "Designer Wallet",
      description: "Premium leather wallet with RFID protection",
      price: 4800,
      image: "https://picsum.photos/seed/wallet1/400/500"
    },
    {
      id: 404,
      title: "Silk Tie Collection",
      description: "Hand-crafted silk ties in classic patterns",
      price: 3200,
      image: "https://picsum.photos/seed/tie1/400/500"
    },
    {
      id: 405,
      title: "Leather Belt - Premium",
      description: "Italian leather belt with silver buckle",
      price: 5600,
      image: "https://picsum.photos/seed/belt1/400/500"
    },
    {
      id: 406,
      title: "Cufflinks Set",
      description: "Elegant silver cufflinks for formal wear",
      price: 6800,
      image: "https://picsum.photos/seed/cufflinks1/400/500"
    },
    {
      id: 407,
      title: "Messenger Bag",
      description: "Canvas and leather messenger bag for daily use",
      price: 12000,
      image: "https://picsum.photos/seed/messenger1/400/500"
    },
    {
      id: 408,
      title: "Sunglasses - Designer",
      description: "Premium sunglasses with polarized lenses",
      price: 8900,
      image: "https://picsum.photos/seed/sunglasses1/400/500"
    }
  ]

  let filtered = accessoryProducts

  // Apply price filters
  if (params.min_price) {
    filtered = filtered.filter(p => p.price >= parseFloat(params.min_price as string))
  }
  if (params.max_price) {
    filtered = filtered.filter(p => p.price <= parseFloat(params.max_price as string))
  }

  // Sort products
  const sortOptions: Record<string, any> = {
    'price-low': (a: any, b: any) => a.price - b.price,
    'price-high': (a: any, b: any) => b.price - a.price,
    'newest': (a: any, b: any) => b.id - a.id,
    'name': (a: any, b: any) => a.title.localeCompare(b.title)
  }

  const sortFn = sortOptions[params.sort as string || 'newest']
  if (sortFn) {
    filtered.sort(sortFn)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filtered.slice(startIndex, endIndex)

  const products = paginatedProducts.map(product => ({
    id: product.id.toString(),
    name: product.title,
    slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
    price: product.price,
    comparePrice: Math.random() > 0.7 ? product.price * 1.2 : undefined,
    stockQuantity: Math.floor(Math.random() * 25) + 5,
    brand: 'Epitome Elegance',
    isActive: true,
    isFeatured: Math.random() > 0.6,
    images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
    variants: [{ 
      id: '1', 
      size: 'Standard', 
      color: ['Black', 'Brown', 'Navy', 'Silver'][Math.floor(Math.random() * 4)], 
      colorHex: ['#000000', '#8B4513', '#000080', '#C0C0C0'][Math.floor(Math.random() * 4)],
      stock: Math.floor(Math.random() * 12) + 3, 
      price: product.price 
    }],
    category: { name: 'Accessories', gender: 'MALE' },
    _count: { reviews: Math.floor(Math.random() * 70) },
    averageRating: Math.random() * 1.5 + 3.5
  }))

  const pagination = { 
    current: page, 
    pages: Math.ceil(filtered.length / limit), 
    total: filtered.length 
  }

  return (
    <CategoryPage
      category={{
        id: 'mens-accessories',
        name: "Men's Accessories",
        slug: 'accessories',
        description: 'Luxury watches, briefcases, and accessories for the sophisticated man'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="men"
    />
  )
}
