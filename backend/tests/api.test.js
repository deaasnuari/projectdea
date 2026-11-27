// Tes API fungsional (blackbox) LAZIS PLN Batam. Jalankan: npm test
// Server backend dinyalakan otomatis di port khusus tes (lihat helpers.js).
const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { startServer, stopServer, Client, captcha, list, ADMIN_USER, ADMIN_PASS } = require('./helpers')

const TAG = `TEST API ${Date.now()}`
// PNG 1x1 piksel yang sah, untuk uji upload.
const PNG_1PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')

before(async () => {
  await startServer()
})
after(() => stopServer())

describe('Publik: baca data', () => {
  const pub = new Client()

  it('GET /api/health membalas status ok', async () => {
    const r = await pub.get('/api/health')
    assert.equal(r.status, 200)
    assert.equal(r.json.status, 'ok')
  })

  for (const url of [
    '/api/programs', '/api/programs/summary', '/api/blog', '/api/menus', '/api/bank-accounts',
    '/api/donation-types', '/api/team', '/api/doc-videos', '/api/doc-photos', '/api/donor-info',
    '/api/home', '/api/about', '/api/contact', '/api/text-elements',
  ]) {
    it(`GET ${url} membalas 200 berisi JSON`, async () => {
      const r = await pub.get(url)
      assert.equal(r.status, 200)
      assert.ok(r.json !== null, 'respons harus JSON')
    })
  }

  it('slug yang tidak ada membalas 404, bukan 200 atau 500', async () => {
    assert.equal((await pub.get('/api/blog/slug-yang-tidak-ada-xyz')).status, 404)
    assert.equal((await pub.get('/api/programs/slug-yang-tidak-ada-xyz')).status, 404)
  })

  it('respons publik tidak memuat kunci sensitif', async () => {
    for (const url of ['/api/programs', '/api/blog', '/api/bank-accounts', '/api/team', '/api/home', '/api/menus']) {
      const r = await pub.get(url)
      assert.doesNotMatch(r.text, /"(password|password_hash|secret|token|session)\w*":/i, url)
    }
  })

  it('/uploads tidak bisa di-listing dan tidak bisa path traversal', async () => {
    assert.equal((await pub.get('/uploads/')).status, 404)
    assert.equal((await pub.get('/uploads/..%2f.env')).status, 404)
  })
})

describe('Publik: CAPTCHA dan form', () => {
  const pub = new Client()
  const kontakOk = { name: `${TAG}`, email: 'tes@contoh.com', phone: '08123456789', message: 'tes otomatis', consent: true }

  it('CAPTCHA berupa gambar SVG dan token', async () => {
    const r = await pub.get('/api/captcha')
    assert.equal(r.status, 200)
    assert.match(r.json.image, /^data:image\/svg\+xml;base64,/)
    assert.equal(typeof r.json.token, 'string')
    assert.equal(r.json.question, undefined, 'soal teks tidak boleh ada lagi')
  })

  it('kontak tanpa CAPTCHA ditolak 400', async () => {
    const r = await pub.post('/api/contact-messages', kontakOk)
    assert.equal(r.status, 400)
    assert.equal(r.json.captcha, true)
  })

  it('kontak dengan CAPTCHA salah ditolak 400', async () => {
    const r = await pub.post('/api/contact-messages', { ...kontakOk, ...(await captcha(pub, true)) })
    assert.equal(r.status, 400)
    assert.equal(r.json.captcha, true)
  })

  for (const [nama, patch, pesan] of [
    ['email tidak valid', { email: 'bukan-email' }, /email/i],
    ['email berisi CRLF', { email: 'a@b.co\r\nBcc: x@y.z' }, /email/i],
    ['no. HP tidak valid', { phone: '<script>1</script>' }, /HP/i],
    ['tanpa persetujuan PDP', { consent: false }, /persetujuan/i],
  ]) {
    it(`kontak ${nama} ditolak 400 dengan pesan jelas`, async () => {
      const r = await pub.post('/api/contact-messages', { ...kontakOk, ...patch, ...(await captcha(pub)) })
      assert.equal(r.status, 400)
      assert.match(r.json.error, pesan)
    })
  }

  it('token CAPTCHA tidak bisa dipakai dua kali', async () => {
    const c = await captcha(pub)
    await pub.post('/api/donations', { donorName: TAG, amount: -1, ...c }) // gagal validasi, token tetap terpakai
    const again = await pub.post('/api/donations', { donorName: TAG, amount: -1, ...c })
    assert.equal(again.status, 400)
    assert.equal(again.json.captcha, true)
  })

  for (const [nama, amount] of [['negatif', -5000], ['nol', 0], ['raksasa', 1e15], ['bukan angka', 'abc'], ['SQL', '1; DROP TABLE donations']]) {
    it(`donasi nominal ${nama} ditolak 400`, async () => {
      const r = await pub.post('/api/donations', { donorName: TAG, amount, ...(await captcha(pub)) })
      assert.equal(r.status, 400)
      assert.match(r.json.error, /nominal/i)
    })
  }

  it('donasi tanpa nama (bukan anonim) ditolak 400', async () => {
    const r = await pub.post('/api/donations', { amount: 10000, ...(await captcha(pub)) })
    assert.equal(r.status, 400)
  })
})

