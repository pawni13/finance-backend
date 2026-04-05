import prisma from '../utils/prisma.js'
import { createError } from '../middleware/errorHandler.js'

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
  })
}

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
  })
  if (!user) throw createError(404, 'User not found')
  return user
}

export const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw createError(404, 'User not found')

  const allowed = {}
  if (data.name) allowed.name = data.name
  if (data.role) allowed.role = data.role
  if (data.status) allowed.status = data.status

  return prisma.user.update({
    where: { id },
    data: allowed,
    select: { id: true, name: true, email: true, role: true, status: true, updatedAt: true }
  })
}

export const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw createError(404, 'User not found')
  await prisma.user.delete({ where: { id } })
  return { message: 'User deleted successfully' }
}