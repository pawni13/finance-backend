const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { roleGuard } = require('../middleware/roleGuard')
const { getSummary, getByCategory, getTrends, getRecentActivity } = require('../controllers/dashboard.controller')

const router = Router()
router.use(authenticate)
router.get('/summary', roleGuard('ADMIN', 'ANALYST', 'VIEWER'), getSummary)
router.get('/by-category', roleGuard('ADMIN', 'ANALYST', 'VIEWER'), getByCategory)
router.get('/trends', roleGuard('ADMIN', 'ANALYST', 'VIEWER'), getTrends)
router.get('/recent', roleGuard('ADMIN', 'ANALYST', 'VIEWER'), getRecentActivity)

module.exports = router