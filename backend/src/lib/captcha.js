// CAPTCHA sederhana buatan sendiri (4 huruf acak dalam gambar) untuk form
// publik — tanpa layanan pihak ketiga (tidak ada cookie/pelacak dari Google dll.).
//
// Tanpa penyimpanan sisi server: tantangan = token bertanda-tangan HMAC yang
// berisi hash jawaban + waktu kedaluwarsa. Tiap token hanya bisa dipakai SEKALI
// (nonce dicatat di memori sampai kedaluwarsa). Hurufnya HANYA ada di dalam
// gambar SVG (bukan teks di JSON), supaya tidak bisa dibaca bot dari respons API.
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

// Tanpa huruf yang mudah tertukar (I, L, O). Jawaban tidak membedakan huruf besar/kecil.
const LETTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ'
const LENGTH = 4
const pick = (n) => crypto.randomInt(0, n)
const rnd = (a, b) => a + crypto.randomInt(0, (b - a) * 10 + 1) / 10
const COLORS = ['#1f3a5f', '#0b6b4f', '#7a2e2e', '#4b3a7a', '#2f2f2f']

// Gambar SVG: huruf miring/bergeser + garis dan titik pengganggu.
function renderSvg(text) {
  const W = 128
  const H = 44
  const parts = [`<rect width="${W}" height="${H}" fill="#f4f6f8"/>`]
  for (let i = 0; i < 5; i += 1) {
    parts.push(
      `<line x1="${rnd(0, W)}" y1="${rnd(0, H)}" x2="${rnd(0, W)}" y2="${rnd(0, H)}" stroke="${COLORS[pick(COLORS.length)]}" stroke-opacity="0.45" stroke-width="${rnd(1, 2)}"/>`,
    )
  }
  for (let i = 0; i < 25; i += 1) {
    parts.push(`<circle cx="${rnd(0, W)}" cy="${rnd(0, H)}" r="${rnd(0.6, 1.4)}" fill="#8a94a0"/>`)
  }
  const step = W / (text.length + 1)
  ;[...text].forEach((ch, i) => {
    const x = step * (i + 1)
    const y = H / 2 + 9 + rnd(-4, 4)
    parts.push(
      `<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${rnd(26, 31)}" font-weight="700" fill="${COLORS[pick(COLORS.length)]}" text-anchor="middle" transform="rotate(${rnd(-22, 22)} ${x} ${y})">${ch}</text>`,
    )
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function createChallenge() {
  let text = ''
  for (let i = 0; i < LENGTH; i += 1) text += LETTERS[pick(LETTERS.length)]
  const e = Date.now() + TTL_MS
  const n = crypto.randomBytes(8).toString('hex')
  const out = { token: `${b64({ e, n })}.${mac(e, n, text)}`, image: renderSvg(text) }
  // Hanya untuk uji otomatis di lokal (tidak aktif di production).
  if (process.env.CAPTCHA_DEBUG === '1' && process.env.NODE_ENV !== 'production') out.debugAnswer = text
  return out
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
  if (!/^[A-Za-z]{4}$/.test(given)) return false
  const expected = mac(e, n, given.toUpperCase())
  const ok = sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  if (ok) used.set(n, e) // sekali pakai
  return ok
}

// Middleware: wajib menyertakan captchaToken + captchaAnswer yang benar di body.
function requireCaptcha(req, res, next) {
  const b = req.body || {}
  if (!verifyChallenge(b.captchaToken, b.captchaAnswer)) {
    return res.status(400).json({ error: 'Huruf verifikasi salah atau kedaluwarsa. Coba gambar yang baru.', captcha: true })
  }
  next()
}

module.exports = { createChallenge, verifyChallenge, requireCaptcha }
