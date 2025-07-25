import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/order – rendelés leadása
export async function placeOrder(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user
  
    // Extra biztonság
    if (!req.body || typeof req.body !== 'object') {
      return reply.status(400).send({ message: 'Invalid body format' })
    }
  
    const { items } = req.body as {
      items: { productId: number; quantity: number }[]
    }
  
    if (!items || !Array.isArray(items) || items.length === 0) {
      return reply.status(400).send({ message: 'Cart is empty!' })
    }
  
    let total = 0
    const orderItems = []
  
    for (const item of items) {
      // Biztonsági ellenőrzés
      if (!item.productId || !item.quantity) {
        return reply.status(400).send({ message: 'Missing productId or quantity' })
      }
  
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
  
      if (!product) {
        return reply.status(404).send({ message: `Order could not be found (ID: ${item.productId})` })
      }
  
      if (product.stock < item.quantity) {
        return reply.status(400).send({ message: `${product.name} - not enough stock! Stock number: ${product.stock}` })
      }
  
      const itemTotal = item.quantity * product.price
      total += itemTotal
  
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }
  
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: { include: { product: true } },
      },
    })
  
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }
  
    reply.send({
      message: 'Order successfull!',
      orderId: order.id,
      total,
      items: order.items.map(i => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.price,
      })),
    })
  }

// GET /api/orders – csak admin
export async function getAllOrders(req: FastifyRequest, reply: FastifyReply) {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formatted = orders.map(order => ({
    id: order.id,
    user: order.user.username,
    createdAt: order.createdAt,
    total: order.total,
    items: order.items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.price,
    })),
  }))

  reply.send(formatted)
}
