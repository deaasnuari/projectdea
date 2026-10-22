// Logger server dengan penyamaran data sensitif. Semua log aplikasi lewat
// sini (bukan console.* langsung) supaya password, token, cookie, email, dan
// nilai rahasia lain tidak ikut tercetak ke terminal / file log.
//
// Yang dicatat untuk error: nama, kode, pesan, dan baris awal stack — BUKAN
// body request, isi query SQL beserta parameternya, atau detail baris database.

const SECRET_KV = /\b(password|passwd|pwd|secret|token|authorization|cookie|set-cookie|session[_-]?id|api[_-]?key|smtp[_-]?pass|code|kode(?:\s+reset)?)\b(\s*[=:]\s*)("[^"]*"|'[^']*'|[^\s,;&)]+)/gi
const BEARER = /\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const LONG_TOKEN = /\b[A-Za-z0-9_-]{32,}(?:\.[A-Za-z0-9_-]{16,})*\b/g // token/hash panjang
const DB_URL = /\b(postgres(?:ql)?|mysql|mongodb):\/\/[^\s]+/gi

function redact(value) {
  return String(value ?? '')
    .replace(DB_URL, '$1://[disamarkan]')
    .replace(BEARER, '$1 [disamarkan]')
    .replace(SECRET_KV, '$1$2[disamarkan]')
    .replace(EMAIL, '[email]')
    .replace(LONG_TOKEN, '[disamarkan]')
}

const isProd = () => process.env.NODE_ENV === 'production'
const stamp = () => new Date().toISOString()

// Ringkas sebuah error jadi teks aman.
function describeError(err) {
  if (!err) return ''
  const parts = [err.name || 'Error']
  if (err.code) parts.push(`(${err.code})`)
  parts.push(`: ${redact(err.message)}`)
  let out = parts.join('')
  if (err.stack) {
    const frames = String(err.stack).split('\n').slice(1, isProd() ? 4 : 6).map((l) => redact(l.trim()))
    if (frames.length) out += `\n    ${frames.join('\n    ')}`
  }
  return out
}

function write(level, tag, message, err) {
  const line = `${stamp()} ${level.toUpperCase()} [${tag}] ${redact(message)}${err ? ` — ${describeError(err)}` : ''}`
  // eslint-disable-next-line no-console
  ;(level === 'error' ? console.error : level === 'warn' ? console.warn : console.log)(line)
}

module.exports = {
  redact,
  info: (tag, message) => write('info', tag, message),
  warn: (tag, message, err) => write('warn', tag, message, err),
  error: (tag, message, err) => write('error', tag, message, err),
}
