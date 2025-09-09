import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Women's Fashion | Epitome Elegance",
  description: "Discover luxury women's fashion at Epitome Elegance.",
}

export default async function WomensPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  // Await searchParams first
  const params = await searchParams
  
  const page = parseInt(params.page as string || '1')
  const limit = 12

  let products: any[] = []
  let pagination = { current: 1, pages: 1, total: 0 }

  try {
    const allProducts = await fashionDataService.getWomensProducts()
    
    // Apply filters using awaited params
    let filtered = allProducts
    
    if (params.min_price) {
      filtered = filtered.filter(p => p.price >= parseFloat(params.min_price as string))
    }
    if (params.max_price) {
      filtered = filtered.filter(p => p.price <= parseFloat(params.max_price as string))
    }

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filtered.slice(startIndex, endIndex)

    // Transform products
    products = paginatedProducts.map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: product.price,
      stockQuantity: Math.floor(Math.random() * 50) + 10,
      brand: 'Epitome Elegance',
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [{ id: '1', size: 'M', color: 'Default', stock: 20, price: product.price }],
      category: { name: 'Clothing', gender: 'FEMALE' },
      _count: { reviews: Math.floor(Math.random() * 50) },
      averageRating: Math.random() * 2 + 3
    }))

    pagination = { 
      current: page, 
      pages: Math.ceil(filtered.length / limit), 
      total: filtered.length 
    }
  } catch (error) {
    console.error('Error fetching women\'s products:', error)
  }

  return (
    <CategoryPage
      category={{
        id: 'women',
        name: "Women's Collection",
        slug: 'women',
        description: 'Elegant fashion pieces for the modern woman'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="women"
    />
  )
}
