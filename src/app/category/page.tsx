import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ModernCategoryPage } from '@/components/category/ModernCategoryPage'

interface CategoryPageProps {
  params: Promise<{
    gender: string
    category: string
  }>
  searchParams: Promise<{
    sort?: string
    min_price?: string
    max_price?: string
    page?: string
  }>
}

async function getCategory(gender: string, categorySlug: string) {
  const genderFilter = gender === 'all' ? undefined : gender.toUpperCase()
  
  return await prisma.category.findFirst({
    where: {
      slug: categorySlug,
      isActive: true,
      ...(genderFilter && { gender: genderFilter })
    }
  })
}

async function getProducts(categoryId: string, searchParams: any) {
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
    categoryId,
    isActive: true
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

async function getPriceRange(categoryId: string) {
  const result = await prisma.product.aggregate({
    where: { categoryId, isActive: true },
    _min: { price: true },
    _max: { price: true }
  })

  return {
    min: Number(result._min.price) || 0,
    max: Number(result._max.price) || 50000
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { gender, category: categorySlug } = await params
  const categoryData = await getCategory(gender, categorySlug)
  
  if (!categoryData) {
    return {
      title: 'Category Not Found | Epitome Elegance'
    }
  }

  return {
    title: `${categoryData.name} - ${gender.charAt(0).toUpperCase() + gender.slice(1)} | Epitome Elegance`,
    description: categoryData.description || `Shop premium ${categoryData.name.toLowerCase()} for ${gender} at Epitome Elegance. Discover luxury fashion with free shipping across Kenya.`,
  }
}

export default async function CategoryPageRoute({ params, searchParams }: CategoryPageProps) {
  const { gender, category: categorySlug } = await params
  const resolvedSearchParams = await searchParams
  const categoryData = await getCategory(gender, categorySlug)
  
  if (!categoryData) {
    notFound()
  }

  const [{ products, pagination }, priceRange] = await Promise.all([
    getProducts(categoryData.id, resolvedSearchParams),
    getPriceRange(categoryData.id)
  ])

  return (
    <ModernCategoryPage
      category={categoryData}
      products={products}
      pagination={pagination}
      priceRange={priceRange}
      searchParams={resolvedSearchParams}
      gender={gender}
    />
  )
}
