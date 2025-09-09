import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Men's Clothing | Epitome Elegance",
  description: "Premium suits, shirts, and clothing for the modern gentleman.",
}

export default async function MensClothingPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')
  const limit = 12

  let products: any[] = []
  let pagination = { current: 1, pages: 1, total: 0 }

  try {
    const allProducts = await fashionDataService.getMensProducts()
    
    // Filter for clothing items
    let filtered = allProducts.filter(product => 
      product.category.toLowerCase().includes('clothing') ||
      product.title.toLowerCase().includes('shirt') ||
      product.title.toLowerCase().includes('jacket') ||
      product.title.toLowerCase().includes('hoodie') ||
      product.title.toLowerCase().includes('sweater')
    )

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

    products = paginatedProducts.map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: product.price,
      comparePrice: Math.random() > 0.6 ? product.price * 1.15 : undefined,
      stockQuantity: Math.floor(Math.random() * 35) + 10,
      brand: 'Epitome Elegance',
      isActive: true,
      isFeatured: Math.random() > 0.8,
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [
        { id: '1', size: 'S', color: 'Navy', colorHex: '#000080', stock: 5, price: product.price },
        { id: '2', size: 'M', color: 'Navy', colorHex: '#000080', stock: 8, price: product.price },
        { id: '3', size: 'L', color: 'Black', colorHex: '#000000', stock: 6, price: product.price },
        { id: '4', size: 'XL', color: 'Black', colorHex: '#000000', stock: 4, price: product.price }
      ],
      category: { name: 'Clothing', gender: 'MALE' },
      _count: { reviews: Math.floor(Math.random() * 80) },
      averageRating: Math.random() * 2 + 3
    }))

    pagination = { 
      current: page, 
      pages: Math.ceil(filtered.length / limit), 
      total: filtered.length 
    }
  } catch (error) {
    console.error('Error fetching men\'s clothing:', error)
  }

  return (
    <CategoryPage
      category={{
        id: 'mens-clothing',
        name: "Men's Clothing",
        slug: 'clothing',
        description: 'Premium suits, shirts, and clothing for the modern gentleman'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="men"
    />
  )
}
