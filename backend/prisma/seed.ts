import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } })
  if (!admin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10)
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashed,
        isAdmin: true,
      },
    })
    console.log('Admin seeded!')
  } else {
    console.log('Admin already exists.')
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
