// Tes penghapusan Blob tak terpakai: server backend sungguhan + database LOKAL +
// Blob API tiruan. Jalankan sendiri: node --test tests/cleanup.test.js
process.env.TEST_PORT = '3097' // beda port dari api.test.js (file tes berjalan paralel)

const { describe, it, before, after, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const { startServer, stopServer, Client } = require('./helpers')
const { startFakeBlob, TOKEN, PUBLIC_HOST } = require('./fakeBlob')

const TAG = `TEST BLOB ${Date.now()}`
const url = (n) => `${PUBLIC_HOST}/lazispln/${Date.now()}-${n}.png`
const admin = new Client()
let fake

before(async () => {
  fake = await startFakeBlob()
  await startServer({ BLOB_READ_WRITE_TOKEN: TOKEN, VERCEL_BLOB_API_URL: fake.apiUrl, VERCEL_BLOB_RETRIES: '0', BLOB_ALLOW_DELETE: '1' })
  assert.equal((await admin.login()).status, 200)
})
after(() => {
  stopServer()
  fake.close()
})
beforeEach(() => {
  fake.state.deleted.length = 0
  fake.state.fail = null
})

const newPost = async (image) => {
  const r = await admin.post('/api/blog', { title: `${TAG} ${Math.random()}`, image })
  assert.equal(r.status, 201)
  return r.json.id
}

describe('Pembersihan gambar Blob', () => {
  it('ganti gambar artikel → hanya gambar lama yang dihapus', async () => {
    const [a, b] = [url('aaa'), url('bbb')]
    const id = await newPost(a)
    assert.equal(fake.state.deleted.length, 0, 'membuat data tidak boleh menghapus apa pun')
    assert.equal((await admin.put(`/api/blog/${id}`, { image: b })).status, 200)
    assert.deepEqual(fake.state.deleted, [a])
    assert.equal((await admin.del(`/api/blog/${id}`)).status, 200)
    assert.deepEqual(fake.state.deleted, [a, b])
  })

  it('mengubah judul saja tidak menghapus gambar', async () => {
    const a = url('judul')
    const id = await newPost(a)
    await admin.put(`/api/blog/${id}`, { title: `${TAG} baru` })
    assert.deepEqual(fake.state.deleted, [])
    await admin.del(`/api/blog/${id}`)
  })

  it('gambar yang masih dipakai data lain tidak dihapus', async () => {
    const shared = url('bersama')
    const first = await newPost(shared)
    const second = await newPost(shared)
    await admin.del(`/api/blog/${first}`)
    assert.deepEqual(fake.state.deleted, [])
    await admin.del(`/api/blog/${second}`)
    assert.deepEqual(fake.state.deleted, [shared])
  })

  it('gambar di dalam isi HTML halaman menu ikut terlacak (beda tabel)', async () => {
    const [inHtml, alsoInBlog] = [url('html'), url('dua-tempat')]
    const post = await newPost(alsoInBlog)
    const menu = await admin.post('/api/menus', { name: `${TAG} menu`, slug: `test-blob-${Date.now()}`, templateType: 'text' })
    assert.equal(menu.status, 201)
    await admin.put(`/api/menus/${menu.json.id}/page`, { bodyHtml: `<p>x</p><img src="${inHtml}"><img src="${alsoInBlog}">`, status: 'draft' })
    await admin.del(`/api/blog/${post}`)
    assert.deepEqual(fake.state.deleted, [], 'masih dipakai di halaman menu')
    await admin.del(`/api/menus/${menu.json.id}`)
    assert.deepEqual([...fake.state.deleted].sort(), [inHtml, alsoInBlog].sort())
  })

  it('permintaan yang gagal tidak menghapus apa pun', async () => {
    const a = url('gagal')
    const id = await newPost(a)
    assert.equal((await admin.put('/api/blog/999999999', { image: url('x') })).status, 404)
    assert.deepEqual(fake.state.deleted, [])
    await admin.del(`/api/blog/${id}`)
  })

  it('URL di luar awalan lazispln/ tidak pernah dihapus', async () => {
    const lain = `${PUBLIC_HOST}/milik-aplikasi-lain/foto.png`
    const id = await newPost(lain)
    await admin.del(`/api/blog/${id}`)
    assert.deepEqual(fake.state.deleted, [])
  })

  it('Blob API gagal → aksi admin tetap berhasil', async () => {
    const id = await newPost(url('api-gagal'))
    fake.state.fail = { status: 500, code: 'unknown_error' }
    assert.equal((await admin.del(`/api/blog/${id}`)).status, 200)
  })

  it('tanpa login tidak memicu penghapusan', async () => {
    const a = url('anonim')
    const id = await newPost(a)
    assert.equal((await new Client().del(`/api/blog/${id}`)).status, 401)
    assert.deepEqual(fake.state.deleted, [])
    await admin.del(`/api/blog/${id}`)
  })
})
