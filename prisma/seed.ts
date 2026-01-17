import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories for Men
  const mensCategories = [
    { name: 'Clothing', slug: 'mens-clothing', gender: 'MALE', description: 'Premium suits, shirts, and clothing for men' },
    { name: 'Shoes', slug: 'mens-shoes', gender: 'MALE', description: 'Elegant footwear for the modern gentleman' },
    { name: 'Accessories', slug: 'mens-accessories', gender: 'MALE', description: 'Luxury watches, briefcases, and accessories' },
    { name: 'Bags', slug: 'mens-bags', gender: 'MALE', description: 'Premium bags and briefcases for men' },
  ]

  // Create categories for Women
  const womensCategories = [
    { name: 'Clothing', slug: 'womens-clothing', gender: 'FEMALE', description: 'Premium womens clothing collection' },
    { name: 'Shoes', slug: 'womens-shoes', gender: 'FEMALE', description: 'Elegant heels, flats, and footwear' },
    { name: 'Accessories', slug: 'womens-accessories', gender: 'FEMALE', description: 'Luxury accessories for women' },
    { name: 'Bags', slug: 'womens-bags', gender: 'FEMALE', description: 'Luxury handbags, purses, and accessories' },
    { name: 'Jewelry', slug: 'womens-jewelry', gender: 'FEMALE', description: 'Exquisite jewelry pieces' },
  ]

  // Create all categories
  for (const category of [...mensCategories, ...womensCategories]) {
    const existing = await prisma.category.findFirst({
      where: {
        slug: category.slug,
      },
    })

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: category,
      })
      console.log(`✓ Updated: ${category.gender} - ${category.name}`)
    } else {
      await prisma.category.create({
        data: category,
      })
      console.log(`✓ Created: ${category.gender} - ${category.name}`)
    }
  }

  console.log('\n🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
