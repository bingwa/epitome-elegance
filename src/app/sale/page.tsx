import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Sale | Epitome Elegance",
  description: "Amazing deals on premium fashion - Limited time offers on luxury clothing and accessories.",
}

export default async function SalePage({ 
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
    
    // Combine all products and add sale prices
    const allProducts = [...womensProducts, ...mensProducts]

    // Apply discounts to simulate sale items
    let saleProducts = allProducts.map(product => ({
      ...product,
      originalPrice: product.price,
      price: product.price * (0.6 + Math.random() * 0.3), // 30-40% off
      isOnSale: true
    }))

    // Apply price filters
    if (params.min_price) {
      saleProducts = saleProducts.filter(p => p.price >= parseFloat(params.min_price as string))
    }
    if (params.max_price) {
      saleProducts = saleProducts.filter(p => p.price <= parseFloat(params.max_price as string))
    }

    // Sort products (with special discount sort option)
    const sortOptions: Record<string, any> = {
      'price-low': (a: any, b: any) => a.price - b.price,
      'price-high': (a: any, b: any) => b.price - a.price,
      'newest': (a: any, b: any) => b.id - a.id,
      'discount': (a: any, b: any) => (b.originalPrice - b.price) - (a.originalPrice - a.price),
      'name': (a: any, b: any) => a.title.localeCompare(b.title)
    }

    const sortFn = sortOptions[params.sort as string || 'discount']
    if (sortFn) {
      saleProducts.sort(sortFn)
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = saleProducts.slice(startIndex, endIndex)

    products = paginatedProducts.map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: Math.round(product.price),
      comparePrice: Math.round(product.originalPrice),
      stockQuantity: Math.floor(Math.random() * 20) + 5, // Lower stock for sale items
      brand: 'Epitome Elegance',
      isActive: true,
      isFeatured: true,
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [{ 
        id: '1', 
        size: 'M', 
        color: 'Default', 
        colorHex: '#000000',
        stock: Math.floor(Math.random() * 15) + 3, 
        price: Math.round(product.price)
      }],
      category: { 
        name: 'Sale', 
        gender: product.category.includes('women') ? 'FEMALE' : 'MALE' 
      },
      _count: { reviews: Math.floor(Math.random() * 80) },
      averageRating: Math.random() * 2 + 3,
      tags: 'sale,discount,offer,limited'
    }))

    pagination = { 
      current: page, 
      pages: Math.ceil(saleProducts.length / limit), 
      total: saleProducts.length 
    }
  } catch (error) {
    console.error('Error fetching sale products:', error)
  }

  return (
    <CategoryPage
      category={{
        id: 'sale',
        name: 'Sale',
        slug: 'sale',
        description: 'Amazing deals on premium fashion - Limited time offers'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="all"
    />
  )
}
