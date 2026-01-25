const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@epitomeelegance.com'
  const password = 'barema7' // Change this!
  
  console.log('Creating admin user...')
  
  const hashedPassword = bcrypt.hashSync(password, 10)

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ Admin created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('You can now login at http://localhost:3000/admin-login')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
