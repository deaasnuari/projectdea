
require('dotenv').config()

const path = require('node:path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const apiRoutes = require('./src/routes')
const { securityHeaders, originGuard, auditAdmin } = require('./src/middleware/security')
const { rateLimit, formatWait } = require('./src/middleware/rateLimit')
const { imageCleanup } = require('./src/middleware/imageCleanup')
const log = require('./src/lib/logger')

const PORT = process.env.PORT || 3001

// Origin frontend yang diizinkan.
// FRONTEND_ORIGIN dapat berisi beberapa origin, dipisahkan koma.
const EXTRA_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// Development: izinkan localhost dan IP jaringan lokal.
const isDevLocalhost = (origin) =>
  process.env.NODE_ENV !== 'production' &&
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)

const isAllowedOrigin = (origin) =>
  EXTRA_ORIGINS.includes(origin) || isDevLocalhost(origin)

function corsOrigin(origin, cb) {
  // Request tanpa Origin (curl, health check, server-to-server).
  if (!origin) return cb(null, true)

  if (isAllowedOrigin(origin)) return cb(null, true)

  // Origin tidak diizinkan.
  cb(null, false)
}

// Pengaman produksi: jangan berjalan dengan rahasia/kredensial bawaan.
if (process.env.NODE_ENV === 'production') {
  const problems = []

  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    problems.push('SESSION_SECRET wajib diisi (min. 32 karakter acak)')
  }

  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123') {
    problems.push('ADMIN_PASSWORD wajib diganti (jangan "admin123")')
  }

  if (problems.length) {
    log.error(
      'keamanan',
      `Konfigurasi tidak aman untuk produksi: ${problems.join('; ')}`,
    )
    process.exit(1)
  }
}

// Peringatan kredensial bawaan saat development.
if (
  process.env.NODE_ENV !== 'production' &&
  (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123')
) {
  log.warn(
    'keamanan',
    'ADMIN_PASSWORD masih nilai bawaan. Ganti di backend/.env sebelum dipakai nyata.',
  )
}

const app = express()

// Konfigurasi proxy hosting.
if (process.env.TRUST_PROXY) {
  app.set(
    'trust proxy',
    Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY,
  )
}

app.disable('x-powered-by')
app.use(securityHeaders)

// CORS
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(originGuard(isAllowedOrigin))

// Batas ukuran request body.
app.use(
  ['/api/uploads', '/api/donations'],
  express.json({ limit: '15mb' }),
)

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// File gambar hasil upload admin.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Root API
app.get('/', (_req, res) => {
  res.json({
    name: 'LAZIS PLN Batam API',
    status: 'running',
    endpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/auth/me',
      'GET /api/content/:key',
      'PUT /api/content/:key (admin)',
    ],
  })
})

// HEALTH CHECK
// Diletakkan sebelum rate limit agar pengecekan kesehatan server
// tidak terkena pembatasan request API.
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'LAZIS PLN Batam API is running',
    timestamp: new Date().toISOString(),
  })
})

// Batas umum per IP untuk seluruh API.
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max:
      process.env.NODE_ENV !== 'production' &&
      Number(process.env.API_RATE_LIMIT) > 0
        ? Number(process.env.API_RATE_LIMIT)
        : 300,
    message: (s) =>
      `Terlalu banyak permintaan. Coba lagi dalam ${formatWait(s)}.`,
  }),
)

app.use('/api', auditAdmin)
app.use('/api', imageCleanup) // hapus gambar Blob yang tidak lagi dipakai

// Routes API utama.
app.use('/api', apiRoutes)

// 404 handler.
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler terakhir.
app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON tidak valid' })
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Data terlalu besar' })
  }

  if (err instanceof URIError) {
    return res.status(400).json({ error: 'Alamat tidak valid' })
  }

  log.error(
    'api',
    `${req.method} ${String(req.originalUrl || '').split('?')[0]} gagal`,
    err,
  )

  res.status(500).json({
    error: 'Terjadi kesalahan pada server. Silakan coba lagi.',
  })
})

// Unhandled rejection.
process.on('unhandledRejection', (reason) => {
  log.error(
    'proses',
    'Promise ditolak tanpa penanganan',
    reason instanceof Error ? reason : new Error(String(reason)),
  )
})

// Uncaught exception.
process.on('uncaughtException', (err) => {
  log.error('proses', 'Exception tidak tertangani', err)
  process.exit(1)
})

// Jalankan server.
app.listen(PORT, () => {
  log.info('server', `API jalan di http://localhost:${PORT}`)
})
