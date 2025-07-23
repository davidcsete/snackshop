import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { verifyAuth } from '../plugins/authMiddleware'

const prisma = new PrismaClient()

// POST /api/order – rendelés leadása
export async function placeOrder(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user
  const { items } = req.body as {
    items: { productId: number; quantity: number }[]
  }

  if (!items || items.length === 0) {
    return reply.status(400).send({ message: 'A kosár üres!' })
  }

  let total = 0
  const orderItems = []

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    })

    if (!product) {
      return reply.status(404).send({ message: `Order could not be found (ID: ${item.productId})` })
    }

    if (product.stock < item.quantity) {
      return reply.status(400).send({ message: `${product.name} - not enough stock!` })
    }

    const itemTotal = item.quantity * product.price
    total += itemTotal

    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    })
  }

  // Rendelés mentése
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

  // Készlet csökkentése
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })
  }

  // Log konzolra
  console.log(`New order: user ${user.id} | Total: ${total} Ft`)
  order.items.forEach(i =>
    console.log(`- ${i.product.name}: ${i.quantity} piece(s) x ${i.price} Ft`)
  )

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
