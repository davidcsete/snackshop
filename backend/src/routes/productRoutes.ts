import { FastifyInstance } from 'fastify'
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } from '../controllers/productController'
  import { verifyAdmin } from '../plugins/authMiddleware'

export default async function productRoutes(server: FastifyInstance) {
    server.get('/api/products', getProducts)
    server.post('/api/products', { preHandler: verifyAdmin }, createProduct)
    server.put('/api/products/:id', { preHandler: verifyAdmin }, updateProduct)
    server.delete('/api/products/:id', { preHandler: verifyAdmin }, deleteProduct)
}
