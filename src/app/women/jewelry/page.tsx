import { CategoryPage } from '@/components/category/CategoryPage'

export const metadata = {
  title: "Women's Jewelry | Epitome Elegance",
  description: "Exquisite jewelry pieces to complement your elegant style.",
}

export default async function WomensJewelryPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams
  const page = parseInt(params.page as string || '1')
  const limit = 12

  // Generate sample jewelry products
  const jewelryProducts = [
    {
      id: 301,
      title: "Gold Chain Necklace",
      description: "Elegant 18k gold chain necklace with pendant",
      price: 15000,
      image: "https://picsum.photos/seed/necklace1/400/500"
    },
    {
      id: 302,
      title: "Diamond Stud Earrings",
      description: "Classic diamond stud earrings in white gold setting",
      price: 25000,
      image: "https://picsum.photos/seed/earrings1/400/500"
    },
    {
      id: 303,
      title: "Pearl Bracelet",
      description: "Cultured pearl bracelet with silver clasp",
      price: 8500,
      image: "https://picsum.photos/seed/bracelet1/400/500"
    },
    {
      id: 304,
      title: "Statement Ring",
      description: "Bold statement ring with gemstone centerpiece",
      price: 12000,
      image: "https://picsum.photos/seed/ring1/400/500"
    },
    {
      id: 305,
      title: "Charm Bracelet",
      description: "Silver charm bracelet with customizable charms",
      price: 6800,
      image: "https://picsum.photos/seed/charm1/400/500"
    },
    {
      id: 306,
      title: "Tennis Bracelet",
      description: "Sparkling tennis bracelet with cubic zirconia stones",
      price: 18500,
      image: "https://picsum.photos/seed/tennis1/400/500"
    }
  ]

  let filtered = jewelryProducts

  // Apply price filters
  if (params.min_price) {
    filtered = filtered.filter(p => p.price >= parseFloat(params.min_price as string))
  }
  if (params.max_price) {
    filtered = filtered.filter(p => p.price <= parseFloat(params.max_price as string))
  }

  // Sort products
  const sortOptions: Record<string, any> = {
    'price-low': (a: any, b: any) => a.price - b.price,
    'price-high': (a: any, b: any) => b.price - a.price,
    'newest': (a: any, b: any) => b.id - a.id,
    'name': (a: any, b: any) => a.title.localeCompare(b.title)
  }

  const sortFn = sortOptions[params.sort as string || 'newest']
  if (sortFn) {
    filtered.sort(sortFn)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = filtered.slice(startIndex, endIndex)

  const products = paginatedProducts.map(product => ({
    id: product.id.toString(),
    name: product.title,
    slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
    price: product.price,
    comparePrice: Math.random() > 0.8 ? product.price * 1.25 : undefined,
    stockQuantity: Math.floor(Math.random() * 20) + 5,
    brand: 'Epitome Elegance',
    isActive: true,
    isFeatured: Math.random() > 0.7,
    images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
    variants: [{ 
      id: '1', 
      size: 'Standard', 
      color: ['Gold', 'Silver', 'Rose Gold'][Math.floor(Math.random() * 3)], 
      colorHex: ['#FFD700', '#C0C0C0', '#E8B4A0'][Math.floor(Math.random() * 3)],
      stock: Math.floor(Math.random() * 10) + 2, 
      price: product.price 
    }],
    category: { name: 'Jewelry', gender: 'FEMALE' },
    _count: { reviews: Math.floor(Math.random() * 60) },
    averageRating: Math.random() * 1 + 4
  }))

  const pagination = { 
    current: page, 
    pages: Math.ceil(filtered.length / limit), 
    total: filtered.length 
  }

  return (
    <CategoryPage
      category={{
        id: 'womens-jewelry',
        name: "Women's Jewelry",
        slug: 'jewelry',
        description: 'Exquisite jewelry pieces to complement your elegant style'
      }}
      products={products}
      pagination={pagination}
      priceRange={{ min: 0, max: 50000 }}
      searchParams={params}
      gender="women"
    />
  )
}
