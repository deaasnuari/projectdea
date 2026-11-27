// Alat bantu tes API (blackbox). Menyalakan server backend SENDIRI di port khusus tes,
// jadi tidak mengganggu backend yang sedang kamu pakai dan tidak menyentuh rate limit-nya.
//
//  - PORT=3099, CAPTCHA_DEBUG=1 (jawaban CAPTCHA muncul di respons, hanya luar production)
//  - RATE_LIMIT_MULTIPLIER dinaikkan supaya rate limit tidak ikut campur (rate limit diuji di security:test)
//  - Akun admin SEKALI PAKAI lewat ADMIN_USERNAME/ADMIN_PASSWORD yang hanya ada di proses ini
//    (login jatuh ke akun bawaan env), jadi tidak butuh akun asli dan tabel akun tidak berubah.
//
// Tes memakai database yang sama dengan .env. Data uji diberi penanda "TEST API" dan dihapus lagi.
const { spawn } = require('node:child_process')
const crypto = require('node:crypto')
const path = require('node:path')

const PORT = Number(process.env.TEST_PORT) || 3099
const BASE = `http://localhost:${PORT}`
const ORIGIN = 'http://localhost:3000'
const ADMIN_USER = 'qa-api-test'
const ADMIN_PASS = `Qa${crypto.randomBytes(12).toString('hex')}9`

let child = null

// Tes ini MENULIS data ke database. Tolak database jarak jauh (mis. Neon production)
// kecuali sengaja diizinkan dengan TEST_ALLOW_REMOTE_DB=1.
function assertSafeDatabase() {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true })
  let host = ''
  try {
    host = new URL(process.env.DATABASE_URL).hostname
  } catch {
    // URL tidak terbaca → dianggap tidak aman
  }
  if (['localhost', '127.0.0.1'].includes(host) || process.env.TEST_ALLOW_REMOTE_DB === '1') return
  throw new Error(
    'npm test dibatalkan: DATABASE_URL bukan database lokal, sedangkan tes ini membuat dan menghapus data. ' +
      'Jalankan dengan DATABASE_URL database lokal/uji.',
  )
}

async function startServer(extraEnv = {}) {
  assertSafeDatabase()
  child = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      NODE_ENV: 'test',
      PORT: String(PORT),
      CAPTCHA_DEBUG: '1',
      // Tes upload di sini memakai folder lokal: jangan sampai menyentuh Blob store asli.
      BLOB_READ_WRITE_TOKEN: '',
      RATE_LIMIT_MULTIPLIER: '1000', // semua pembatas (login, donasi, kontak, API) dilonggarkan khusus tes
      ADMIN_USERNAME: ADMIN_USER,
      ADMIN_PASSWORD: ADMIN_PASS,
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let log = ''
  child.stdout.on('data', (d) => (log += d))
  child.stderr.on('data', (d) => (log += d))
  child.on('exit', (code) => {
    if (code) console.error(`[tes] server tes berhenti dengan kode ${code}\n${log}`)
  })
  for (let i = 0; i < 60; i += 1) {
    try {
      const r = await fetch(`${BASE}/api/health`)
      if (r.ok) return
    } catch {
      // belum siap
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`Server tes tidak siap di ${BASE}\n${log}`)
}

function stopServer() {
  if (child && !child.killed) child.kill()
}

// Klien HTTP kecil. `cookie` diisi setelah login dan dikirim di request berikutnya.
class Client {
  constructor() {
    this.cookie = ''
  }

  async request(method, url, body, extraHeaders = {}) {
    const headers = { Origin: ORIGIN, ...extraHeaders }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (this.cookie) headers.Cookie = this.cookie
    const res = await fetch(BASE + url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
    const text = await res.text()
    let json = null
    try {
      json = JSON.parse(text)
    } catch {
      // bukan JSON
    }
    return { status: res.status, headers: res.headers, text, json }
  }

  get(url) { return this.request('GET', url) }
  post(url, body) { return this.request('POST', url, body ?? {}) }
  put(url, body) { return this.request('PUT', url, body ?? {}) }
  patch(url, body) { return this.request('PATCH', url, body ?? {}) }
  del(url) { return this.request('DELETE', url) }

  async login(username = ADMIN_USER, password = ADMIN_PASS) {
    const r = await this.post('/api/auth/login', { username, password })
    const setCookie = r.headers.getSetCookie?.() ?? []
    const c = setCookie.find((x) => x.startsWith('lazis_session='))
    if (r.status === 200 && c) this.cookie = c.split(';')[0]
    return { ...r, setCookie }
  }
}

// Ambil soal CAPTCHA lalu kembalikan jawaban benar (hanya bisa jika server tes memakai CAPTCHA_DEBUG=1).
async function captcha(client, wrong = false) {
  const r = await client.get('/api/captcha')
  const ans = r.json.debugAnswer
  return { captchaToken: r.json.token, captchaAnswer: wrong ? (ans[0] === 'A' ? 'B' : 'A') + ans.slice(1) : ans }
}

const list = (json) => (Array.isArray(json) ? json : json?.data ?? [])

module.exports = { BASE, PORT, ADMIN_USER, ADMIN_PASS, startServer, stopServer, Client, captcha, list }
