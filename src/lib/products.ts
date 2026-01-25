import { prisma } from './prisma'

export async function getAllProducts() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getProductsByCategory(categorySlug: string) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        slug: categorySlug,
      },
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getProductsByGender(gender: string) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        gender: gender.toUpperCase(),
      },
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getFeaturedProducts(limit: number = 8) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
      variants: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  })
}

export async function getNewArrivals(limit: number = 12) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getProductsOnSale() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      comparePrice: {
        not: null,
      },
    },
    include: {
      category: true,
      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
