// Verifikasi login admin. Cek tabel `admin_accounts` dulu; kalau username
// tidak ada di sana, jatuh ke akun bawaan dari environment supaya akses
// awal tidak pernah terkunci.
const AdminAccount = require('./AdminAccount')

const ENV_USER = () => process.env.ADMIN_USERNAME || 'admin'
const ENV_PASS = () => process.env.ADMIN_PASSWORD || 'admin123'

async function verify(username, password) {
  const uname = String(username || '').trim()
  if (!uname) return false

  const dbResult = await AdminAccount.checkCredentials(uname, password)
  if (dbResult !== null) return dbResult // username ada di tabel → tabel yang menentukan

  // Username tidak ada di tabel → cocokkan dengan akun bawaan env.
  return uname.toLowerCase() === ENV_USER().toLowerCase() && password === ENV_PASS()
}

// Apakah username ini akun bawaan env yang belum pernah dipindah ke tabel?
function isEnvUser(username) {
  return String(username || '').trim().toLowerCase() === ENV_USER().toLowerCase()
}

module.exports = { verify, isEnvUser, ENV_USER }
