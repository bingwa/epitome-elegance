import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: 'All Products | Epitome Elegance',
  description: 'Browse every women & men product currently available at Epitome Elegance.'
}

export default async function AllProductsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = parseInt((params.page as string) || '1')
  const limit = 12

  let products: any[] = []
  let pagination = { current: 1, pages: 1, total: 0 }

  try {
    const allProducts = await fashionDataService.getAllProducts()

    // Optionally filters
    let filtered = allProducts
    if (params.brand) {
      filtered = filtered.filter(p => (p.brand || '').toLowerCase() === (params.brand as string).toLowerCase())
    }
    if (params.cat) {
      filtered = filtered.filter(p => p.category.toLowerCase() === (params.cat as string).toLowerCase())
    }
    if (params.min_price) {
      filtered = filtered.filter(p => p.price >= parseFloat(params.min_price as string))
    }
    if (params.max_price) {
      filtered = filtered.filter(p => p.price <= parseFloat(params.max_price as string))
    }

    // Sort
    const sortOptions: Record<string, any> = {
      'price-low': (a: any, b: any) => a.price - b.price,
      'price-high': (a: any, b: any) => b.price - a.price,
      'newest': (a: any, b: any) => b.id - a.id,
      'name': (a: any, b: any) => a.title.localeCompare(b.title)
    }
    const sortFn = sortOptions[(params.sort as string) || 'newest']
    if (sortFn) filtered.sort(sortFn)

    // Pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)

    // Transform minimal product structure to expected by components
    products = paginated.map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: Math.round(product.price),
      comparePrice: undefined,
      stockQuantity: Math.floor(Math.random() * 30) + 5,
      brand: product.brand || 'Epitome Elegance',
      isActive: true,
      images: [
        {
          id: '1',
          url: product.image,
          altText: product.title,
          isMain: true
        }
      ],
      variants: [
        {
          id: '1',
          size: 'M',
          color: 'Default',
          colorHex: '#000000',
          stock: Math.floor(Math.random() * 20) + 3,
          price: Math.round(product.price)
        }
      ],
      category: { name: product.category, gender: product.category.includes('men') ? 'MALE' : product.category.includes('women') ? 'FEMALE' : 'UNISEX' },
      _count: { reviews: Math.floor(Math.random() * 100) },
      averageRating: Math.random() * 2 + 3
    }))

    pagination = {
      current: page,
      pages: Math.ceil(filtered.length / limit),
      total: filtered.length
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <CategoryPage
      category={{ id: 'all', name: 'All Products', slug: 'all', description: 'Every item available in our store' }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="all"
    />
  )
}
