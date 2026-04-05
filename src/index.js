const express = require('express')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const recordRoutes = require('./routes/record.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const { errorHandler } = require('./middleware/errorHandler')

dotenv.config()

const app = express()
app.use(express.json())
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
})
app.use(limiter)
app.get("/", (req, res) => {
  res.send("Finance backend is running");
});
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))