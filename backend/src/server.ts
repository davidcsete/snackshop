import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'
import protectedRoutes from './routes/protectedRoutes'
import productRoutes from './routes/productRoutes'
import orderRoutes from './routes/orderRoutes'

dotenv.config()

// ✅ Logger engedélyezve
const server = Fastify({
  logger: true
})

server.register(cors, {
  origin: true,
  credentials: true,
})

server.register(cookie)
server.register(authRoutes)
server.register(protectedRoutes)
server.register(productRoutes)
server.register(orderRoutes)

server.get('/api/health', async () => {
  return { status: 'ok' }
})

server.listen({ port: 3001 }, err => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info('Server listening on http://localhost:3001')
})
