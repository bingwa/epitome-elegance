import { CategoryPage } from '@/components/category/CategoryPage'
import { getFeaturedProducts } from '@/lib/categoryProducts'

export const metadata = {
  title: "Men's New Arrivals | Epitome Elegance",
  description: "Latest fashion pieces for men - Fresh styles just landed.",
}

export default async function MensNewArrivalsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')
  const limit = 12

  const allProducts = await getFeaturedProducts('MALE', 50)
  
  let filtered = allProducts

  if (params.min_price) {
    filtered = filtered.filter(p => p.price >= parseFloat(params.min_price as string))
  }

  if (params.max_price) {
    filtered = filtered.filter(p => p.price <= parseFloat(params.max_price as string))
  }

  const sortOptions: Record<string, (a: any, b: any) => number> = {
    'price-low': (a, b) => a.price - b.price,
    'price-high': (a, b) => b.price - a.price,
    'newest': (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    'name': (a, b) => a.name.localeCompare(b.name)
  }

  const sortFn = sortOptions[params.sort as string || 'newest']
  if (sortFn) {
    filtered.sort(sortFn)
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filtered.slice(startIndex, endIndex)

  const category = {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest fashion pieces for men - Fresh styles just landed.",
    gender: 'MALE'
  }

  const priceRange = {
    min: Math.min(...allProducts.map(p => p.price)),
    max: Math.max(...allProducts.map(p => p.price))
  }

  const pagination = {
    current: page,
    pages: Math.ceil(filtered.length / limit),
    total: filtered.length
  }

  return (
    <CategoryPage
      category={category}
      products={paginatedProducts}
      pagination={pagination}
      priceRange={priceRange}
      searchParams={params}
      gender="mens"
    />
  )
}
