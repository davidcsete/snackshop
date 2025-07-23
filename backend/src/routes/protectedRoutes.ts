import { FastifyInstance } from 'fastify'
import { verifyAuth, verifyAdmin } from '../plugins/authMiddleware'

export default async function protectedRoutes(server: FastifyInstance) {
  server.get('/api/protected', { preHandler: verifyAuth }, async (req, reply) => {
    const user = (req as any).user
    return { message: `Hello, ${user.id}!`, isAdmin: user.isAdmin }
  })

  server.get('/api/admin-only', { preHandler: verifyAdmin }, async (req, reply) => {
    return { message: 'Only with admin priviledges!' }
  })
}