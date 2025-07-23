import { FastifyInstance } from 'fastify'
import { placeOrder, getAllOrders } from '../controllers/orderController'
import { verifyAuth, verifyAdmin } from '../plugins/authMiddleware'

export default async function orderRoutes(server: FastifyInstance) {
  server.post('/api/order', { preHandler: verifyAuth }, placeOrder)
  server.get('/api/orders', { preHandler: verifyAdmin }, getAllOrders)
}
