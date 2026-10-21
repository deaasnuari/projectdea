// CAPTCHA sederhana buatan sendiri (soal hitung) untuk form publik — tanpa
// layanan pihak ketiga (tidak ada cookie/pelacak dari Google dll.).
//
// Tanpa penyimpanan sisi server: tantangan = token bertanda-tangan HMAC yang
// berisi hash jawaban + waktu kedaluwarsa. Tiap token hanya bisa dipakai SEKALI
// (nonce dicatat di memori sampai kedaluwarsa).
const crypto = require('node:crypto')

const TTL_MS = 5 * 60 * 1000
const secret = () => process.env.SESSION_SECRET || 'dev-secret-ganti-di-produksi'
const used = new Map() // nonce -> exp

setInterval(() => {
  const now = Date.now()
  for (const [n, exp] of used) if (exp < now) used.delete(n)
}, 60 * 1000).unref()

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const mac = (e, n, answer) =>
  crypto.createHmac('sha256', secret()).update(`captcha|${e}|${n}|${answer}`).digest('base64url')

function createChallenge() {
  const a = crypto.randomInt(2, 10)
  const b = crypto.randomInt(2, 10)
  const op = crypto.randomInt(0, 3) // 0: +, 1: -, 2: x
  const [x, y] = op === 1 && b > a ? [b, a] : [a, b]
  const answer = op === 0 ? x + y : op === 1 ? x - y : x * y
  const sym = ['+', '\u2212', '\u00d7'][op]
  const e = Date.now() + TTL_MS
  const n = crypto.randomBytes(8).toString('hex')
  return { token: `${b64({ e, n })}.${mac(e, n, answer)}`, question: `${x} ${sym} ${y} = ?` }
}

// true hanya kalau token asli, belum kedaluwarsa, belum pernah dipakai, dan jawaban benar.
function verifyChallenge(token, answer) {
  if (typeof token !== 'string' || token.length > 300) return false
  const [p, sig] = token.split('.')
  if (!p || !sig) return false
  let data
  try {
    data = JSON.parse(Buffer.from(p, 'base64url').toString())
  } catch {
    return false
  }
  const { e, n } = data || {}
  if (typeof e !== 'number' || typeof n !== 'string' || e < Date.now() || used.has(n)) return false
  const given = String(answer ?? '').trim()
  if (!/^-?\d{1,4}$/.test(given)) return false
  const expected = mac(e, n, Number(given))
  const ok = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  if (ok) used.set(n, e) // sekali pakai
  return ok
}

// Middleware: wajib menyertakan captchaToken + captchaAnswer yang benar di body.
function requireCaptcha(req, res, next) {
  const b = req.body || {}
  if (!verifyChallenge(b.captchaToken, b.captchaAnswer)) {
    return res.status(400).json({ error: 'Jawaban verifikasi salah atau kedaluwarsa. Coba soal yang baru.', captcha: true })
  }
  next()
}

module.exports = { createChallenge, verifyChallenge, requireCaptcha }
