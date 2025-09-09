import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Women's Bags | Epitome Elegance",
  description: "Luxury handbags, purses, and accessories for the elegant woman.",
}

export default async function WomensBagsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')
  const limit = 12

  // Generate sample bag products
  const bagProducts = [
    {
      id: 101,
      title: "Designer Leather Handbag",
      description: "Premium Italian leather handbag with gold hardware",
      price: 12000,
      image: "https://picsum.photos/seed/bag1/400/500",
      category: "bags"
    },
    {
      id: 102,
      title: "Evening Clutch Bag",
      description: "Elegant clutch perfect for special occasions",
      price: 4500,
      image: "https://picsum.photos/seed/clutch1/400/500",
      category: "bags"
    },
    {
      id: 103,
      title: "Crossbody Messenger Bag",
      description: "Stylish and functional crossbody bag for everyday use",
      price: 7800,
      image: "https://picsum.photos/seed/crossbody1/400/500",
      category: "bags"
    },
    {
      id: 104,
      title: "Tote Bag - Large",
      description: "Spacious tote bag perfect for work or shopping",
      price: 9200,
      image: "https://picsum.photos/seed/tote1/400/500",
      category: "bags"
    },
    {
      id: 105,
      title: "Mini Shoulder Bag",
      description: "Compact shoulder bag with chain strap",
      price: 5600,
      image: "https://picsum.photos/seed/mini1/400/500",
      category: "bags"
    },
    {
      id: 106,
      title: "Backpack - Urban Style",
      description: "Trendy leather backpack for the modern woman",
      price: 11500,
      image: "https://picsum.photos/seed/backpack1/400/500",
      category: "bags"
    }
  ]

  let filtered = bagProducts

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
    comparePrice: Math.random() > 0.7 ? product.price * 1.15 : undefined,
    stockQuantity: Math.floor(Math.random() * 30) + 5,
    brand: 'Epitome Elegance',
    isActive: true,
    isFeatured: Math.random() > 0.7,
    images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
    variants: [{ 
      id: '1', 
      size: 'Standard', 
      color: ['Black', 'Brown', 'Tan', 'Navy'][Math.floor(Math.random() * 4)], 
      colorHex: ['#000000', '#8B4513', '#D2B48C', '#000080'][Math.floor(Math.random() * 4)],
      stock: Math.floor(Math.random() * 15) + 3, 
      price: product.price 
    }],
    category: { name: 'Bags', gender: 'FEMALE' },
    _count: { reviews: Math.floor(Math.random() * 75) },
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
        id: 'womens-bags',
        name: "Women's Bags",
        slug: 'bags',
        description: 'Luxury handbags, purses, and accessories for the elegant woman'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="women"
    />
  )
}
