import express from 'express'
import cors from 'cors'
import aiRouter from './routes/ai'
import paymentsRouter from './routes/payments'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/ai', aiRouter)
app.use('/api/payments', paymentsRouter)

app.listen(PORT, () => {
  console.log(`TripMeet API running on port ${PORT}`)
})

export default app
