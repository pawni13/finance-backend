import jwt from 'jsonwebtoken'
import { createError } from './errorHandler.js'

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer '))
    return next(createError(401, 'No token provided'))

  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    next(createError(401, 'Invalid or expired token'))
  }
}