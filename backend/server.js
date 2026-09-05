require('dotenv').config()

const path = require('node:path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const apiRoutes = require('./src/routes')

const PORT = process.env.PORT || 3001

// Origin frontend yang diizinkan. FRONTEND_ORIGIN (bisa dipisah koma) untuk
// produksi; saat dev kita terima localhost & 127.0.0.1 di port berapa pun
// supaya tidak "Failed to fetch" hanya gara-gara beda host/port kecil.
const EXTRA_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const isDevLocalhost = (origin) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)

function corsOrigin(origin, cb) {
  // Request tanpa Origin (curl, health check, same-origin) → izinkan.
  if (!origin) return cb(null, true)
  if (EXTRA_ORIGINS.includes(origin) || isDevLocalhost(origin)) return cb(null, true)
  cb(new Error(`Origin tidak diizinkan: ${origin}`))
}

const app = express()

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json({ limit: '15mb' })) // upload gambar / bukti transfer dikirim sebagai data URL
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
