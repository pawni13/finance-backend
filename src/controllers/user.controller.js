import * as userService from '../services/user.service.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers()
    res.json({ success: true, data: users })
  } catch (err) { next(err) }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
}

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body)
    res.json({ success: true, data: user })
  } catch (err) { next(err) }
}

export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id)
    res.json({ success: true, data: result })
  } catch (err) { next(err) }
}