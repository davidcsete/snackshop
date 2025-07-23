import { FastifyRequest, FastifyReply } from 'fastify'

// Belépett felhasználót ellenőrző middleware
export async function verifyAuth(req: FastifyRequest, reply: FastifyReply) {
  const session = req.cookies.auth

  if (!session) {
    return reply.status(401).send({ message: 'Login required!' })
  }

  try {
    const parsed = JSON.parse(session)

    if (!parsed.id) {
      throw new Error()
    }

    // Hozzáadjuk a kérésekhez a felhasználói információkat (pl. userId, isAdmin)
    ;(req as any).user = parsed
  } catch (e) {
    return reply.status(401).send({ message: 'Invalid session cookie!' })
  }
}

// Admin middleware – csak admin felhasználónak engedi
export async function verifyAdmin(req: FastifyRequest, reply: FastifyReply) {
  const session = req.cookies.auth

  if (!session) {
    return reply.status(401).send({ message: 'Login required!' })
  }

  try {
    const parsed = JSON.parse(session)

    if (!parsed.isAdmin) {
      return reply.status(403).send({ message: 'Admin required!' })
    }

    ;(req as any).user = parsed
  } catch (e) {
    return reply.status(401).send({ message: 'Invalid session cookie!' })
  }
}
