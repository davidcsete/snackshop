import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { hashPassword, verifyPassword } from '../utils/authUtils'

const prisma = new PrismaClient()

export async function registerHandler(req: FastifyRequest, reply: FastifyReply) {
  const { username, password } = req.body as { username: string; password: string }

  if (!username || !password) {
    return reply.status(400).send({ message: 'Missing fields!' })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return reply.status(400).send({ message: 'Username already exists!' })
  }

  const hashed = await hashPassword(password)
  await prisma.user.create({
    data: {
      username,
      password: hashed,
      isAdmin: false,
    },
  })

  reply.status(201).send({ message: 'Registration successfull!' })
}

export async function loginHandler(req: FastifyRequest, reply: FastifyReply) {
  const { username, password } = req.body as { username: string; password: string }

  const user = await prisma.user.findUnique({ where: { username } })

  if (!user) {
    return reply.status(401).send({ message: 'Wrong username or password!' })
  }

  const valid = await verifyPassword(password, user.password)

  if (!valid) {
    return reply.status(401).send({ message: 'Wrong username or password!' })
  }

  // Cookie beállítás (session helyett)
  reply.setCookie('auth', JSON.stringify({ 
    id: user.id, 
    username: user.username,
    isAdmin: user.isAdmin 
  }), {
    path: '/',
    httpOnly: false, // Allow frontend to read the cookie
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24,
  })

  return reply.send({ authenticated: true, isAdmin: user.isAdmin })
}

export async function logoutHandler(req: FastifyRequest, reply: FastifyReply) {
  // Clear the auth cookie
  reply.clearCookie('auth', { path: '/' })
  return reply.send({ message: 'Logged out successfully' })
}
