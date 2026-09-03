require('dotenv').config()

const path = require('node:path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const apiRoutes = require('./src/routes')

const PORT = process.env.PORT || 3001
const ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'

const app = express()

app.use(cors({ origin: ORIGIN, credentials: true }))
app.use(express.json({ limit: '10mb' })) // upload gambar dikirim sebagai data URL
app.use(cookieParser())

// File gambar hasil upload admin (folder ./uploads, di-gitignore).
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (_req, res) => {
  res.json({
    name: 'LAZIS PLN Batam API',
    endpoints: [
      'GET  /api/health',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET  /api/auth/me',
      'GET  /api/content/:key',
      'PUT  /api/content/:key  (admin)',
    ],
  })
})

app.use('/api', apiRoutes)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler terakhir
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Kesalahan server', detail: err.message })
})

app.listen(PORT, () => console.log(`API jalan di http://localhost:${PORT}`))
