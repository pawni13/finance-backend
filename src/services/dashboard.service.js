const prisma = require('../utils/prisma')

const getSummary = async () => {
  const [income, expense] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { type: 'INCOME', deletedAt: null },
      _sum: { amount: true }
    }),
    prisma.financialRecord.aggregate({
      where: { type: 'EXPENSE', deletedAt: null },
      _sum: { amount: true }
    })
  ])

  const totalIncome = Number(income._sum.amount || 0)
  const totalExpenses = Number(expense._sum.amount || 0)

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses
  }
}

const getByCategory = async () => {
  const records = await prisma.financialRecord.groupBy({
    by: ['category', 'type'],
    where: { deletedAt: null },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } }
  })

  return records.map(r => ({
    category: r.category,
    type: r.type,
    total: Number(r._sum.amount || 0)
  }))
}

const getTrends = async () => {
  const records = await prisma.financialRecord.findMany({
    where: {
      deletedAt: null,
      date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
    },
    select: { amount: true, type: true, date: true }
  })

  const trends = {}
  records.forEach(r => {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}`
    if (!trends[key]) trends[key] = { month: key, income: 0, expenses: 0 }
    if (r.type === 'INCOME') trends[key].income += Number(r.amount)
    else trends[key].expenses += Number(r.amount)
  })

  return Object.values(trends).sort((a, b) => a.month.localeCompare(b.month))
}

const getRecentActivity = async () => {
  return prisma.financialRecord.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { user: { select: { id: true, name: true } } }
  })
}

module.exports = { getSummary, getByCategory, getTrends, getRecentActivity }