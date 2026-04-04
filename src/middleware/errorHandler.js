export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error'
  })
}

export const createError = (status, message) => {
  const err = new Error(message)
  err.status = status
  return err
}