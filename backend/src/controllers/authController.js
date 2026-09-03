const Admin = require('../models/Admin')
const { COOKIE_NAME, createToken, verifyToken, cookieOptions } = require('../lib/session')

// POST /api/auth/login
function login(req, res) {
  const { username, password } = req.body || {}
  if (!Admin.verify(username, password)) {
    return res.status(401).json({ error: 'Username atau password salah' })
  }
  res.cookie(COOKIE_NAME, createToken(), cookieOptions())
  res.json({ ok: true })
}

// POST /api/auth/logout
function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined })
  res.json({ ok: true })
}

// GET /api/auth/me
function me(req, res) {
  const token = req.cookies?.[COOKIE_NAME]
  const session = verifyToken(token)
  if (!session) return res.json({ admin: false })
  res.json({
    admin: true,
    username: process.env.ADMIN_USERNAME || 'admin',
    loginAt: session.iat || null,
  })
}

module.exports = { login, logout, me }
