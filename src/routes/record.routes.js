const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { roleGuard } = require('../middleware/roleGuard')
const { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } = require('../controllers/record.controller')

const router = Router()
router.use(authenticate)
router.get('/', roleGuard('ADMIN', 'ANALYST', 'VIEWER'), getRecords)
router.get('/:id', roleGuard('ADMIN', 'ANALYST', 'VIEWER'), getRecordById)
router.post('/', roleGuard('ADMIN', 'ANALYST'), createRecord)
router.patch('/:id', roleGuard('ADMIN', 'ANALYST'), updateRecord)
router.delete('/:id', roleGuard('ADMIN'), deleteRecord)

module.exports = router