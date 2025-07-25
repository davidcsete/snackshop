import { FastifyInstance } from 'fastify'
import { registerHandler, loginHandler, logoutHandler } from '../controllers/authController'

export default async function authRoutes(server: FastifyInstance) {
  server.post('/api/register', registerHandler)
  server.post('/api/login', loginHandler)
  server.post('/api/logout', logoutHandler)
}
