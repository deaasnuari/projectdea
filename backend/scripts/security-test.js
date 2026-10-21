// Uji keamanan otomatis terhadap API yang SEDANG JALAN (default http://localhost:3001):
//   node scripts/security-test.js [baseUrl]
// Mencoba payload SQL injection di login & parameter publik, akses tanpa login,
// pembatas brute-force, dan header keamanan. Tidak mengubah data apa pun.
const BASE = process.argv[2] || 'http://localhost:3001'
const ORIGIN = 'http://localhost:3000'
let pass = 0
let fail = 0

const ok = (name, cond, extra = '') => {
  cond ? pass++ : fail++
  console.log(`${cond ? '✓' : '✗'} ${name}${extra ? ` — ${extra}` : ''}`)
}
const call = (path, opts = {}) =>
  fetch(BASE + path, { ...opts, headers: { Origin: ORIGIN, 'Content-Type': 'application/json', ...(opts.headers || {}) } })
// Ambil soal CAPTCHA lalu jawab benar (untuk menguji validasi input form publik).
async function captcha(wrong = false) {
  const c = await (await call('/api/captcha')).json()
  const m = /(\d+) ([+\u2212\u00d7]) (\d+)/.exec(c.question)
  const x = Number(m[1])
  const y = Number(m[3])
  const ans = m[2] === '+' ? x + y : m[2] === '\u2212' ? x - y : x * y
  return { captchaToken: c.token, captchaAnswer: String(wrong ? ans + 1 : ans) }
}
const login = (body) => call('/api/auth/login', { method: 'POST', body: JSON.stringify(body) })

const SQLI = [
  "' OR '1'='1",
  "admin' --",
  "admin'/*",
  '" OR ""="',
  "' OR 1=1 --",
  "'; DROP TABLE admin_accounts; --",
  "' UNION SELECT NULL,NULL,NULL --",
  "admin' AND (SELECT pg_sleep(3)) --",
  "\' OR \'1\'=\'1",
]

