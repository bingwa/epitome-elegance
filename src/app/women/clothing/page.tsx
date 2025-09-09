import { fashionDataService } from '@/lib/dataFetcher'
import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Women's Clothing | Epitome Elegance",
  description: "Premium women's clothing collection.",
}

// Fix the function signature and await searchParams
export default async function WomensClothingPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  // Await searchParams before accessing its properties
  const params = await searchParams
  
  const page = parseInt(params.page as string || '1')
  const limit = 12

  const sortOptions: Record<string, any> = {
    'price-low': { price: 'asc' },
    'price-high': { price: 'desc' },
    'newest': { createdAt: 'desc' },
    'name': { name: 'asc' }
  }

  const sort = sortOptions[params.sort as string || 'newest'] || { createdAt: 'desc' }

  let products: any[] = []
  let pagination = { current: 1, pages: 1, total: 0 }

  try {
    const allProducts = await fashionDataService.getWomensProducts()
    
    // Filter for clothing items
    let filtered = allProducts.filter(product => 
      product.category.toLowerCase().includes('clothing') ||
      product.title.toLowerCase().includes('dress') ||
      product.title.toLowerCase().includes('shirt')
    )

    // Apply price filters using the awaited params
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

    // Transform to your format
    products = paginatedProducts.map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: product.price,
      stockQuantity: Math.floor(Math.random() * 50) + 10,
      brand: 'Epitome Elegance',
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [{ id: '1', size: 'M', color: 'Default', stock: 20, price: product.price }],
      category: { name: 'Clothing', gender: 'FEMALE' }
    }))

    pagination = { 
      current: page, 
      pages: Math.ceil(filtered.length / limit), 
      total: filtered.length 
    }
  } catch (error) {
    console.error('Error fetching clothing:', error)
  }

  return (
    <CategoryPage
      category={{
        id: 'womens-clothing',
        name: "Women's Clothing",
        slug: 'clothing',
        description: 'Elegant dresses, tops, and clothing pieces for the modern woman'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params} // Pass the awaited params
      gender="women"
    />
  )
}