describe('Admin: wajib login', () => {
  const anon = new Client()
  for (const [method, url] of [
    ['GET', '/api/donations'], ['GET', '/api/donations/stats'], ['GET', '/api/contact-messages'],
    ['GET', '/api/auth/accounts'], ['GET', '/api/menus/all'], ['GET', '/api/security/audit'],
    ['POST', '/api/uploads'], ['POST', '/api/blog'], ['PUT', '/api/home'], ['DELETE', '/api/team/1'],
  ]) {
    it(`${method} ${url} tanpa login membalas 401`, async () => {
      const r = await anon.request(method, url, method === 'GET' ? undefined : {})
      assert.equal(r.status, 401)
    })
  }

  it('cookie sesi palsu ditolak 401', async () => {
    const c = new Client()
    c.cookie = 'lazis_session=palsu.palsu'
    assert.equal((await c.get('/api/donations')).status, 401)
  })
})

describe('Login dan sesi', () => {
  it('password salah ditolak 401 dengan pesan seragam', async () => {
    const r = await new Client().login(ADMIN_USER, 'salah-sekali-123')
    assert.equal(r.status, 401)
    assert.equal(r.json.error, 'Username atau password salah')
  })

  it('username tidak dikenal mendapat pesan yang sama (tidak membocorkan akun)', async () => {
    const r = await new Client().login('tidak-ada-akun-ini', 'apa-saja-123')
    assert.equal(r.status, 401)
    assert.equal(r.json.error, 'Username atau password salah')
  })

  it('body bertipe aneh ditolak 400', async () => {
    const c = new Client()
    assert.equal((await c.post('/api/auth/login', { username: { $ne: null }, password: { $ne: null } })).status, 400)
    assert.equal((await c.post('/api/auth/login', { username: ['admin'], password: ['x'] })).status, 400)
  })

  it('login benar: 200, cookie HttpOnly dan SameSite=Lax', async () => {
    const c = new Client()
    const r = await c.login()
    assert.equal(r.status, 200)
    const cookie = r.setCookie.find((x) => x.startsWith('lazis_session='))
    assert.ok(cookie, 'harus ada cookie sesi')
    assert.match(cookie, /HttpOnly/i)
    assert.match(cookie, /SameSite=Lax/i)
    assert.equal((await c.get('/api/donations')).status, 200)
  })

  it('/api/auth/me menampilkan admin saat login', async () => {
    const c = new Client()
    await c.login()
    const r = await c.get('/api/auth/me')
    assert.equal(r.status, 200)
    assert.ok(r.json.admin)
    assert.equal(r.json.username, ADMIN_USER)
  })

  it('setelah logout, token lama tidak berlaku lagi', async () => {
    const c = new Client()
    await c.login()
    const old = c.cookie
    assert.equal((await c.post('/api/auth/logout')).status, 200)
    const replay = new Client()
    replay.cookie = old
    assert.equal((await replay.get('/api/donations')).status, 401)
  })

  it('origin asing ditolak 403 (anti-CSRF)', async () => {
    const r = await new Client().request('POST', '/api/auth/login', { username: 'a', password: 'b' }, { Origin: 'http://situs-jahat.com' })
    assert.equal(r.status, 403)
  })
})

