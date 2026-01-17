import { CategoryPage } from '@/components/category/CategoryPage'
import { getProductsByCategory } from '@/lib/categoryProducts'

export const metadata = {
  title: "Women's Bags | Epitome Elegance",
  description: "Luxury handbags, purses, and accessories for the elegant woman.",
}

export default async function WomensBagsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')

  const { products, pagination } = await getProductsByCategory('Bags', {
    page,
    limit: 12,
    minPrice: params.min_price ? parseFloat(params.min_price as string) : undefined,
    maxPrice: params.max_price ? parseFloat(params.max_price as string) : undefined,
    sort: params.sort as string,
    gender: 'FEMALE'
  })

  const category = {
    name: "Bags",
    slug: "bags",
    description: "Luxury handbags, purses, and accessories for the elegant woman.",
    gender: 'FEMALE'
  }

  const priceRange = {
    min: products.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
    max: products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000
  }

  return (
    <CategoryPage
      category={category}
      products={products}
      pagination={pagination}
      priceRange={priceRange}
      searchParams={params}
      gender="womens"
    />
  )
}