async function main() {
  console.log(`Menguji ${BASE}\n`)

  // 1) SQL injection di form login (username & password)
  for (const p of SQLI) {
    const t0 = Date.now()
    const r1 = await login({ username: p, password: 'x' })
    const r2 = await login({ username: 'admin', password: p })
    const slow = Date.now() - t0 > 2500 // pg_sleep berhasil jalan = rentan
    ok(`Login SQLi ditolak: ${p.slice(0, 32)}`, [400, 401, 429].includes(r1.status) && [400, 401, 429].includes(r2.status) && !slow, `${r1.status}/${r2.status}`)
  }

  // 2) Tipe data tak wajar (NoSQL/JSON-style injection, array, angka, null)
  for (const body of [
    { username: { $ne: null }, password: { $ne: null } },
    { username: ['admin'], password: ['x'] },
    { username: 123, password: 456 },
    { username: null, password: null },
    {},
  ]) {
    const r = await login(body)
    ok(`Login tipe aneh ditolak: ${JSON.stringify(body).slice(0, 40)}`, r.status === 400 || r.status === 401 || r.status === 429, String(r.status))
  }

  // 3) SQL injection di parameter/URL publik — tidak boleh 500 / bocor error SQL
  const probes = [
    '/api/programs?x=%27%20OR%201%3D1--',
    "/api/blog/%27%20OR%201%3D1--",
    "/api/programs/%27%3B%20DROP%20TABLE%20programs%3B--",
    "/api/text-elements?page=%27%20OR%20%271%27%3D%271",
    "/api/menus?x=1%27",
    "/api/doc-videos/1%20OR%201%3D1",
  ]
  for (const path of probes) {
    const r = await call(path)
    const text = await r.text()
    const leaks = /syntax error|pg_|postgres|relation ".*" does not exist|SQLSTATE/i.test(text)
    ok(`Parameter publik aman: ${decodeURIComponent(path).slice(0, 48)}`, r.status < 500 && !leaks, String(r.status))
  }

  // 4) Endpoint admin tanpa login → 401
  for (const [m, path] of [['GET', '/api/donations'], ['GET', '/api/auth/accounts'], ['POST', '/api/uploads'], ['GET', '/api/contact-messages'], ['POST', '/api/auth/register']]) {
    const r = await call(path, { method: m, body: m === 'POST' ? '{}' : undefined })
    ok(`Tanpa login ditolak: ${m} ${path}`, r.status === 401, String(r.status))
  }

  // 5) Cookie sesi palsu / dirusak ditolak
  const fake = await call('/api/donations', { headers: { Cookie: 'lazis_session=eyJzdWIiOiJhZG1pbiIsImlhdCI6OTk5OTk5OTk5OTk5OX0.palsu' } })
  ok('Cookie sesi palsu ditolak', fake.status === 401, String(fake.status))

  // 6) Origin asing tidak boleh mengubah data (anti-CSRF)
  const evil = await fetch(BASE + '/api/auth/logout', { method: 'POST', headers: { Origin: 'http://situs-jahat.example' } })
  ok('Origin asing ditolak (CSRF)', evil.status === 403, String(evil.status))

  // 7) Header keamanan
  const h = await call('/api/health')
  for (const k of ['x-content-type-options', 'x-frame-options', 'content-security-policy', 'referrer-policy']) {
    ok(`Header ${k} ada`, !!h.headers.get(k))
  }
  ok('X-Powered-By disembunyikan', !h.headers.get('x-powered-by'))
  const a = await login({ username: 'admin', password: 'salah-sekali' })
  ok('Respons login: Cache-Control no-store', /no-store/.test(a.headers.get('cache-control') || ''))

  // 8) Pembatas brute-force (per IP) — 25 percobaan beruntun harus kena 429
  let limited = false
  for (let i = 0; i < 25 && !limited; i++) {
    const r = await login({ username: `tebak${i}`, password: 'salah' })
    if (r.status === 429) limited = true
  }
  ok('Brute-force dibatasi (HTTP 429)', limited)

  // 9) Validasi input publik (hanya input TIDAK valid → tidak ada data tersimpan)
  const bad = [
    ['Donasi nominal negatif', '/api/donations', { donorName: 'A', amount: -5 }],
    ['Donasi nominal raksasa', '/api/donations', { donorName: 'A', amount: 1e15 }],
    ['Donasi nominal bukan angka', '/api/donations', { donorName: 'A', amount: "1; DROP TABLE donations" }],
    ['Kontak email tidak valid', '/api/contact-messages', { name: 'A', email: 'bukan-email', phone: '08123456789', message: 'hai', consent: true }],
    ['Kontak email berisi CRLF (header injection)', '/api/contact-messages', { name: 'A', email: 'a@b.co\r\nBcc: x@y.z', phone: '08123456789', message: 'hai', consent: true }],
    ['Kontak no. HP tidak valid', '/api/contact-messages', { name: 'A', email: 'a@b.co', phone: '<script>1</script>', message: 'hai', consent: true }],
    ['Kontak tanpa persetujuan', '/api/contact-messages', { name: 'A', email: 'a@b.co', phone: '08123456789', message: 'hai' }],
  ]
  // Tanpa/ dengan CAPTCHA salah → ditolak; token tidak boleh dipakai dua kali.
  const noCap = await call('/api/donations', { method: 'POST', body: JSON.stringify({ donorName: 'A', amount: 1000 }) })
  ok('Donasi tanpa CAPTCHA ditolak', noCap.status === 400 && (await noCap.json()).captcha === true, String(noCap.status))
  const wrongCap = await call('/api/contact-messages', { method: 'POST', body: JSON.stringify({ name: 'A', email: 'a@b.co', phone: '08123456789', message: 'hai', consent: true, ...(await captcha(true)) }) })
  ok('Kontak dengan CAPTCHA salah ditolak', wrongCap.status === 400 || wrongCap.status === 429, String(wrongCap.status))
  const reuse = await captcha()
  await call('/api/donations', { method: 'POST', body: JSON.stringify({ donorName: 'A', amount: -1, ...reuse }) })
  const again = await call('/api/donations', { method: 'POST', body: JSON.stringify({ donorName: 'A', amount: -1, ...reuse }) })
  ok('Token CAPTCHA tidak bisa dipakai ulang', again.status === 400 && (await again.json()).captcha === true, String(again.status))

  for (const [name, path, body] of bad) {
    const r = await call(path, { method: 'POST', body: JSON.stringify({ ...body, ...(await captcha()) }) })
    ok(`${name} ditolak`, r.status === 400 || r.status === 429, String(r.status))
  }

  // Endpoint keamanan admin: wajib login
  for (const p2 of ['/api/security/overview', '/api/security/audit']) {
    const r = await call(p2)
    ok(`Tanpa login ditolak: GET ${p2}`, r.status === 401, String(r.status))
  }
  const rv = await call('/api/security/revoke-all', { method: 'POST', body: '{}' })
  ok('Tanpa login ditolak: POST /api/security/revoke-all', rv.status === 401, String(rv.status))

  // 10) Database masih utuh setelah semua payload di atas
  const hc = await call('/api/health')
  ok('API & database masih sehat', hc.status === 200, String(hc.status))

  console.log(`\n${pass} lulus, ${fail} gagal`)
  process.exit(fail ? 1 : 0)
}
main().catch((e) => { console.error('Tidak bisa terhubung:', e.message); process.exit(2) })
