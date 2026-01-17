import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import { ProductDetailPage } from '@/components/product/ProductDetail'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Fetch related products (same category)
  const relatedProducts = [] // Add your query here if needed

  return <ProductDetailPage product={product} relatedProducts={[]} />
}
