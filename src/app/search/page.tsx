import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { SearchResults } from '@/components/search/SearchResults'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    sort?: string
    min_price?: string
    max_price?: string
    page?: string
  }>
}

async function getSearchResults(query: string, searchParams: any) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  const sortOptions: Record<string, any> = {
    'price-low': { price: 'asc' },
    'price-high': { price: 'desc' },
    'newest': { createdAt: 'desc' },
    'popular': { id: 'desc' },
    'name': { name: 'asc' }
  }

  const sort = sortOptions[searchParams.sort || 'newest'] || { createdAt: 'desc' }

  const where: any = {
    isActive: true,
    OR: [
      {
        name: {
          contains: query,
        },
      },
      {
        description: {
          contains: query,
        },
      },
      {
        tags: {
          contains: query,
        },
      },
      {
        brand: {
          contains: query,
        },
      }
    ]
  }

  if (searchParams.min_price) {
    where.price = { ...where.price, gte: parseFloat(searchParams.min_price) }
  }
  if (searchParams.max_price) {
    where.price = { ...where.price, lte: parseFloat(searchParams.max_price) }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          where: { isMain: true },
          take: 1
        },
        variants: {
          take: 1,
          orderBy: { price: 'asc' }
        },
        category: {
          select: { name: true, gender: true }
        }
      },
      orderBy: sort,
      skip,
      take: limit
    }),
    prisma.product.count({ where })
  ])

  return {
    products,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q?.trim() || ''

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-gray-600">Enter a search term to find products</p>
        </div>
      </div>
    )
  }

  const { products, pagination } = await getSearchResults(query, resolvedSearchParams)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults
        query={query}
        products={products}
        pagination={pagination}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  )
}
