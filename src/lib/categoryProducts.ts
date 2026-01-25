import { prisma } from '@/lib/prisma'

export async function getProductsByCategorySlug(
  categorySlug: string,
  options?: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    gender?: "MALE" | "FEMALE";
  }
) {
  const {
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    sort = "newest",
    gender,
  } = options || {};

  const sortOptions: Record<string, any> = {
    "price-low": { price: "asc" },
    "price-high": { price: "desc" },
    newest: { createdAt: "desc" },
    name: { name: "asc" },
  };

  const orderBy = sortOptions[sort] || { createdAt: "desc" };

  const where: any = {
    isActive: true,
    category: { slug: categorySlug, isActive: true },
  };

  if (gender) where.category.gender = gender;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { isMain: "desc" } },
        variants: true,
        _count: { select: { reviews: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
    },
  };
}

export async function getFeaturedProducts(gender?: 'MALE' | 'FEMALE', limit = 8) {
  const where: any = {
    isActive: true,
    isFeatured: true
  }

  if (gender) {
    where.category = { gender }
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: {
        orderBy: { isMain: 'desc' }
      },
      variants: true,
      _count: {
        select: { reviews: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      const avgRating = await prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true }
      })

      return {
        ...product,
        averageRating: avgRating._avg.rating || 0
      }
    })
  )

  return productsWithRating
}

export async function getAllProductsByGender(gender: 'MALE' | 'FEMALE', options?: {
  page?: number
  limit?: number
  minPrice?: number
  maxPrice?: number
  sort?: string
}) {
  const {
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    sort = 'newest',
  } = options || {}

  const sortOptions: Record<string, any> = {
    'price-low': { price: 'asc' },
    'price-high': { price: 'desc' },
    'newest': { createdAt: 'desc' },
    'name': { name: 'asc' }
  }

  const orderBy = sortOptions[sort] || { createdAt: 'desc' }

  const where: any = {
    isActive: true,
    category: {
      gender
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { isMain: 'desc' }
        },
        variants: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.product.count({ where })
  ])

  const productsWithRating = await Promise.all(
    products.map(async (product) => {
      const avgRating = await prisma.review.aggregate({
        where: { productId: product.id },
        _avg: { rating: true }
      })

      return {
        ...product,
        averageRating: avgRating._avg.rating || 0
      }
    })
  )

  return {
    products: productsWithRating,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  }
}



