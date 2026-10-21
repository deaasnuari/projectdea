const crypto = require('node:crypto')

const COOKIE_NAME = 'lazis_session'
const MAX_AGE_SEC = 60 * 60 * 12 // 12 jam — sesi admin tidak perlu berumur panjang

const secret = () => process.env.SESSION_SECRET || 'dev-secret-ganti-di-produksi'

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const sign = (payload) => b64url(crypto.createHmac('sha256', secret()).update(payload).digest())

// Pencabutan sesi (di memori server): token yang di-logout dicatat per `jti`,
// dan ganti/reset password mencabut SEMUA sesi lama akun itu (cutoff waktu).
// Hilang saat server restart — tidak masalah, sesi memang pendek (12 jam).
const revokedJti = new Map() // jti -> iat
const cutoffs = new Map() // username(lowercase) -> waktu pencabutan
let allBefore = 0 // semua sesi yang dibuat sebelum waktu ini tidak berlaku

setInterval(() => {
  const old = Date.now() - MAX_AGE_SEC * 1000
  for (const [j, iat] of revokedJti) if (iat < old) revokedJti.delete(j)
}, 30 * 60 * 1000).unref()

function createToken(sub = 'admin', iat = Date.now()) {
  const payload = b64url(JSON.stringify({ sub, iat, jti: crypto.randomBytes(12).toString('hex') }))
  return `${payload}.${sign(payload)}`
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = sign(payload)
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null
  }
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64'))
    if (Date.now() - data.iat > MAX_AGE_SEC * 1000) return null
    if (data.jti && revokedJti.has(data.jti)) return null
    if (data.iat <= allBefore) return null
    const cut = cutoffs.get(String(data.sub || '').toLowerCase())
    if (cut && data.iat <= cut) return null
    return data
  } catch {
    return null
  }
}

// Cabut satu token (logout) / semua sesi sebuah akun (ganti password).
function revokeToken(token) {
  const data = verifyToken(token)
  if (data?.jti) revokedJti.set(data.jti, data.iat)
}
// Keluarkan SEMUA admin sekaligus. Mengembalikan `iat` untuk token pengganti
// pemanggil (supaya ia sendiri tidak ikut keluar).
function revokeAll() {
  allBefore = Date.now()
  return allBefore + 1
}
const revokeUser = (username) => cutoffs.set(String(username || '').toLowerCase(), Date.now())

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  maxAge: MAX_AGE_SEC * 1000,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
})

module.exports = { COOKIE_NAME, createToken, verifyToken, cookieOptions, revokeToken, revokeUser, revokeAll, MAX_AGE_SEC }
