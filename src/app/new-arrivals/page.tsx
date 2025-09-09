import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "New Arrivals | Epitome Elegance",
  description: "Fresh styles just landed from our latest collection - Discover the newest fashion pieces.",
}

export default async function NewArrivalsPage({ 
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
    const [womensProducts, mensProducts] = await Promise.all([
      fashionDataService.getWomensProducts(),
      fashionDataService.getMensProducts()
    ])
    
    // Combine and simulate new arrivals
    const allProducts = [...womensProducts.slice(0, 8), ...mensProducts.slice(0, 6)]

    let filtered = allProducts

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
      stockQuantity: Math.floor(Math.random() * 30) + 10,
      brand: 'Epitome Elegance',
      isActive: true,
      isFeatured: true,
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [{ 
        id: '1', 
        size: 'M', 
        color: 'Default', 
        colorHex: '#000000',
        stock: 20, 
        price: product.price 
      }],
      category: { 
        name: 'New Arrivals', 
        gender: product.category.includes('women') ? 'FEMALE' : 'MALE' 
      },
      _count: { reviews: Math.floor(Math.random() * 25) },
      averageRating: Math.random() * 2 + 3,
      tags: 'new,arrival,latest,trending'
    }))

    pagination = { 
      current: page, 
      pages: Math.ceil(filtered.length / limit), 
      total: filtered.length 
    }
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
  }

  return (
    <CategoryPage
      category={{
        id: 'new-arrivals',
        name: 'New Arrivals',
        slug: 'new-arrivals',
        description: 'Fresh styles just landed from our latest collection'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="all"
    />
  )
}
