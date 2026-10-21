// Pengaman umum API: header keamanan, pengecekan Origin untuk request
// pengubah data (anti-CSRF), dan kunci sementara untuk login yang gagal
// berulang (anti brute-force). Semua di memori — cukup untuk satu server.

const isProd = () => process.env.NODE_ENV === 'production'

// Header keamanan standar (setara helmet versi ringkas). API ini hanya
// menyajikan JSON & gambar, jadi CSP dibuat ketat.
function securityHeaders(_req, res, next) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'cross-origin', // gambar /uploads dipakai frontend beda origin
    'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; frame-ancestors 'none'",
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  })
  res.removeHeader('X-Powered-By')
  if (isProd()) res.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains')
  next()
}

// Tolak POST/PUT/PATCH/DELETE yang membawa header Origin dari situs yang
// tidak diizinkan (cookie sesi tidak boleh dipakai situs lain). Request tanpa
// Origin (curl, server-ke-server) dibiarkan — tidak membawa cookie browser.
function originGuard(isAllowedOrigin) {
  const SAFE = new Set(['GET', 'HEAD', 'OPTIONS'])
  return (req, res, next) => {
    const origin = req.get('origin')
    if (SAFE.has(req.method) || !origin || isAllowedOrigin(origin)) return next()
    res.status(403).json({ error: 'Origin tidak diizinkan' })
  }
}

// Penghitung percobaan login gagal per kunci (IP + username).
// MAX_FAILS gagal berturut-turut → terkunci LOCK_MS. Berhasil → reset.
const MAX_FAILS = 5
const LOCK_MS = 15 * 60 * 1000
const fails = new Map() // key -> { n, until, last }

setInterval(() => {
  const cutoff = Date.now() - LOCK_MS
  for (const [k, v] of fails) if (v.last < cutoff && v.until < Date.now()) fails.delete(k)
}, 5 * 60 * 1000).unref()

const keyOf = (req, username) =>
  `${req.ip || req.socket?.remoteAddress || '?'}|${String(username || '').trim().toLowerCase()}`

// Sisa detik kunci (0 = tidak terkunci).
function lockRemaining(req, username) {
  const v = fails.get(keyOf(req, username))
  if (!v || v.until <= Date.now()) return 0
  return Math.ceil((v.until - Date.now()) / 1000)
}

function recordFail(req, username) {
  const k = keyOf(req, username)
  const v = fails.get(k) || { n: 0, until: 0, last: 0 }
  if (v.until && v.until <= Date.now()) { v.n = 0; v.until = 0 }
  v.n += 1
  v.last = Date.now()
  if (v.n >= MAX_FAILS) v.until = Date.now() + LOCK_MS
  fails.set(k, v)
}

const recordSuccess = (req, username) => fails.delete(keyOf(req, username))

// Ringkasan untuk halaman Keamanan admin (tanpa membuka kunci/username).
function lockStats() {
  let tracked = 0
  let locked = 0
  const now = Date.now()
  for (const v of fails.values()) {
    if (v.n > 0) tracked += 1
    if (v.until > now) locked += 1
  }
  return { tracked, locked, maxFails: MAX_FAILS, lockMinutes: LOCK_MS / 60000 }
}

// Catat aksi admin yang mengubah data (POST/PUT/PATCH/DELETE yang berhasil)
// ke audit log — siapa, apa (pola rute, tanpa isi body), kapan, dari IP mana.
const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
function auditAdmin(req, res, next) {
  if (!MUTATING.has(req.method)) return next()
  res.on('finish', () => {
    if (res.statusCode >= 400) return
    const { COOKIE_NAME, verifyToken } = require('../lib/session')
    const session = verifyToken(req.cookies?.[COOKIE_NAME])
    if (!session) return
    const sub = req.route?.path && req.route.path !== '/' ? req.route.path : ''
    const pattern = `${req.baseUrl || ''}${sub}`
    if (/^\/api\/auth\/(login|logout)/.test(pattern)) return // dicatat khusus di controller
    require('../models/AuditLog').record({
      actor: session.sub,
      action: `${req.method} ${pattern}`,
      detail: req.params && Object.keys(req.params).length ? JSON.stringify(req.params) : '',
      ip: req.ip || '',
    })
  })
  next()
}

module.exports = { securityHeaders, originGuard, lockRemaining, recordFail, recordSuccess, lockStats, auditAdmin }
