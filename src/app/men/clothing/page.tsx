import { CategoryPage } from '@/components/category/CategoryPage'
import { getProductsByCategory } from '@/lib/categoryProducts'

export const dynamic = 'force-dynamic'


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

  const { products, pagination } = await getProductsByCategory('Clothing', {
    page,
    limit: 12,
    minPrice: params.min_price ? parseFloat(params.min_price as string) : undefined,
    maxPrice: params.max_price ? parseFloat(params.max_price as string) : undefined,
    sort: params.sort as string,
    gender: 'MALE'
  })

  const category = {
    name: "Clothing",
    slug: "clothing",
    description: "Premium suits, shirts, and clothing for the modern gentleman.",
    gender: 'MALE'
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
      gender="mens"
    />
  )
}
