import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import { ProductDetailPage } from '@/components/product/ProductDetail'

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params  // ✅ Must await params
  const product = await getProductBySlug(slug)

  if (!product || !product.isActive) {
    notFound()
  }

  // Fetch related products (same category)
  const relatedProducts = [] // Add your query here if needed

  return <ProductDetailPage product={product} relatedProducts={[]} />
}
