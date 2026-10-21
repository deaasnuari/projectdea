const AuditLog = require('../models/AuditLog')
const AdminAccount = require('../models/AdminAccount')
const { COOKIE_NAME, createToken, verifyToken, cookieOptions, revokeAll, MAX_AGE_SEC } = require('../lib/session')
const { lockStats } = require('../middleware/security')
const { isMailConfigured } = require('../lib/mailer')

const DEFAULT_PASSWORDS = new Set(['admin123', 'admin', 'password', '12345678'])

// GET /api/security/overview  (admin) — status keamanan untuk halaman "Keamanan".
async function overview(_req, res, next) {
  try {
    const accounts = await AdminAccount.count()
    const envPass = process.env.ADMIN_PASSWORD || 'admin123'
    const secret = process.env.SESSION_SECRET || ''
    const [failed24, success24] = await Promise.all([
      AuditLog.countSince('login_gagal', 24),
      AuditLog.countSince('login', 24),
    ])
    res.json({
      production: process.env.NODE_ENV === 'production',
      // Cek utama: kredensial bawaan .env masih bisa dipakai login?
      defaultAdminPassword: DEFAULT_PASSWORDS.has(envPass),
      weakSessionSecret: secret.length < 32,
      adminAccounts: accounts,
      sessionHours: MAX_AGE_SEC / 3600,
      mailConfigured: isMailConfigured(),
      loginFailed24h: failed24,
      loginSuccess24h: success24,
      lockouts: lockStats(),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/security/audit?limit=&action=  (admin)
async function audit(req, res, next) {
  try {
    res.json({ data: await AuditLog.list({ limit: req.query.limit, action: req.query.action }) })
  } catch (err) {
    next(err)
  }
}

// POST /api/security/revoke-all  (admin) — keluarkan semua sesi admin, KECUALI
// sesi pemanggil (ia dapat token baru supaya tidak ikut terlempar).
function revokeAllSessions(req, res) {
  const session = verifyToken(req.cookies?.[COOKIE_NAME])
  const iat = revokeAll()
  res.cookie(COOKIE_NAME, createToken(session?.sub || 'admin', iat), cookieOptions())
  AuditLog.record({ actor: session?.sub || '', action: 'keluarkan_semua_sesi', ip: req.ip || '' })
  res.json({ ok: true })
}

module.exports = { overview, audit, revokeAllSessions }
