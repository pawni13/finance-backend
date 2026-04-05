const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')
const { createError } = require('../middleware/errorHandler')

const register = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw createError(409, 'Email already registered')

  const hashed = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: { name, email, password: hashed, role: role || 'VIEWER' },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
  })
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError(401, 'Invalid email or password')
  if (user.status === 'INACTIVE') throw createError(403, 'Account is inactive')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw createError(401, 'Invalid email or password')

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}

module.exports = { register, login }