const dashboardService = require('../services/dashboard.service')

const getSummary = async (req, res, next) => {
  try {
    res.json({ success: true, data: await dashboardService.getSummary() })
  } catch (err) { next(err) }
}

const getByCategory = async (req, res, next) => {
  try {
    res.json({ success: true, data: await dashboardService.getByCategory() })
  } catch (err) { next(err) }
}

const getTrends = async (req, res, next) => {
  try {
    res.json({ success: true, data: await dashboardService.getTrends() })
  } catch (err) { next(err) }
}

const getRecentActivity = async (req, res, next) => {
  try {
    res.json({ success: true, data: await dashboardService.getRecentActivity() })
  } catch (err) { next(err) }
}

module.exports = { getSummary, getByCategory, getTrends, getRecentActivity }