// Tempat menyimpan gambar upload admin.
//
//  - Vercel Blob (store akses Public): dipakai kalau BLOB_READ_WRITE_TOKEN terisi.
//    WAJIB di production (filesystem Vercel read-only dan tidak permanen).
//  - Folder lokal ./uploads: HANYA untuk development tanpa token.
//
// Token tidak pernah ditulis ke log maupun ke respons API.
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const blob = require('@vercel/blob')

// Folder file gambar lokal. Di-gitignore; dilayani statis lewat /uploads di server.js.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads')
// Awalan nama file di Blob store. Hanya file di awalan ini yang boleh dihapus aplikasi.
const BLOB_PREFIX = 'lazispln/'
const TIMEOUT_MS = 20_000

// Error yang aman ditampilkan ke admin: `status` = kode HTTP, `message` = pesan jelas.
// `detail` hanya untuk log server (sudah dibersihkan dari token).
class StorageError extends Error {
  constructor(status, message, detail = '') {
    super(message)
    this.name = 'StorageError'
    this.status = status
    this.detail = detail
  }
}

const token = () => String(process.env.BLOB_READ_WRITE_TOKEN || '').trim()

// 'blob' | 'local' | 'unconfigured'
function storageMode() {
  if (token()) return 'blob'
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) return 'unconfigured'
  return 'local'
}

const scrub = (text) => {
  const t = token()
  return String(text || '').split(t || '\u0000').join('[disamarkan]').replace(/vercel_blob_rw_\w+/g, '[disamarkan]').slice(0, 300)
}

const is = (err, name) => typeof blob[name] === 'function' && err instanceof blob[name]

function toStorageError(err) {
  const detail = scrub(`${err?.constructor?.name || 'Error'}: ${err?.message}`)
  if (err?.name === 'TimeoutError' || err?.name === 'AbortError' || is(err, 'BlobRequestAbortedError')) {
    return new StorageError(504, 'Penyimpanan gambar terlalu lama merespons. Coba lagi.', detail)
  }
  if (is(err, 'BlobAccessError')) {
    return new StorageError(502, 'Penyimpanan gambar menolak token. Periksa BLOB_READ_WRITE_TOKEN di server.', detail)
  }
  if (is(err, 'BlobStoreNotFoundError') || is(err, 'BlobStoreSuspendedError')) {
    return new StorageError(502, 'Blob store tidak ditemukan atau dinonaktifkan. Periksa dashboard Vercel.', detail)
  }
  if (/private store|public access/i.test(err?.message || '')) {
    return new StorageError(502, 'Blob store harus berakses Public. Buat store baru dengan akses Public.', detail)
  }
  if (is(err, 'BlobServiceRateLimited') || is(err, 'BlobServiceNotAvailable')) {
    return new StorageError(503, 'Penyimpanan gambar sedang sibuk. Coba lagi sebentar.', detail)
  }
  if (is(err, 'BlobContentTypeNotAllowedError')) return new StorageError(415, 'Tipe gambar tidak didukung', detail)
  if (is(err, 'BlobFileTooLargeError')) return new StorageError(413, 'Gambar maksimal 3MB', detail)
  return new StorageError(502, 'Gagal menyimpan gambar ke penyimpanan cloud. Periksa koneksi lalu coba lagi.', detail)
}

const randomName = (ext) => `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`

async function saveToBlob(buf, ext) {
  let result
  try {
    result = await blob.put(`${BLOB_PREFIX}${randomName(ext)}`, buf, {
      access: 'public',
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      token: token(),
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    throw toStorageError(err)
  }
  if (typeof result?.url !== 'string' || !result.url.startsWith('https://')) {
    throw new StorageError(502, 'Respons penyimpanan gambar tidak lengkap. Coba lagi.', 'url kosong')
  }
  return result.url
}

function saveToDisk(buf, ext, publicBase) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const name = randomName(ext)
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf)
  return `${publicBase}/uploads/${name}`
}

// Simpan gambar yang SUDAH divalidasi, kembalikan URL publiknya.
async function saveImage(buf, ext, { publicBase }) {
  const mode = storageMode()
  if (mode === 'blob') return saveToBlob(buf, ext)
  if (mode === 'local') return saveToDisk(buf, ext, publicBase)
  throw new StorageError(503, 'Penyimpanan gambar belum dikonfigurasi di server.', 'Isi BLOB_READ_WRITE_TOKEN')
}

async function deleteBlobs(urls) {
  await blob.del(urls, { token: token(), abortSignal: AbortSignal.timeout(TIMEOUT_MS) })
}

module.exports = { saveImage, deleteBlobs, storageMode, scrub, StorageError, UPLOAD_DIR, BLOB_PREFIX }
