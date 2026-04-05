const recordService = require('../services/record.service')

const getRecords = async (req, res, next) => {
  try {
    const result = await recordService.getRecords(req.query)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id)
    res.json({ success: true, data: record })
  } catch (err) { next(err) }
}

const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.body, req.user.id)
    res.status(201).json({ success: true, data: record })
  } catch (err) { next(err) }
}

const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body)
    res.json({ success: true, data: record })
  } catch (err) { next(err) }
}

const deleteRecord = async (req, res, next) => {
  try {
    const result = await recordService.deleteRecord(req.params.id)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}

module.exports = { getRecords, getRecordById, createRecord, updateRecord, deleteRecord }