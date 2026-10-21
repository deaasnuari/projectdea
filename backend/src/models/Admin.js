// Verifikasi login admin. Cek tabel `admin_accounts` dulu; kalau username
// tidak ada di sana, jatuh ke akun bawaan dari environment supaya akses
// awal tidak pernah terkunci.
const crypto = require('node:crypto')
const AdminAccount = require('./AdminAccount')
const { verifyPassword } = require('../lib/password')

const ENV_USER = () => process.env.ADMIN_USERNAME || 'admin'
const ENV_PASS = () => process.env.ADMIN_PASSWORD || 'admin123'

// Banding dua string tanpa bocor panjang/isi lewat waktu (hash dulu → sama panjang).
const digest = (v) => crypto.createHash('sha256').update(String(v)).digest()
const safeEqual = (a, b) => crypto.timingSafeEqual(digest(a), digest(b))

// Hash palsu untuk menyamakan waktu respons saat username tidak dikenal.
const DUMMY_HASH = `scrypt$${'00'.repeat(16)}$${'00'.repeat(64)}`

async function verify(username, password) {
  const uname = String(username || '').trim()
  if (!uname) return false

  const dbResult = await AdminAccount.checkCredentials(uname, password)
  if (dbResult !== null) return dbResult // username ada di tabel → tabel yang menentukan

  // Username tidak ada di tabel → cocokkan dengan akun bawaan env.
  // Perbandingan waktu-konstan (tidak bocor lewat lama respons), dan username
  // yang salah tetap memakan waktu hashing yang sama seperti username benar.
  const userOk = safeEqual(uname.toLowerCase(), ENV_USER().toLowerCase())
  const passOk = safeEqual(String(password), ENV_PASS())
  if (!userOk) verifyPassword(String(password), DUMMY_HASH) // samakan waktu
  return userOk && passOk
}

// Apakah username ini akun bawaan env yang belum pernah dipindah ke tabel?
function isEnvUser(username) {
  return String(username || '').trim().toLowerCase() === ENV_USER().toLowerCase()
}

module.exports = { verify, isEnvUser, ENV_USER }
