import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Women's New Arrivals | Epitome Elegance",
  description: "Latest fashion pieces for women - Fresh styles just landed.",
}

export default async function WomensNewArrivalsPage({ 
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
    const allProducts = await fashionDataService.getWomensProducts()
    
    // Simulate new arrivals by taking recent products
    let filtered = allProducts.slice(0, 8) // Take first 8 as "new arrivals"

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
      isFeatured: true, // Mark all new arrivals as featured
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [{ 
        id: '1', 
        size: 'M', 
        color: 'Default', 
        colorHex: '#000000',
        stock: 20, 
        price: product.price 
      }],
      category: { name: 'New Arrivals', gender: 'FEMALE' },
      _count: { reviews: Math.floor(Math.random() * 20) }, // Fewer reviews for new items
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
        id: 'womens-new-arrivals',
        name: "Women's New Arrivals",
        slug: 'new-arrivals',
        description: 'Latest fashion pieces for women - Fresh styles just landed'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="women"
    />
  )
}