describe('Admin: CRUD dengan login', () => {
  const admin = new Client()
  const pub = new Client()
  before(async () => {
    const r = await admin.login()
    assert.equal(r.status, 200, 'login admin tes harus berhasil')
  })

  it('Blog: tambah, baca publik, ubah, hapus', async () => {
    const created = await admin.post('/api/blog', { title: `${TAG} blog`, desc: 'deskripsi', content: ['paragraf satu'] })
    assert.equal(created.status, 201)
    const { id, slug } = created.json
    try {
      assert.equal((await pub.get(`/api/blog/${slug}`)).status, 200)
      const upd = await admin.put(`/api/blog/${id}`, { title: `${TAG} blog diubah` })
      assert.equal(upd.status, 200)
      assert.equal((await pub.get(`/api/blog/${slug}`)).json.title, `${TAG} blog diubah`)
    } finally {
      assert.equal((await admin.del(`/api/blog/${id}`)).status, 200)
    }
    assert.equal((await pub.get(`/api/blog/${slug}`)).status, 404)
  })

  it('Blog: judul kosong ditolak 400', async () => {
    assert.equal((await admin.post('/api/blog', { title: '   ' })).status, 400)
  })

  it('Program: tambah, baca publik, ubah, hapus', async () => {
    const created = await admin.post('/api/programs', { title: `${TAG} program`, desc: 'deskripsi', target: 1000 })
    assert.equal(created.status, 201)
    const { id, slug } = created.json
    try {
      assert.equal((await pub.get(`/api/programs/${slug}`)).status, 200)
      assert.equal((await admin.put(`/api/programs/${id}`, { title: `${TAG} program diubah` })).status, 200)
    } finally {
      assert.equal((await admin.del(`/api/programs/${id}`)).status, 200)
    }
    assert.equal((await pub.get(`/api/programs/${slug}`)).status, 404)
  })

  it('Tim: tambah, muncul di daftar publik, ubah, hapus', async () => {
    const created = await admin.post('/api/team', { name: `${TAG} tim`, role: 'Penguji' })
    assert.equal(created.status, 201)
    const id = created.json.id
    try {
      assert.ok(list((await pub.get('/api/team')).json).some((m) => String(m.id) === String(id)))
      assert.equal((await admin.put(`/api/team/${id}`, { role: 'Penguji 2' })).status, 200)
    } finally {
      assert.equal((await admin.del(`/api/team/${id}`)).status, 200)
    }
  })

  it('Tim: nama atau jabatan kosong ditolak 400', async () => {
    assert.equal((await admin.post('/api/team', { name: 'x' })).status, 400)
  })

  it('Menu dan halaman: HTML disanitasi, draft tidak tampil ke publik, hapus', async () => {
    const slug = `test-api-${Date.now()}`
    const created = await admin.post('/api/menus', { name: `${TAG} menu`, slug, templateType: 'text' })
    assert.equal(created.status, 201)
    const id = created.json.id
    try {
      const saved = await admin.put(`/api/menus/${id}/page`, {
        title: `${TAG} halaman`,
        status: 'draft',
        bodyHtml: '<p>halo</p><img src=x onerror=alert(1)><script>alert(2)</script><a href="javascript:alert(3)">x</a>',
      })
      assert.equal(saved.status, 200)
      assert.doesNotMatch(saved.json.bodyHtml, /onerror|<script|javascript:/i)
      assert.match(saved.json.bodyHtml, /<p>halo<\/p>/)

      const draft = await pub.get(`/api/menus/${slug}`)
      assert.ok(draft.status === 404 || !/halo/.test(draft.text), 'draft tidak boleh tampil ke publik')

      await admin.put(`/api/menus/${id}/page`, { status: 'published' })
      const open = await pub.get(`/api/menus/${slug}`)
      assert.equal(open.status, 200)
      assert.doesNotMatch(open.text, /onerror|<script|javascript:/i)
    } finally {
      assert.equal((await admin.del(`/api/menus/${id}`)).status, 200)
    }
  })

  it('Donasi: kirim publik, muncul di admin, ubah status, pindah ke Sampah, hapus permanen', async () => {
    const sent = await pub.post('/api/donations', { donorName: `${TAG} donatur`, amount: 12345, source: 'tes', ...(await captcha(pub)) })
    assert.equal(sent.status, 201)
    const id = sent.json.id
    try {
      assert.ok(list((await admin.get('/api/donations')).json).some((d) => String(d.id) === String(id)), 'donasi harus ada di daftar admin')
      assert.equal((await admin.get('/api/donations/stats')).status, 200)
      assert.equal((await admin.patch(`/api/donations/${id}/status`, { status: 'terverifikasi' })).status, 200)
      assert.equal((await admin.patch(`/api/donations/${id}/status`, { status: 'ngawur' })).status, 400)
      assert.equal((await admin.post('/api/donations/bulk-delete', { ids: [id] })).status, 200)
      assert.ok(!list((await admin.get('/api/donations')).json).some((d) => String(d.id) === String(id)), 'harus hilang dari daftar utama')
    } finally {
      assert.equal((await admin.post('/api/donations/bulk-purge', { ids: [id] })).status, 200)
    }
  })

  it('Pesan masuk: kirim publik, muncul di admin, ubah status, hapus', async () => {
    const sent = await pub.post('/api/contact-messages', {
      name: `${TAG} pengirim`, email: 'tes@contoh.com', phone: '08123456789', message: 'tes otomatis', consent: true, ...(await captcha(pub)),
    })
    assert.equal(sent.status, 201)
    const id = sent.json.id
    try {
      assert.ok(list((await admin.get('/api/contact-messages')).json).some((m) => String(m.id) === String(id)))
      assert.equal((await admin.patch(`/api/contact-messages/${id}`, { status: 'dibaca' })).status, 200)
      assert.equal((await admin.patch(`/api/contact-messages/${id}`, { status: 'ngawur' })).status, 400)
    } finally {
      assert.equal((await admin.del(`/api/contact-messages/${id}`)).status, 200)
    }
  })

  it('Upload: gambar sah diterima, file palsu dan tipe tak didukung ditolak', async () => {
    const ok = await admin.post('/api/uploads', { dataUrl: PNG_1PX, watermark: false })
    assert.equal(ok.status, 201)
    const file = path.join(UPLOAD_DIR, path.basename(new URL(ok.json.url).pathname))
    try {
      assert.match(path.basename(file), /^\d+-[0-9a-f]{12}\.png$/, 'nama file harus diacak')
      assert.ok(fs.existsSync(file))
    } finally {
      fs.rmSync(file, { force: true })
    }
    const fake = 'data:image/png;base64,' + Buffer.from('ini bukan gambar, hanya teks biasa').toString('base64')
    assert.equal((await admin.post('/api/uploads', { dataUrl: fake })).status, 415)
    const svg = await admin.post('/api/uploads', { dataUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' })
    assert.ok([400, 415].includes(svg.status), `SVG harus ditolak (dapat ${svg.status})`)
    assert.equal((await admin.post('/api/uploads', { dataUrl: 'bukan-data-url' })).status, 400)
  })

  it('Audit log mencatat login dan aksi admin', async () => {
    const r = await admin.get('/api/security/audit?limit=100')
    assert.equal(r.status, 200)
    const rows = list(r.json)
    assert.ok(rows.some((x) => x.actor === ADMIN_USER && x.action === 'login'), 'harus ada entri login')
    assert.ok(rows.some((x) => x.actor === ADMIN_USER && /^(POST|PUT|PATCH|DELETE) /.test(x.action)), 'harus ada entri aksi admin')
    assert.doesNotMatch(JSON.stringify(rows.slice(0, 20)), new RegExp(ADMIN_PASS), 'password tidak boleh tersimpan di audit log')
  })

  it('Ringkasan keamanan tersedia untuk admin', async () => {
    const r = await admin.get('/api/security/overview')
    assert.equal(r.status, 200)
    assert.equal(typeof r.json.adminAccounts, 'number')
  })
})

describe('Ketahanan input', () => {
  const pub = new Client()
  it('JSON rusak membalas 400 dengan pesan umum', async () => {
    const res = await fetch(`http://localhost:${process.env.TEST_PORT || 3099}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' }, body: '{rusak',
    })
    assert.equal(res.status, 400)
    assert.doesNotMatch(await res.text(), /at \w|node_modules|stack/i)
  })

  it('body lebih dari 1 MB ditolak 413', async () => {
    const r = await pub.post('/api/auth/login', { username: 'x'.repeat(2_000_000), password: 'x' })
    assert.equal(r.status, 413)
  })

  it('SQL injection di login dan parameter publik tidak menembus', async () => {
    assert.equal((await pub.post('/api/auth/login', { username: "admin' OR '1'='1", password: 'x' })).status, 401)
    const r = await pub.get("/api/blog/'%20OR%201=1--")
    assert.equal(r.status, 404)
    assert.doesNotMatch(r.text, /syntax|postgres|pg_|relation/i)
  })
})
