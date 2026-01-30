import { CategoryPage } from '@/components/category/CategoryPage'
import { getAllProductsByGender } from '@/lib/categoryProducts'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Men's Fashion | Epitome Elegance",
  description: "Premium men's fashion at Epitome Elegance. Luxury clothing, accessories, and watches for the modern Kenyan gentleman.",
}

export default async function MensPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')

  // Use REAL database query instead of fake data
  const { products, pagination } = await getAllProductsByGender('MALE', {
    page,
    limit: 12,
    minPrice: params.min_price ? parseFloat(params.min_price as string) : undefined,
    maxPrice: params.max_price ? parseFloat(params.max_price as string) : undefined,
    sort: params.sort as string || 'newest'
  })

  // Calculate price range from real products
  const priceRange = {
    min: products.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
    max: products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000
  }

  return (
    <CategoryPage
      category={{
        id: 'men',
        name: "Men's Collection",
        slug: 'men',
        description: 'Sophisticated fashion for the modern gentleman. Premium clothing, accessories, and timepieces.',
        gender: 'MALE'
      }}
      products={products}
      pagination={pagination}
      priceRange={priceRange}
      searchParams={params}
      gender="mens"
    />
  )
}
