const Admin = require('../models/Admin')
const AdminAccount = require('../models/AdminAccount')
const { COOKIE_NAME, createToken, verifyToken, cookieOptions } = require('../lib/session')

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body || {}
    const uname = String(username || '').trim()
    const ok = await Admin.verify(uname, password)
    if (!ok) return res.status(401).json({ error: 'Username atau password salah' })
    res.cookie(COOKIE_NAME, createToken(uname || 'admin'), cookieOptions())
    res.json({ ok: true, username: uname || 'admin' })
  } catch (err) {
    next(err)
  }
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
    username: session.sub || process.env.ADMIN_USERNAME || 'admin',
    loginAt: session.iat || null,
  })
}

// POST /api/auth/register  (admin) — buat akun baru
async function register(req, res, next) {
  try {
    const b = req.body || {}
    const account = await AdminAccount.create({
      username: b.username,
      name: b.name,
      nik: b.nik,
      email: b.email,
      password: b.password,
    })
    res.status(201).json(account)
  } catch (err) {
    if (/sudah dipakai|wajib|minimal/i.test(err.message)) {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
}

// GET /api/auth/accounts  (admin)
async function listAccounts(_req, res, next) {
  try {
    res.json({ data: await AdminAccount.list() })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/auth/accounts/:id  (admin)
async function removeAccount(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const ok = await AdminAccount.remove(id)
    if (!ok) return res.status(404).json({ error: 'Akun tidak ditemukan' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/change-password  (publik) — { username, newPassword }
// Alur "lupa password": set password baru langsung tanpa password lama.
async function changePassword(req, res, next) {
  try {
    const b = req.body || {}
    const username = String(b.username || '').trim()
    const newPassword = String(b.newPassword || '')

    if (!username || !newPassword) {
      return res.status(400).json({ error: 'Username & password baru wajib diisi' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter' })
    }

    await AdminAccount.setPassword(username, newPassword)
    res.json({ ok: true })
  } catch (err) {
    if (/minimal/i.test(err.message)) return res.status(400).json({ error: err.message })
    next(err)
  }
}

// POST /api/auth/accounts/:id/reset-password  (admin) — { newPassword }
async function resetAccountPassword(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'ID tidak valid' })
    const row = await AdminAccount.findById(id)
    if (!row) return res.status(404).json({ error: 'Akun tidak ditemukan' })

    const newPassword = String((req.body || {}).newPassword || '')
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password baru minimal 6 karakter' })

    await AdminAccount.setPassword(row.username, newPassword)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  login,
  logout,
  me,
  register,
  listAccounts,
  removeAccount,
  changePassword,
  resetAccountPassword,
}
