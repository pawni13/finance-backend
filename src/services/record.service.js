const prisma = require('../utils/prisma')
const { createError } = require('../middleware/errorHandler')

const getRecords = async ({ type, category, from, to, page = 1, limit = 10 }) => {
  const where = { deletedAt: null }
  if (type) where.type = type
  if (category) where.category = category
  if (from || to) {
    where.date = {}
    if (from) where.date.gte = new Date(from)
    if (to) where.date.lte = new Date(to)
  }

  const skip = (page - 1) * limit
  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where, skip, take: Number(limit),
      orderBy: { date: 'desc' },
      include: { user: { select: { id: true, name: true } } }
    }),
    prisma.financialRecord.count({ where })
  ])

  return { records, total, page: Number(page), totalPages: Math.ceil(total / limit) }
}

const getRecordById = async (id) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, deletedAt: null },
    include: { user: { select: { id: true, name: true } } }
  })
  if (!record) throw createError(404, 'Record not found')
  return record
}

const createRecord = async (data, userId) => {
  return prisma.financialRecord.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      description: data.description || null,
      userId
    }
  })
}

const updateRecord = async (id, data) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } })
  if (!record) throw createError(404, 'Record not found')

  const allowed = {}
  if (data.amount !== undefined) allowed.amount = data.amount
  if (data.type) allowed.type = data.type
  if (data.category) allowed.category = data.category
  if (data.date) allowed.date = new Date(data.date)
  if (data.description !== undefined) allowed.description = data.description

  return prisma.financialRecord.update({ where: { id }, data: allowed })
}

const deleteRecord = async (id) => {
  const record = await prisma.financialRecord.findFirst({ where: { id, deletedAt: null } })
  if (!record) throw createError(404, 'Record not found')
  await prisma.financialRecord.update({ where: { id }, data: { deletedAt: new Date() } })
  return { message: 'Record deleted successfully' }
}

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord }