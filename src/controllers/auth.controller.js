import * as authService from '../services/auth.service.js'

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (err) { next(err) }
}

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json({ success: true, data: result })
  } catch (err) { next(err) }
}