import { createError } from './errorHandler.js'

export const roleGuard = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(createError(403, 'Access denied: insufficient permissions'))
  next()
}




