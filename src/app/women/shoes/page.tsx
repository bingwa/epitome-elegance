import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Women's Shoes | Epitome Elegance",
  description: "Elegant heels, flats, and footwear for every occasion.",
}

export default async function WomensShoesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')
  const limit = 12

  // Generate sample shoe products
  const shoeProducts = [
    {
      id: 201,
      title: "Classic Black Heels",
      description: "Timeless black stiletto heels perfect for any formal occasion",
      price: 8500,
      image: "https://picsum.photos/seed/heels1/400/500"
    },
    {
      id: 202,
      title: "Comfortable Ballet Flats",
      description: "Elegant and comfortable flats for everyday wear",
      price: 5200,
      image: "https://picsum.photos/seed/flats1/400/500"
    },
    {
      id: 203,
      title: "Ankle Boots - Leather",
      description: "Stylish leather ankle boots with zipper closure",
      price: 11000,
      image: "https://picsum.photos/seed/boots1/400/500"
    },
    {
      id: 204,
      title: "Strappy Sandals",
      description: "Elegant strappy sandals perfect for summer events",
      price: 6800,
      image: "https://picsum.photos/seed/sandals1/400/500"
    },
    {
      id: 205,
      title: "Platform Wedges",
      description: "Comfortable platform wedges with ankle strap",
      price: 7500,
      image: "https://picsum.photos/seed/wedges1/400/500"
    },
    {
      id: 206,
      title: "Sneakers - Designer",
      description: "Luxury designer sneakers for casual elegance",
      price: 13500,
      image: "https://picsum.photos/seed/sneakers1/400/500"
    }
  ]

  let filtered = shoeProducts

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
    comparePrice: Math.random() > 0.8 ? product.price * 1.2 : undefined,
    stockQuantity: Math.floor(Math.random() * 40) + 10,
    brand: 'Epitome Elegance',
    isActive: true,
    isFeatured: Math.random() > 0.6,
    images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
    variants: [
      { id: '1', size: '36', color: 'Black', colorHex: '#000000', stock: 5, price: product.price },
      { id: '2', size: '37', color: 'Black', colorHex: '#000000', stock: 5, price: product.price },
      { id: '3', size: '38', color: 'Black', colorHex: '#000000', stock: 5, price: product.price },
      { id: '4', size: '39', color: 'Black', colorHex: '#000000', stock: 5, price: product.price },
      { id: '5', size: '40', color: 'Black', colorHex: '#000000', stock: 3, price: product.price }
    ],
    category: { name: 'Shoes', gender: 'FEMALE' },
    _count: { reviews: Math.floor(Math.random() * 80) },
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
        id: 'womens-shoes',
        name: "Women's Shoes",
        slug: 'shoes',
        description: 'Elegant heels, flats, and footwear for every occasion'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="women"
    />
  )
}
