require('dotenv').config()

const path = require('node:path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const apiRoutes = require('./src/routes')
const { securityHeaders, originGuard, auditAdmin } = require('./src/middleware/security')
const { rateLimit, formatWait } = require('./src/middleware/rateLimit')
const log = require('./src/lib/logger')

const PORT = process.env.PORT || 3001

// Origin frontend yang diizinkan. FRONTEND_ORIGIN (bisa dipisah koma) untuk
// produksi; saat dev kita terima localhost & 127.0.0.1 di port berapa pun
// supaya tidak "Failed to fetch" hanya gara-gara beda host/port kecil.
const EXTRA_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// Dev: terima juga IP jaringan lokal (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
// supaya bisa dites dari HP / alamat LAN.
const isDevLocalhost = (origin) =>
  process.env.NODE_ENV !== 'production' &&
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)

const isAllowedOrigin = (origin) => EXTRA_ORIGINS.includes(origin) || isDevLocalhost(origin)

function corsOrigin(origin, cb) {
  // Request tanpa Origin (curl, health check, same-origin) → izinkan.
  if (!origin) return cb(null, true)
  if (isAllowedOrigin(origin)) return cb(null, true)
  cb(null, false) // tanpa header CORS → browser memblokir; bukan error 500
}

// Pengaman produksi: jangan jalan dengan rahasia/kredensial bawaan.
if (process.env.NODE_ENV === 'production') {
  const problems = []
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    problems.push('SESSION_SECRET wajib diisi (min. 32 karakter acak)')
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123') {
    problems.push('ADMIN_PASSWORD wajib diganti (jangan "admin123")')
  }
  if (problems.length) {
    log.error('keamanan', `Konfigurasi tidak aman untuk produksi: ${problems.join('; ')}`)
    process.exit(1)
  }
}

// Peringatan dini: kredensial bawaan masih dipakai (di produksi malah ditolak
// di atas). Ganti ADMIN_PASSWORD di .env.
if (process.env.NODE_ENV !== 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'admin123')) {
  log.warn('keamanan', 'ADMIN_PASSWORD masih nilai bawaan. Ganti di backend/.env sebelum dipakai nyata.')
}

const app = express()

// Di belakang proxy/hosting (Nginx, dsb.) set TRUST_PROXY=1 supaya req.ip =
// IP pengunjung asli (dipakai pembatas request & kunci login).
if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY)
app.disable('x-powered-by')
app.use(securityHeaders)

app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(originGuard(isAllowedOrigin))
// Batas ukuran body JSON: hanya upload gambar & bukti transfer (dikirim sebagai
// data URL) yang boleh besar. Selebihnya 1 MB — mencegah request raksasa
// menghabiskan memori server. (Parser pertama yang cocok yang dipakai.)
app.use(['/api/uploads', '/api/donations'], express.json({ limit: '15mb' }))
app.use(express.json({ limit: '1mb' }))
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

// Batas umum per IP untuk seluruh API (anti-banjir request): 300 / menit.
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    message: (s) => `Terlalu banyak permintaan. Coba lagi dalam ${formatWait(s)}.`,
  }),
)
app.use('/api', auditAdmin) // catat aksi admin yang mengubah data
app.use('/api', apiRoutes)

app.use((_req, res) => res.status(404).json({ error: 'Not found' }))

// Error handler terakhir. Pengguna HANYA menerima pesan umum — rincian
// (pesan, kode, baris stack; tanpa body/SQL/parameter, dan sudah disamarkan)
// dicatat di log server saja.
app.use((err, req, res, _next) => {
  // JSON rusak / terlalu besar dari klien → 400/413, bukan 500.
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON tidak valid' })
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Data terlalu besar' })
  if (err instanceof URIError) return res.status(400).json({ error: 'Alamat tidak valid' }) // mis. %E0%A4%A rusak
  log.error('api', `${req.method} ${String(req.originalUrl || '').split('?')[0]} gagal`, err)
  res.status(500).json({ error: 'Terjadi kesalahan pada server. Silakan coba lagi.' })
})

// Kesalahan yang lolos dari semua penanganan: catat (tersamarkan), jangan bocor.
process.on('unhandledRejection', (reason) => log.error('proses', 'Promise ditolak tanpa penanganan', reason instanceof Error ? reason : new Error(String(reason))))
process.on('uncaughtException', (err) => {
  log.error('proses', 'Exception tidak tertangani', err)
  process.exit(1)
})

app.listen(PORT, () => log.info('server', `API jalan di http://localhost:${PORT}`))
