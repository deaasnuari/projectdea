// Tes endpoint upload TANPA database dan TANPA Blob store asli: router asli dipasang
// di app kecil, SDK asli @vercel/blob diarahkan ke server tiruan.
// Jalankan sendiri: node --test tests/upload.test.js
const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { startFakeBlob, TOKEN, PUBLIC_HOST } = require('./fakeBlob')

process.env.SESSION_SECRET = 'rahasia-khusus-tes-upload-0123456789abcdef'
process.env.VERCEL_BLOB_RETRIES = '0'

const express = require('express')
const cookieParser = require('cookie-parser')
const sharp = require('sharp')
const uploadRoutes = require('../src/routes/uploads.routes')
const { createToken, COOKIE_NAME } = require('../src/lib/session')
const { UPLOAD_DIR } = require('../src/lib/imageStorage')

let server
let base
let png
let fake
const logs = []

const setEnv = (values) => {
  for (const k of ['BLOB_READ_WRITE_TOKEN', 'NODE_ENV', 'VERCEL']) delete process.env[k]
  Object.assign(process.env, values)
}
const dataUrl = (buf, type = 'png') => `data:image/${type};base64,${buf.toString('base64')}`
const upload = async (body, { login = true } = {}) => {
  const res = await fetch(`${base}/api/uploads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(login ? { Cookie: `${COOKIE_NAME}=${createToken('qa')}` } : {}) },
    body: JSON.stringify(body),
  })
  return { status: res.status, json: await res.json().catch(() => ({})) }
}

before(async () => {
  fake = await startFakeBlob()
  process.env.VERCEL_BLOB_API_URL = fake.apiUrl
  png = await sharp({ create: { width: 600, height: 400, channels: 3, background: '#888888' } }).png().toBuffer()
  const app = express()
  app.use(express.json({ limit: '15mb' }))
  app.use(cookieParser())
  app.use('/api/uploads', uploadRoutes)
  server = app.listen(0)
  base = `http://localhost:${server.address().port}`
  for (const m of ['log', 'warn', 'error']) console[m] = (...a) => logs.push(a.join(' '))
})
after(() => {
  server.close()
  fake.close()
})
beforeEach(() => {
  fake.state.puts.length = 0
  fake.state.fail = null
  setEnv({ BLOB_READ_WRITE_TOKEN: TOKEN })
})

describe('Upload ke Vercel Blob', () => {
  it('tanpa login ditolak 401 dan Blob tidak dipanggil', async () => {
    assert.equal((await upload({ dataUrl: dataUrl(png) }, { login: false })).status, 401)
    assert.equal(fake.state.puts.length, 0)
  })

  it('berhasil: 201 dengan URL Blob publik di awalan lazispln/', async () => {
    const r = await upload({ dataUrl: dataUrl(png) })
    assert.equal(r.status, 201)
    assert.ok(r.json.url.startsWith(`${PUBLIC_HOST}/lazispln/`), r.json.url)
    assert.match(r.json.url, /\/\d+-[0-9a-f]{12}\.png$/)
  })

  it('SDK mengirim akses public, content-type benar, dan token sebagai Bearer', async () => {
    await upload({ dataUrl: dataUrl(png) })
    const [put] = fake.state.puts
    assert.equal(put.headers['x-vercel-blob-access'], 'public')
    assert.equal(put.headers['x-content-type'], 'image/png')
    assert.equal(put.headers.authorization, `Bearer ${TOKEN}`)
  })

  it('watermark mengubah file; watermark:false mengirim file apa adanya', async () => {
    await upload({ dataUrl: dataUrl(png) })
    await upload({ dataUrl: dataUrl(png), watermark: false })
    assert.ok(!fake.state.puts[0].body.equals(png))
    assert.ok(fake.state.puts[1].body.equals(png))
  })

  it('tidak menulis file apa pun ke folder uploads', async () => {
    const count = () => (fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR).length : 0)
    const awal = count()
    await upload({ dataUrl: dataUrl(png) })
    assert.equal(count(), awal)
  })

  for (const [nama, body, status] of [
    ['bukan data URL', { dataUrl: 'halo' }, 400],
    ['tipe SVG', { dataUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' }, 400],
    ['tipe BMP', { dataUrl: 'data:image/bmp;base64,Qk0=' }, 415],
    ['isi teks berlabel PNG', { dataUrl: dataUrl(Buffer.from('ini bukan gambar sama sekali')) }, 415],
    ['lebih dari 3 MB', { dataUrl: dataUrl(Buffer.alloc(3 * 1024 * 1024 + 1, 1)) }, 413],
  ]) {
    it(`validasi: ${nama} ditolak ${status} sebelum menyentuh Blob`, async () => {
      const r = await upload(body)
      assert.equal(r.status, status)
      assert.ok(r.json.error)
      assert.equal(fake.state.puts.length, 0)
    })
  }

  for (const [nama, fail, status, pesan] of [
    ['token ditolak', { status: 403, code: 'forbidden' }, 502, /token/i],
    ['store tidak ada', { status: 404, code: 'store_not_found' }, 502, /tidak ditemukan/i],
    ['store dinonaktifkan', { status: 403, code: 'store_suspended' }, 502, /dinonaktifkan/i],
    ['terlalu banyak permintaan', { status: 429, code: 'rate_limited' }, 503, /sibuk/i],
    ['layanan mati', { status: 503, code: 'service_unavailable' }, 503, /sibuk/i],
    ['store private', { status: 400, code: 'bad_request', message: 'Cannot use public access on a private store' }, 502, /Public/],
    ['error tak dikenal', { status: 500, code: 'unknown_error' }, 502, /gagal menyimpan/i],
  ]) {
    it(`gagal di Blob (${nama}) → ${status} dengan pesan jelas, tanpa token`, async () => {
      fake.state.fail = fail
      const r = await upload({ dataUrl: dataUrl(png) })
      assert.equal(r.status, status, JSON.stringify(r.json))
      assert.match(r.json.error, pesan)
      assert.ok(!(JSON.stringify(r.json) + logs.join('\n')).includes('rahasiaTesJanganBocor'), 'token bocor')
    })
  }

  it('production tanpa token → 503, tidak jatuh ke folder lokal', async () => {
    setEnv({ NODE_ENV: 'production' })
    const r = await upload({ dataUrl: dataUrl(png) })
    assert.equal(r.status, 503)
    assert.match(r.json.error, /belum dikonfigurasi/i)
  })

  it('di Vercel tanpa token → 503', async () => {
    setEnv({ VERCEL: '1' })
    assert.equal((await upload({ dataUrl: dataUrl(png) })).status, 503)
  })

  it('development tanpa token → disimpan lokal seperti semula', async () => {
    setEnv({})
    const r = await upload({ dataUrl: dataUrl(png), watermark: false })
    assert.equal(r.status, 201)
    const file = path.join(UPLOAD_DIR, path.basename(r.json.url))
    try {
      assert.match(r.json.url, /\/uploads\/\d+-[0-9a-f]{12}\.png$/)
      assert.ok(fs.existsSync(file))
    } finally {
      fs.rmSync(file, { force: true })
    }
  })
})
