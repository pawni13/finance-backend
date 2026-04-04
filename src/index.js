import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import recordRoutes from './routes/record.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))