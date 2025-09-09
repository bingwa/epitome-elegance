import { notFound } from 'next/navigation'
import { fashionDataService } from '@/lib/dataFetcher'
import { ProductDetailPage } from '@/components/product/ProductDetail'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  try {
    // Since we're using external APIs for demo data, we'll simulate getting a product by slug
    const [womensProducts, mensProducts, newArrivalProducts] = await Promise.all([
      fashionDataService.getWomensProducts(),
      fashionDataService.getMensProducts(),
      fashionDataService.getNewArrivals()
    ])
    
    const allProducts = [...womensProducts, ...mensProducts, ...newArrivalProducts]
    
    // Find product by matching slug (converted from title)
    const product = allProducts.find(p => 
      p.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === slug
    )
    
    if (!product) return null
    
    // Transform to match your expected format
    return {
      id: product.id.toString(),
      name: product.title,
      slug: slug,
      description: product.description,
      price: product.price,
      comparePrice: Math.random() > 0.7 ? product.price * 1.3 : undefined,
      stockQuantity: Math.floor(Math.random() * 50) + 10,
      brand: product.brand || 'Epitome Elegance',
      isActive: true,
      images: [
        {
          id: '1',
          url: product.image,
          altText: product.title,
          isMain: true
        }
      ],
      variants: [
        {
          id: '1',
          size: 'M',
          color: 'Default',
          colorHex: '#000000',
          stock: Math.floor(Math.random() * 20) + 5,
          price: product.price
        }
      ],
      category: {
        id: '1',
        name: product.category.includes('women') ? 'Women\'s Clothing' : 'Men\'s Clothing',
        gender: product.category.includes('women') ? 'FEMALE' : 'MALE'
      },
      reviews: [] // Empty for demo
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(categoryName: string, currentProductId: string) {
  try {
    const isWomens = categoryName.toLowerCase().includes('women')
    const products = isWomens 
      ? await fashionDataService.getWomensProducts()
      : await fashionDataService.getMensProducts()
    
    // Get random 4 products as related, excluding current product
    const filtered = products.filter(p => p.id.toString() !== currentProductId)
    const shuffled = filtered.sort(() => 0.5 - Math.random())
    
    return shuffled.slice(0, 4).map(product => ({
      id: product.id.toString(),
      name: product.title,
      slug: product.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
      price: product.price,
      stockQuantity: Math.floor(Math.random() * 30) + 10,
      brand: 'Epitome Elegance',
      images: [{ id: '1', url: product.image, altText: product.title, isMain: true }],
      variants: [{ id: '1', size: 'M', color: 'Default', stock: 20, price: product.price }],
      category: { name: 'Related', gender: isWomens ? 'FEMALE' : 'MALE' }
    }))
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export const metadata = {
  title: 'Product Details | Epitome Elegance',
  description: 'Discover premium fashion at Epitome Elegance.',
}

export default async function ProductPage({ params }: ProductPageProps) {
  // ✅ Await params before accessing its properties
  const { slug } = await params
  
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category.name, product.id)

  return (
    <ProductDetailPage 
      product={product} 
      relatedProducts={relatedProducts}
    />
  )
}
