const crypto = require('node:crypto')

const COOKIE_NAME = 'lazis_session'
const MAX_AGE_SEC = 60 * 60 * 24 * 7 // 7 hari

const secret = () => process.env.SESSION_SECRET || 'dev-secret-ganti-di-produksi'

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const sign = (payload) => b64url(crypto.createHmac('sha256', secret()).update(payload).digest())

function createToken(sub = 'admin') {
  const payload = b64url(JSON.stringify({ sub, iat: Date.now() }))
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
    return data
  } catch {
    return null
  }
}

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  maxAge: MAX_AGE_SEC * 1000,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
})

module.exports = { COOKIE_NAME, createToken, verifyToken, cookieOptions }
