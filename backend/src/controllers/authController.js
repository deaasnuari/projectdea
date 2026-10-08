const crypto = require('node:crypto')
const Admin = require('../models/Admin')
const AdminAccount = require('../models/AdminAccount')
const { COOKIE_NAME, createToken, verifyToken, cookieOptions } = require('../lib/session')
const { passwordError } = require('../lib/passwordPolicy')
const { lockRemaining, recordFail, recordSuccess } = require('../middleware/security')
const { sendMail, isMailConfigured } = require('../lib/mailer')

const POLICY_MSG = /sudah dipakai|wajib|minimal|maksimal|huruf/i
const waitText = (sec) => (sec < 60 ? `${sec} detik` : `${Math.ceil(sec / 60)} menit`)

// Balas 429 kalau kombinasi IP+username sedang terkunci. true = sudah dibalas.
function rejectIfLocked(req, res, username) {
  const locked = lockRemaining(req, username)
  if (!locked) return false
  res.set('Retry-After', String(locked))
  res.status(429).json({ error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${waitText(locked)}.` })
  return true
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body || {}
    const uname = String(username || '').trim().slice(0, 100)
    if (rejectIfLocked(req, res, uname)) return

    const ok = await Admin.verify(uname, String(password || '').slice(0, 200))
    if (!ok) {
      recordFail(req, uname)
      return res.status(401).json({ error: 'Username atau password salah' })
    }
    recordSuccess(req, uname)
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
    if (POLICY_MSG.test(err.message)) {
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

// POST /api/auth/change-password  (publik) — { username, currentPassword, newPassword }
// Wajib menyertakan password lama yang benar; percobaan salah ikut dihitung
// oleh pembatas login.
async function changePassword(req, res, next) {
  try {
    const b = req.body || {}
    const username = String(b.username || '').trim().slice(0, 100)
    const currentPassword = String(b.currentPassword || '').slice(0, 200)
    const newPassword = String(b.newPassword || '')

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Username, password lama & password baru wajib diisi' })
    }
    const pwErr = passwordError(newPassword)
    if (pwErr) return res.status(400).json({ error: pwErr })
    if (rejectIfLocked(req, res, username)) return

    if (!(await Admin.verify(username, currentPassword))) {
      recordFail(req, username)
      return res.status(401).json({ error: 'Password lama salah' })
    }
    recordSuccess(req, username)

    await AdminAccount.setPassword(username, newPassword)
    res.json({ ok: true })
  } catch (err) {
    if (POLICY_MSG.test(err.message)) return res.status(400).json({ error: err.message })
    next(err)
  }
}

// ---- Lupa password lewat kode email ---------------------------------------
// POST /api/auth/forgot-password { username } → kirim kode 6 digit ke email
//   akun itu sendiri (akun tanpa email terdaftar tidak bisa reset lewat
//   jalur ini). Jawaban selalu sama supaya username yang ada/tidak ada tidak bisa ditebak.
// POST /api/auth/reset-password { username, code, newPassword }
const RESET_TTL = 15 * 60 * 1000
const resets = new Map() // username(lowercase) -> { hash, exp, tries }
const hashCode = (c) => crypto.createHash('sha256').update(String(c)).digest('hex')

async function forgotPassword(req, res, next) {
  try {
    const username = String((req.body || {}).username || '').trim().slice(0, 100)
    if (!username) return res.status(400).json({ error: 'Username wajib diisi' })
    if (!isMailConfigured()) {
      return res.status(503).json({ error: 'Email server belum dikonfigurasi. Hubungi pengelola sistem.' })
    }

    const row = await AdminAccount.findByUsername(username)
    // Kode HANYA dikirim ke email yang terdaftar di akun tersebut.
    if (row && row.email) {
      const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0')
      resets.set(username.toLowerCase(), { hash: hashCode(code), exp: Date.now() + RESET_TTL, tries: 0 })
      try {
        await sendMail({
          to: row.email,
          subject: 'Kode reset password — Lazis PLN Batam',
          text: `Kode reset password akun "${username}": ${code}\n\nBerlaku 15 menit. Abaikan email ini jika Anda tidak memintanya.`,
        })
      } catch (e) {
        console.error('Gagal mengirim kode reset:', e.message)
      }
    }
    res.json({ ok: true, message: 'Jika akun ditemukan, kode reset dikirim ke email akun tersebut.' })
  } catch (err) {
    next(err)
  }
}

async function resetPassword(req, res, next) {
  try {
    const b = req.body || {}
    const username = String(b.username || '').trim().slice(0, 100)
    const code = String(b.code || '').trim()
    const newPassword = String(b.newPassword || '')
    if (!username || !code || !newPassword) {
      return res.status(400).json({ error: 'Username, kode & password baru wajib diisi' })
    }
    const pwErr = passwordError(newPassword)
    if (pwErr) return res.status(400).json({ error: pwErr })

    const key = username.toLowerCase()
    const entry = resets.get(key)
    const bad = () => res.status(400).json({ error: 'Kode salah atau sudah kedaluwarsa' })
    if (!entry || entry.exp < Date.now()) {
      resets.delete(key)
      return bad()
    }
    entry.tries += 1
    if (entry.tries > 5) {
      resets.delete(key)
      return bad()
    }
    const a = Buffer.from(entry.hash)
    const c = Buffer.from(hashCode(code))
    if (a.length !== c.length || !crypto.timingSafeEqual(a, c)) return bad()

    resets.delete(key)
    await AdminAccount.setPassword(username, newPassword)
    res.json({ ok: true })
  } catch (err) {
    if (POLICY_MSG.test(err.message)) return res.status(400).json({ error: err.message })
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
    const pwErr = passwordError(newPassword)
    if (pwErr) return res.status(400).json({ error: pwErr })

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
  forgotPassword,
  resetPassword,
  resetAccountPassword,
}
