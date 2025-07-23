import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/products
export async function getProducts(req: FastifyRequest, reply: FastifyReply) {
  const products = await prisma.product.findMany()
  return products
}

// POST /api/products (admin only)
export async function createProduct(req: FastifyRequest, reply: FastifyReply) {
  const { name, price, stock } = req.body as {
    name: string
    price: number
    stock: number
  }

  if (!name || price == null || stock == null) {
    return reply.status(400).send({ message: 'Missing fields!' })
  }

  const product = await prisma.product.create({
    data: {
      name,
      price,
      stock,
    },
  })

  return reply.status(201).send(product)
}

// PUT /api/products/:id
export async function updateProduct(req: FastifyRequest, reply: FastifyReply) {
    const id = Number((req.params as any).id)
    const { name, price, stock } = req.body as {
      name?: string
      price?: number
      stock?: number
    }
  
    try {
      const product = await prisma.product.update({
        where: { id },
        data: { name, price, stock },
      })
  
      return reply.send(product)
    } catch (err) {
      return reply.status(404).send({ message: 'The product cannot be found!' })
    }
  }
  
  // DELETE /api/products/:id
  export async function deleteProduct(req: FastifyRequest, reply: FastifyReply) {
    const id = Number((req.params as any).id)
  
    try {
      await prisma.product.delete({ where: { id } })
      return reply.send({ message: 'Product deleted!' })
    } catch (err) {
      return reply.status(404).send({ message: 'The product cannot be found!' })
    }
  }