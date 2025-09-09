import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories with string values instead of enum references
  const womenClothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'women-clothing',
      gender: 'FEMALE',
      displayOrder: 1,
      isActive: true,
      description: "Premium women's clothing collection",
      image: '/categories/women-clothing.jpg'
    }
  })

  const womenBags = await prisma.category.create({
    data: {
      name: 'Bags',
      slug: 'women-bags',
      gender: 'FEMALE',
      displayOrder: 2,
      isActive: true,
      description: 'Luxury handbags and accessories',
      image: '/categories/women-bags.jpg'
    }
  })

  const menClothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'men-clothing',
      gender: 'MALE',
      displayOrder: 3,
      isActive: true,
      description: "Premium men's clothing collection",
      image: '/categories/men-clothing.jpg'
    }
  })

  const menAccessories = await prisma.category.create({
    data: {
      name: 'Accessories',
      slug: 'men-accessories',
      gender: 'MALE',
      displayOrder: 4,
      isActive: true,
      description: "Men's luxury accessories",
      image: '/categories/men-accessories.jpg'
    }
  })

  // Sample products with reliable image URLs
  const products = [
    {
      name: 'Elegant Evening Dress',
      slug: 'elegant-evening-dress',
      description: 'A stunning evening dress perfect for special occasions. Made with premium fabric and attention to detail.',
      shortDesc: 'Premium evening dress for special occasions',
      price: 8500,
      comparePrice: 10000,
      sku: 'WD001',
      categoryId: womenClothing.id,
      brand: 'Epitome',
      stockQuantity: 15,
      isFeatured: true,
      isActive: true,
      tags: 'dress,evening,formal,elegant',
      imageUrl: 'https://picsum.photos/seed/dress1/800/1000'
    },
    {
      name: 'Designer Handbag Collection',
      slug: 'designer-handbag-collection',
      description: 'Premium leather handbag crafted by skilled artisans. Perfect for both casual and formal occasions.',
      shortDesc: 'Premium leather handbag for everyday elegance',
      price: 12000,
      comparePrice: 15000,
      sku: 'WB001',
      categoryId: womenBags.id,
      brand: 'Epitome',
      stockQuantity: 20,
      isFeatured: true,
      isActive: true,
      tags: 'handbag,leather,luxury,designer',
      imageUrl: 'https://picsum.photos/seed/bag1/800/1000'
    },
    {
      name: 'Premium Men\'s Suit',
      slug: 'premium-mens-suit',
      description: 'Tailored to perfection, this premium suit combines classic style with modern fit.',
      shortDesc: 'Premium tailored suit for the modern gentleman',
      price: 25000,
      comparePrice: 30000,
      sku: 'MS001',
      categoryId: menClothing.id,
      brand: 'Epitome',
      stockQuantity: 12,
      isFeatured: true,
      isActive: true,
      tags: 'suit,formal,premium,tailored',
      imageUrl: 'https://picsum.photos/seed/suit1/800/1000'
    },
    {
      name: 'Luxury Watch Collection',
      slug: 'luxury-watch-collection',
      description: 'Sophisticated timepiece that combines elegance with precision.',
      shortDesc: 'Sophisticated luxury watch for discerning gentlemen',
      price: 18000,
      sku: 'MA001',
      categoryId: menAccessories.id,
      brand: 'Epitome',
      stockQuantity: 8,
      isFeatured: true,
      isActive: true,
      tags: 'watch,luxury,timepiece,accessories',
      imageUrl: 'https://picsum.photos/seed/watch1/800/1000'
    },
    {
      name: 'Casual Summer Dress',
      slug: 'casual-summer-dress',
      description: 'Light and breezy summer dress perfect for casual outings and warm weather.',
      shortDesc: 'Comfortable summer dress for everyday wear',
      price: 4500,
      comparePrice: 5500,
      sku: 'WD002',
      categoryId: womenClothing.id,
      brand: 'Epitome',
      stockQuantity: 25,
      isFeatured: true,
      isActive: true,
      tags: 'dress,summer,casual,comfortable',
      imageUrl: 'https://picsum.photos/seed/dress2/800/1000'
    },
    {
      name: 'Executive Briefcase',
      slug: 'executive-briefcase',
      description: 'Professional leather briefcase designed for the modern executive.',
      shortDesc: 'Premium leather briefcase for professionals',
      price: 15000,
      comparePrice: 18000,
      sku: 'MB001',
      categoryId: menAccessories.id,
      brand: 'Epitome',
      stockQuantity: 10,
      isFeatured: false,
      isActive: true,
      tags: 'briefcase,leather,professional,executive',
      imageUrl: 'https://picsum.photos/seed/briefcase1/800/1000'
    }
  ]

  // Create products with images and variants
  for (const [index, productData] of products.entries()) {
    const { imageUrl, ...productInfo } = productData
    
    const product = await prisma.product.create({
      data: productInfo
    })

    // Create main image for each product
    await prisma.productImage.create({
      data: {
        url: imageUrl,
        altText: `${product.name} - Main Image`,
        displayOrder: 0,
        isMain: true,
        productId: product.id
      }
    })

    // Add a second image for hover effect
    await prisma.productImage.create({
      data: {
        url: `https://picsum.photos/seed/${product.slug}-alt/800/1000`,
        altText: `${product.name} - Alternative View`,
        displayOrder: 1,
        isMain: false,
        productId: product.id
      }
    })

    // Create variants based on product type
    if (product.name.includes('Dress')) {
      const variants = [
        { size: 'S', color: 'Black', colorHex: '#000000', stock: 5, price: product.price, sku: `${product.sku}-S-BLK` },
        { size: 'M', color: 'Black', colorHex: '#000000', stock: 5, price: product.price, sku: `${product.sku}-M-BLK` },
        { size: 'L', color: 'Navy', colorHex: '#1a1a2e', stock: 5, price: product.price, sku: `${product.sku}-L-NVY` },
        { size: 'M', color: 'White', colorHex: '#ffffff', stock: 3, price: product.price, sku: `${product.sku}-M-WHT` }
      ]
      
      for (const variant of variants) {
        await prisma.productVariant.create({
          data: { ...variant, productId: product.id }
        })
      }
    } else if (product.name.includes('Handbag') || product.name.includes('Briefcase')) {
      const variants = [
        { size: 'Medium', color: 'Brown', colorHex: '#8b4513', stock: 10, price: product.price, sku: `${product.sku}-M-BRN` },
        { size: 'Medium', color: 'Black', colorHex: '#000000', stock: 10, price: product.price, sku: `${product.sku}-M-BLK` },
        { size: 'Large', color: 'Black', colorHex: '#000000', stock: 5, price: product.price + 1000, sku: `${product.sku}-L-BLK` }
      ]
      
      for (const variant of variants) {
        await prisma.productVariant.create({
          data: { ...variant, productId: product.id }
        })
      }
    } else if (product.name.includes('Suit')) {
      const variants = [
        { size: '38', color: 'Charcoal', colorHex: '#36454f', stock: 3, price: product.price, sku: `${product.sku}-38-CHR` },
        { size: '40', color: 'Charcoal', colorHex: '#36454f', stock: 4, price: product.price, sku: `${product.sku}-40-CHR` },
        { size: '42', color: 'Navy', colorHex: '#1a1a2e', stock: 4, price: product.price, sku: `${product.sku}-42-NVY` },
        { size: '44', color: 'Black', colorHex: '#000000', stock: 4, price: product.price, sku: `${product.sku}-44-BLK` },
        { size: '46', color: 'Black', colorHex: '#000000', stock: 2, price: product.price, sku: `${product.sku}-46-BLK` }
      ]
      
      for (const variant of variants) {
        await prisma.productVariant.create({
          data: { ...variant, productId: product.id }
        })
      }
    } else if (product.name.includes('Watch')) {
      const variants = [
        { size: 'Standard', color: 'Gold', colorHex: '#ffd700', stock: 4, price: product.price, sku: `${product.sku}-STD-GLD` },
        { size: 'Standard', color: 'Silver', colorHex: '#c0c0c0', stock: 4, price: product.price, sku: `${product.sku}-STD-SLV` },
        { size: 'Standard', color: 'Rose Gold', colorHex: '#e8b4a0', stock: 2, price: product.price + 2000, sku: `${product.sku}-STD-RG` }
      ]
      
      for (const variant of variants) {
        await prisma.productVariant.create({
          data: { ...variant, productId: product.id }
        })
      }
    }
  }

  console.log('✅ Database seeded successfully with SQLite-compatible data!')
  console.log(`📦 Created ${products.length} products with variants and images`)
  console.log('🏪 Categories: Women\'s Clothing, Women\'s Bags, Men\'s Clothing, Men\'s Accessories')
  console.log('💰 All prices in KSH (Kenyan Shillings)')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
